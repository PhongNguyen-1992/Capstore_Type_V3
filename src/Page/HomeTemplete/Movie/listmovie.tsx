import { useQuery } from "@tanstack/react-query";
import { getListMovie } from "../../../service/movie.api";
import type { Movie } from "../../../interfaces/movie.interface";
import MovieCard from "./movie";
import { Flex, Spin } from "antd";

export default function MovieList() {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<Movie[]>({
    queryKey: ["get-movie"],
    queryFn: getListMovie,
  });

  if (isLoading)
    return (
      <Flex align="center" justify="center" style={{height:"100vh"}} gap="middle">
        {" "}
        <Spin size="large" />
      </Flex>
    );
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
