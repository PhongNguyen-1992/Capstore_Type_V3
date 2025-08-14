import React from "react";
import { Card, Image } from "antd";
import type { Movie } from "../../../interfaces/movie.interface";
const { Meta } = Card;
interface MovieProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieProps) {
  return (
    <Card
      hoverable
      style={{ width: 240, height: 300 }}
      cover={<Image width={240} height={250} src={movie.hinhAnh} />}
    >
      <Meta style ={{ fontSize: 16 }} title={movie.tenPhim} />
    </Card>
  );
}
