import type { AxiosResponse } from "axios";
import api from "./api";
import type { Banner, DetailMovie, Movie } from "../interfaces/movie.interface";
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

export const getListMovie = async ()=> {
  try {
    const response = await api.get<BaseAPIResponse<Movie[]>>("/QuanLyPhim/LayDanhSachPhim?maNhom=GP01");
    return response.data.content
  }
  catch (error){{
    console.log("Loi:",error)
    throw(error);
    
  }}

}

export const getMovieDetailsAPI = async (movieID:any) => {

    try {
        const response = await api.get<BaseAPIResponse<DetailMovie>>(
            `/QuanLyPhim/LayThongTinPhim?MaPhim=${movieID}`
        );
        return response.data.content
    } catch (error) {
    }
};
console.log(getMovieDetailsAPI);
