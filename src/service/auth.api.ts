
import type { CurrentUser } from "../interfaces/auth.interface";
import type { BaseAPIResponse } from "../interfaces/base.interface";
import api from "./api";

type loginDataRequest = {
  taiKhoan: string;
  matKhau: string;
};
export const loginAPI = async (data: loginDataRequest) => {
  try {
    const response = await api.post<BaseAPIResponse<CurrentUser>>("/QuanLyNguoiDung/DangNhap", data);
  return  response.data.content;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
