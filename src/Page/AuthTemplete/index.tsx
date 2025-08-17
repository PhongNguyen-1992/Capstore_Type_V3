import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { userAuthStore } from "../../store";
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
      <Outlet />     
    </div>
  );
}
