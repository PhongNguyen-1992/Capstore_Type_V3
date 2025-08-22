import type { CurrentUser, Register } from "../interfaces/auth.interface";
import type { BaseAPIResponse } from "../interfaces/base.interface";
import api from "./api";

type loginDataRequest = {
  taiKhoan: string;
  matKhau: string;
};
export const loginAPI = async (data: loginDataRequest) => {
  try {
    const response = await api.post<BaseAPIResponse<CurrentUser>>(
      "/QuanLyNguoiDung/DangNhap",
      data
    );
    return response.data.content;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const registerUser = async (
  registerData: Register
): Promise<Register | undefined> => {
  try {
    const response = await api.post<BaseAPIResponse<Register>>(
      "/QuanLyNguoiDung/DangKy",
      registerData
    );
    return response.data.content;
  } catch (error) {
    console.error("Error registering user:", error);
    return undefined;
  }
};
