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
    console.log('Sending register request:', JSON.stringify(registerData, null, 2));
    
    const response = await api.post<BaseAPIResponse<Register>>(
      "/QuanLyNguoiDung/DangKy",
      registerData
    );
    
    console.log('Register API response:', response);
    
    // Kiểm tra response thành công
    if (response.status === 200 || response.status === 201) {
      return response.data.content || registerData;
    }
    
    return undefined;
    
  } catch (error: any) {
    console.error("Error registering user:", error);
    
    // Log chi tiết để debug
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    
    throw error; // Ném lỗi để component handle
  }
};