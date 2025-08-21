export interface Rap {
    maHeThongRap:  string;
    tenHeThongRap: string;
    biDanh:        string;
    logo:          string;
}
export interface Cinema {
  maHeThongRap: string;
  tenHeThongRap: string;
}

export interface LichChieuPhim {
    maLichChieu:       string;
    maRap:             string;
    tenRap:            string;
    ngayChieuGioChieu: Date;
    giaVe:             number;
    thoiLuong:         number;
}

export interface CumRap {
  lichChieuPhim: LichChieuPhim[];
  maCumRap: string;
  tenCumRap: string;
  hinhAnh: string;
  diaChi: string;
}

export interface HeThongRap {
  cumRapChieu: CumRap[];
  maHeThongRap: string;
  tenHeThongRap: string;
  logo: string;
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
export interface MovieShowtime {
  maPhim: number;
  tenPhim: string;
  hinhAnh: string;
  moTa: string;
  heThongRapChieu: any[]; 
}
export interface LstLichChieuTheoPhim {
    maLichChieu:       number;
    maRap:             string;
    tenRap:            string;
    ngayChieuGioChieu: Date;
    giaVe:             number;
}