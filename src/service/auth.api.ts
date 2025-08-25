// src/service/auth.api.ts
import type { BaseAPIResponse } from "@/interfaces/base.interface";
import api from "./api";
import type { ProfileUser, Register } from "@/interfaces/auth.interface";



/**
 * API đăng nhập
 */
export const loginAPI = async (credentials: {
  taiKhoan: string;
  matKhau: string;
}): Promise<any> => {
  try {
    console.log("🚀 Logging in with:", credentials);

    const response = await api.post<BaseAPIResponse<any>>(
      "/QuanLyNguoiDung/DangNhap",
      credentials
    );

    const data = response.data.content;

    // ✅ Đảm bảo lưu cả token + user
    const userData = {
      ...data,
      accessToken: data.accessToken, // 👈 token server trả về
    };

    localStorage.setItem("user", JSON.stringify(userData));

    console.log("✅ Login success, saved user:", userData);
    return userData;
  } catch (error: any) {
    console.error("❌ Login failed:", error?.response || error);
    throw new Error(
      error.response?.data?.message || "Đăng nhập thất bại, vui lòng thử lại"
    );
  }
};


// API đăng ký
export const registerUser = async (
  registerData: Register
): Promise<Register> => {
  try {
    const { data } = await api.post<BaseAPIResponse<Register>>(
      "/QuanLyNguoiDung/DangKy",
      registerData
    );

    return data.content ?? registerData;
  } catch (error) {
    throw error; 
  }
};

/**
 * API thêm người dùng mới
 */
export const addUserAPI = async (data: ProfileUser): Promise<ProfileUser> => {
  try { 

    // Lấy user trong localStorage
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      throw new Error("Vui lòng đăng nhập để thực hiện chức năng này");
    }

    const user = JSON.parse(userStr);
    if (!user.accessToken) {
      throw new Error("Token không hợp lệ. Vui lòng đăng nhập lại");
    }

    // Gửi request thêm user (token tự gắn trong api interceptor nếu có)
    const response = await api.post<BaseAPIResponse<ProfileUser>>(
      "/QuanLyNguoiDung/ThemNguoiDung",
      data
    );

    console.log("✅ User added successfully:", response.data);
    return response.data.content;
  } catch (error: any) {
    console.error("❌ Add user failed:", error?.response || error);

    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
    }

    if (error.response?.status === 400) {
      const errorMsg =
        error.response?.data?.content ||
        error.response?.data?.message ||
        "Dữ liệu không hợp lệ";
      throw new Error(errorMsg);
    }

    if (error.response?.status === 409) {
      throw new Error("Tài khoản hoặc email đã tồn tại trong hệ thống");
    }

    if (error.response?.status === 403) {
      throw new Error("Bạn không có quyền thực hiện chức năng này");
    }

    throw new Error("Có lỗi xảy ra khi thêm người dùng. Vui lòng thử lại");
  }
};

/**
 * Utility function: kiểm tra login
 */
export const isLoggedIn = (): boolean => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return false;

    const user = JSON.parse(userStr);
    return !!(user && user.accessToken);
  } catch {
    localStorage.removeItem("user");
    return false;
  }
};

/**
 * Utility function: lấy thông tin user hiện tại
 */
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    const user = JSON.parse(userStr);
    return user && user.accessToken ? user : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};
