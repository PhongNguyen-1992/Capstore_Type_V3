import type { AxiosResponse } from "axios";
import api from "./api";
import type { Banner } from "../interfaces/movie.interface";
import type { BaseAPIResponse } from "../interfaces/base.interface";



export const getListBanner = async (): Promise <Banner[] | undefined> => {
  try {
    const response = await api.get<BaseAPIResponse<Banner[]>>(
      "/QuanLyPhim/LayDanhSachBanner"
    );
    return response.data.content; // danh sách banner
  } catch (error) {
    console.error("Error fetching banners:", error);
  }
};

