import api from "./api";
import type { BaseAPIResponse } from "@/interfaces/base.interface";
import type {   
  PaginatedMovieResponse,
  PaginatedUserResponse,
  ProfileAdmin,  
} from "@/interfaces/admin.interface";
import type { loginDataRequest } from "@/interfaces/auth.interface";
import type { Movie } from "@/interfaces/movie.interface";

// Lấy danh sách admin
export const getAdminProfileAPI = async (
  maNhom: string = "GP01",
  tuKhoa: string = ""
): Promise<ProfileAdmin[]> => {
  const response = await api.get<BaseAPIResponse<ProfileAdmin[]>>(
    `/QuanLyNguoiDung/LayDanhSachNguoiDung`,
    {
      params: { MaNhom: maNhom, tuKhoa },
    }
  );
  return response.data.content;
};

// Lấy danh sách user phân trang
export const getUserProfilePaginatedAPI = async (
  maNhom: string = "GP01",
  soTrang: number = 1,
  soPhanTuTrenTrang: number = 10
): Promise<PaginatedUserResponse> => {
  const response = await api.get<BaseAPIResponse<PaginatedUserResponse>>(
    `/QuanLyNguoiDung/LayDanhSachNguoiDungPhanTrang`,
    {
      params: { MaNhom: maNhom, soTrang, soPhanTuTrenTrang },
    }
  );
  return response.data.content;
};

// Lấy danh sách phim phân trang
export const getMoviePaginatedAPI = async (
  maNhom: string = "GP01",
  soTrang: number = 1,
  soPhanTuTrenTrang: number = 10
): Promise<PaginatedMovieResponse> => {
  const response = await api.get<BaseAPIResponse<PaginatedMovieResponse>>(
    `/QuanLyPhim/LayDanhSachPhimPhanTrang`,
    {
      params: { MaNhom: maNhom, soTrang, soPhanTuTrenTrang },
    }
  );
  return response.data.content;
};

// seach full trang
export const searchUsersAPI = async (
  tuKhoa: string,
  maNhom: string = "GP00",
  soTrang: number = 1,
  soPhanTuTrenTrang: number = 10
) => {
  const response = await api.get<BaseAPIResponse<PaginatedUserResponse>>(
    "/QuanLyNguoiDung/TimKiemNguoiDungPhanTrang",
    { params: { MaNhom: maNhom, tuKhoa, soTrang, soPhanTuTrenTrang } }
  );
  return response.data.content;
};
// Đếm full danh sách user
export const getAllUsersAPI = async (maNhom: string = "GP00") => {
  const response = await api.get<BaseAPIResponse<ProfileAdmin[]>>(
    "/QuanLyNguoiDung/LayDanhSachNguoiDung",
    { params: { MaNhom: maNhom } }
  );
  return response.data.content;
};

// Thêm phim

// Cập nhật phim

export const updateMovieAPI = async (formData: FormData): Promise<Movie> => {
  const response = await api.post<BaseAPIResponse<Movie>>(
    `/QuanLyPhim/CapNhatPhimUpload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.content;
};

/**
 * API: Xoá phim theo mã phim
 */
export const deleteMovieAPI = async (maPhim: number | string): Promise<any> => {
  try {
    const user = localStorage.getItem("user");
    const token = user ? JSON.parse(user).accessToken : "";

    const response = await api.delete<BaseAPIResponse<any>>(
      `/QuanLyPhim/XP`,
      {
        params: { MaPhim: maPhim.toString() }, // Ép string cho chắc
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.content;
  } catch (error: any) {
    console.error("❌ deleteMovieAPI error:", error.response?.data || error);
    throw error;
  }
};
// loginAPI.ts
export const loginAPI = async (data: loginDataRequest) => {
  const res = await api.post<BaseAPIResponse<loginDataRequest>>(
    "/QuanLyNguoiDung/DangNhap",
    data
  );

  if (res.data.content) {
    // luôn lưu 1 key duy nhất
    localStorage.setItem("user", JSON.stringify(res.data.content)); 
   }

  return res.data.content;
};
