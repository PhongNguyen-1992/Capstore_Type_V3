import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getListMovie } from "../../../service/movie.api";
import type { Movie } from "../../../interfaces/movie.interface";
import MovieCard from "./movie";

export default function MovieList() {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<Movie[]>({
    queryKey: ["get-movie"],
    queryFn: getListMovie,
  });

  if (isLoading) return <p>Đang tải...</p>;
  if (isError) return <p>Có lỗi xảy ra!</p>;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        justifyContent: "space-evenly",
      }}
    >
      {data.map((movie) => (
        <MovieCard key={movie.maPhim} movie={movie} />
      ))}
    </div>
  );
}
