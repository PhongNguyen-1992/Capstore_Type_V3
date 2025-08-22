import type { BaseAPIResponse } from "@/interfaces/base.interface";
import type {
  CumRap,
  HeThongRap,
  LichChieuPhim,
  MovieShowtime,
} from "@/interfaces/rap.interface";
import api from "./api";

// Danh sách hệ thống rạp
export const getListCumRap = async (): Promise<HeThongRap[] | undefined> => {
  try {
    const response = await api.get<BaseAPIResponse<HeThongRap[]>>(
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

// ==== Hàm lọc suất chiếu theo Hệ thống + Cụm Rạp ====
export const getSuatChieu = async (
  maPhim: number,
  maHeThongRap: string,
  maCumRap: string
): Promise<LichChieuPhim[]> => {
  try {
    const data = await getLichChieuPhim(maPhim);

    if (!data) return [];

    // Tìm hệ thống rạp theo mã
    const heThong = data.heThongRapChieu.find(
      (h) => h.maHeThongRap === maHeThongRap
    );
    if (!heThong) return [];

    // Tìm cụm rạp trong hệ thống đó
    const cumRap = heThong.cumRapChieu.find((c) => c.maCumRap === maCumRap);
    if (!cumRap) return [];

    // Trả về danh sách suất chiếu
    return cumRap.lichChieuPhim || [];
  } catch (error) {
    console.error("Error fetching suat chieu:", error);
    return [];
  }
};
