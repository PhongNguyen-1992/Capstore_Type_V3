import type { Movie } from "./movie.interface";

export interface ProfileAdmin {
  email: string;
  hoTen: string;
  maLoaiNguoiDung: string;
  maNhom: string;
  taiKhoan: string;
  matKhau: string;
  soDT: string;
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


