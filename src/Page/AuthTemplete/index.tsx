import { Navigate, Outlet } from "react-router-dom";
import { userAuthStore } from "../../store";
import Header from "../Componnent/Headder";
import Footer from "../Componnent/Footer";

export default function AuthTemplte() {
  const { user } = userAuthStore();

  // Nếu chưa login thì cho vào trang Auth (login/register)
  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <Outlet />
        <Footer />
      </div>
    );
  }

  // Nếu login rồi thì chuyển hướng theo loại người dùng
  if (user.maLoaiNguoiDung === "QuanTri") {
    return <Navigate to="/admin" replace />;
  }

  if (user.maLoaiNguoiDung === "KhachHang") {
    return <Navigate to="/" replace />;
  }

  // fallback: nếu có role lạ thì quay về home
  return <Navigate to="/" replace />;
}
