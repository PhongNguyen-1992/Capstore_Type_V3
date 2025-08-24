import type { Movie } from "./movie.interface";

export interface ProfileAdmin {
  email: string;
  hoTen: string;
  maLoaiNguoiDung: string;
  maNhom: string; 
  taiKhoan: string;
  matKhau:string
  soDT:string
}


export interface ProfileUser {
  email: string;
  hoTen: string;
  maLoaiNguoiDung: string;
  maNhom: string; 
  taiKhoan: string;
  matKhau:string
  soDT:string
} 

//Phân Trang User
export interface PaginatedUserResponse {
  currentPage: number;
  count: number;
  totalPages: number;
  totalCount: number;
  items: ProfileAdmin[];
}

//Phân Trang Movie
export interface PaginatedMovieResponse { 
  currentPage: number;
  count: number;
  totalPages: number;
  totalCount: number;
  items: Movie[];
}

//Addmovie
export interface MovieFormData {
  maPhim?: number;
  tenPhim: string;
  biDanh: string;
  trailer: string;
  moTa: string;
  maNhom?: string;          // Ví dụ: GP01
  ngayKhoiChieu: string;   // dạng DD/MM/YYYY
  dangChieu: boolean;
  sapChieu: boolean;
  hot: boolean;
  danhGia: number;
  hinhAnh: File | null;
}