export interface HeThongRap {
  cumRapChieu: CumRap[];
  maHeThongRap: string;
  tenHeThongRap: string;
  logo: string;
}

export interface CumRap {
  lichChieuPhim: LichChieuPhim[];
  maCumRap: string;
  tenCumRap: string;
  hinhAnh: string;
  diaChi: string;
}

export interface LichChieuPhim {
    maLichChieu:       string;
    maRap:             string;
    tenRap:            string;
    ngayChieuGioChieu: Date;
    giaVe:             number;
    thoiLuong:         number;
}

export interface MovieShowtime {
  heThongRapChieu: HeThongRap[];
}



export interface LichChieuPhimResponse {
  heThongRapChieu: HeThongRap[];
  maPhim: number;
  tenPhim: string;
  biDanh: string;
  trailer: string;
  hinhAnh: string;
  moTa: string;
  maNhom: string;
  hot: boolean;
  dangChieu: boolean;
  sapChieu: boolean;
  ngayKhoiChieu: string;
  danhGia: number;
}

