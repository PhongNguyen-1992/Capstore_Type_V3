import api from "./api";
import type { BaseAPIResponse } from "@/interfaces/base.interface";
import type {
  MovieFormData,
  PaginatedMovieResponse,
  PaginatedUserResponse,
  ProfileAdmin,
  ProfileUser,
} from "@/interfaces/admin.interface";

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

// Thêm phim
export const addMovieAPI = async (data: MovieFormData): Promise<any> => {
  const formData = new FormData();
  formData.append("tenPhim", data.tenPhim);
  formData.append("biDanh", data.biDanh);
  formData.append("trailer", data.trailer);
  formData.append("moTa", data.moTa);
  formData.append("ngayKhoiChieu", data.ngayKhoiChieu);
  formData.append("danhGia", String(data.danhGia));
  formData.append("dangChieu", String(data.dangChieu));
  formData.append("sapChieu", String(data.sapChieu));
  formData.append("hot", String(data.hot));
  formData.append("maNhom", "GP01");
  if (data.hinhAnh) {
    formData.append("File", data.hinhAnh, data.hinhAnh.name);
  }

  const response = await api.post<BaseAPIResponse<any>>(
    `/QuanLyPhim/ThemPhimUploadHinh`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data.content;
};

// Xóa phim
export const deleteMovieAPI = async (maPhim: number): Promise<any> => {
  const response = await api.delete<BaseAPIResponse<any>>(
    `/QuanLyPhim/XoaPhim`,
    { params: { MaPhim: maPhim } }
  );
  return response.data.content;
};

// Cập nhật phim
export const updateMovieAPI = async (data: MovieFormData): Promise<any> => {
  const formData = new FormData();
  if (data.maPhim) {
    formData.append("maPhim", String(data.maPhim));
  }
  formData.append("tenPhim", data.tenPhim);
  formData.append("biDanh", data.biDanh);
  formData.append("trailer", data.trailer);
  formData.append("moTa", data.moTa);
  formData.append("ngayKhoiChieu", data.ngayKhoiChieu);
  formData.append("danhGia", String(data.danhGia));
  formData.append("dangChieu", String(data.dangChieu));
  formData.append("sapChieu", String(data.sapChieu));
  formData.append("hot", String(data.hot));
  formData.append("maNhom", "GP01");
  if (data.hinhAnh) {
    formData.append("File", data.hinhAnh, data.hinhAnh.name);
  }

  const response = await api.post<BaseAPIResponse<any>>(
    `/QuanLyPhim/CapNhatPhimUpload`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data.content;
};

export const addUserAPI = async (data: ProfileUser): Promise<any> => {
  const response = await api.post<BaseAPIResponse<any>>(
    `/QuanLyNguoiDung/ThemNguoiDung`,
    data, // API này nhận JSON, không cần FormData
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.content;
};
