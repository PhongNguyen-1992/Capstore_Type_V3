import type { BaseAPIResponse } from "@/interfaces/base.interface";
import type { Register } from "@/interfaces/user.interface";
import api from "./api";

export const registerUser = async (registerData: Register): Promise<Register | undefined> => {
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
