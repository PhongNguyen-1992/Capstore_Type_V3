import type { BaseAPIResponse } from "@/interfaces/base.interface";
import type {
  CumRap,
  MovieShowtime,
  Rap,
  SuatChieu,
} from "@/interfaces/rap.interface";
import api from "./api";

// Danh sách hệ thống rạp
export const getListCumRap = async (): Promise<Rap[] | undefined> => {
  try {
    const response = await api.get<BaseAPIResponse<Rap[]>>(
      "/QuanLyRap/LayThongTinHeThongRap"
    );
    return response.data.content;
  } catch (error) {
    console.error("Error fetching cum rap:", error);
  }
};

export const getLichChieuPhim = async (
  movieId: number
): Promise<MovieShowtime | undefined> => {
  try {
    const response = await api.get<BaseAPIResponse<MovieShowtime>>(
      `/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${movieId}`
    );
    return response.data.content;
  } catch (error) {
    console.error("Error fetching lich chieu phim:", error);
  }
};

export const diaChiRap = async (cumRap: string): Promise<CumRap> => {
  try {
    const response = await api.get<BaseAPIResponse<CumRap>>(
      `/QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${cumRap}`
    );
    return response.data.content;
  } catch (error) {
    console.error("Error fetching cụm rạp:", error);
    throw error; // ném lỗi tiếp, đảm bảo luôn trả về CumRap hoặc ném
  }
};

// API suất chiếu gốc (trả về nested object)
export const suatChieuGoc = async (
  maHeThongRap: string,
  maNhom: string = "GP01"
): Promise<any> => {
  try {
    const response = await api.get<BaseAPIResponse<any>>(
      `/QuanLyRap/LayThongTinLichChieuHeThongRap?maHeThongRap=${maHeThongRap}&maNhom=${maNhom}`
    );
    return response.data.content;
  } catch (error) {
    console.error("Error fetching suất chiếu:", error);
    throw error;
  }
};

export const getNgayChieuVaGiaVe = async (
  maHeThongRap: string,
  maNhom: string = "GP01"
): Promise<SuatChieu[]> => {
  try {
    const content = await suatChieuGoc(maHeThongRap, maNhom);

    const result: SuatChieu[] = content.flatMap((heThong: any) =>
      heThong.lstCumRap.flatMap((cumRap: any) =>
        cumRap.danhSachPhim.flatMap((phim: any) =>
          phim.lstLichChieuTheoPhim.map((lich: any) => ({
            heThongRap: heThong.tenHeThongRap, // CGV, BHD, Galaxy ...
            cumRap: cumRap.tenCumRap,          // CGV Aeon Tân Phú
            diaChi: cumRap.diaChi,             // Tầng 3, Aeon Mall
            phim: phim.tenPhim,                // Tên phim
            maPhim: phim.maPhim,               // Mã phim (nếu cần)
            ngayChieuGioChieu: lich.ngayChieuGioChieu,
            giaVe: lich.giaVe,
          }))
        )
      )
    );

    return result;
  } catch (error) {
    console.error("Error parsing suất chiếu:", error);
    return [];
  }
};

