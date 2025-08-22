import { Navigate, Outlet } from "react-router-dom";
import { userAuthStore } from "../../store";
import Header from "../HomeTemplete/Componnent/Headder";
import Footer from "../HomeTemplete/Componnent/Footer";
export default function AuthTemplte() {
  // Check Người Dùng Chuyển Trang
  const { user } = userAuthStore();
  if (user && user.maLoaiNguoiDung === "QuanTri") {
    return <Navigate to="/admin" />;
  }
  if (user && user.maLoaiNguoiDung === "KhachHang") {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <Header/>
      <Outlet />     
      <Footer/>
    </div>
  );
}
