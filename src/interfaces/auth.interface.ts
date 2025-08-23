// Interface chính xác theo API
export interface Register {
  taiKhoan: string;
  matKhau: string;
  email: string;
  soDt: string; // Chữ t thường
  maNhom: string;
  hoTen: string;
  maLoaiNguoiDung: string;
  tenLoai: string;
}

export interface CurrentUser {
  taiKhoan: string;
  hoTen: string;
  email: string;
  soDT: string;
  maNhom: string;
  maLoaiNguoiDung: string;
  accessToken: string;
}
