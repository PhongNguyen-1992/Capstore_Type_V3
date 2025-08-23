import api from "./api";
import type { BaseAPIResponse } from "@/interfaces/base.interface";
import type { PaginatedMovieResponse, PaginatedUserResponse, ProfileAdmin } from "@/interfaces/admin.interface";

export const getAdminProfileAPI = async (
  maNhom: string = "GP01",
  tuKhoa: string = ""
): Promise<ProfileAdmin[]> => {
  const response = await api.get<BaseAPIResponse<ProfileAdmin[]>>(
    `/QuanLyNguoiDung/LayDanhSachNguoiDung`,
    {
      params: {
        MaNhom: maNhom,
        tuKhoa: tuKhoa,
      },
    }
  );
  return response.data.content;
};


export const getUserProfilePaginatedAPI = async (
  maNhom: string = "GP01",
  soTrang: number = 1,
  soPhanTuTrenTrang: number = 10,  
): Promise<PaginatedUserResponse> => {
  const response = await api.get<BaseAPIResponse<PaginatedUserResponse>>(
    `/QuanLyNguoiDung/LayDanhSachNguoiDungPhanTrang`,
    {
      params: {
        MaNhom: maNhom,
        soTrang,
        soPhanTuTrenTrang,        
      },
    }
  );
  return response.data.content;
};

export const getMoviePaginatedAPI = async (
  maNhom: string = "GP01",
  soTrang: number = 1,
  soPhanTuTrenTrang: number = 10,  
): Promise<PaginatedMovieResponse> => { // Fixed: PaginatedUserResponse -> PaginatedMovieResponse
  const response = await api.get<BaseAPIResponse<PaginatedMovieResponse>>(
    `QuanLyPhim/LayDanhSachPhimPhanTrang`,
    {
      params: {
        MaNhom: maNhom,
        soTrang,
        soPhanTuTrenTrang,        
      },
    }
  );
  return response.data.content;
};