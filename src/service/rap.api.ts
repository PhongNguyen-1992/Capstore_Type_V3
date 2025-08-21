import type { BaseAPIResponse } from "@/interfaces/base.interface";
import type { CumRap, MovieShowtime, Rap } from "@/interfaces/rap.interface";
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
    console.log(response);
    
    return response.data.content;
  } catch (error) {
    console.error("Error fetching cụm rạp:", error);
    throw error; // ném lỗi tiếp, đảm bảo luôn trả về CumRap hoặc ném
  }
};

