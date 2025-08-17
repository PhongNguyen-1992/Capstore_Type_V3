export interface Banner {
  maBanner: number;
  maPhim: number;
  hinhAnh: string;
}

export interface Movie {
    maPhim:        number;
    tenPhim:       string;
    biDanh:        string;
    trailer:       string;
    hinhAnh:       string;
    moTa:          string;
    maNhom:        string;
    ngayKhoiChieu: Date;
    danhGia:       number;
    hot:           boolean;
    dangChieu:     boolean;
    sapChieu:      boolean;
}

export interface DetailMovie {
    maPhim:        number;
    tenPhim:       string;
    biDanh:        string;
    trailer:       string;
    hinhAnh:       string;
    moTa:          string;
    maNhom:        string;
    hot:           boolean;
    dangChieu:     boolean;
    sapChieu:      boolean;
    ngayKhoiChieu: Date;
    danhGia:       number;
}
