import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { Carousel, Typography, Flex, Spin, Button } from "antd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Movie } from "../../../interfaces/movie.interface";
import { getListMovie } from "../../../service/movie.api";
import MovieCard from "./movie"; // Import MovieCard có sẵn

const { Title, Text } = Typography;

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  icon?: React.ReactNode;
}

const MovieSection: React.FC<MovieSectionProps> = ({ title, movies, icon }) => {
  const carouselRef = React.useRef<any>(null);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  if (movies.length === 0) return null;

  return (
    <div className="mb-16 px-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {icon}
          <Title level={2} className="!m-0 !text-gray-900 !font-bold">
            {title}
          </Title>
          <div className="bg-gray-100 px-3 py-1 rounded-full">
            <Text className="text-gray-600 font-medium text-sm">{movies.length} phim</Text>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            shape="circle"
            size="middle"
            className="bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 shadow-sm"
            icon={<ChevronLeft className="w-5 h-5 text-gray-600" />}
            onClick={() => carouselRef.current?.prev()}
          />
          <Button
            shape="circle"
            size="middle"
            className="bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 shadow-sm"
            icon={<ChevronRight className="w-5 h-5 text-gray-600" />}
            onClick={() => carouselRef.current?.next()}
          />
        </div>
      </div>
      
      <Carousel ref={carouselRef} {...settings} className="movie-carousel">
        {movies.map((movie) => (
          <div key={movie.maPhim} className="px-2">
            <MovieCard movie={movie} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default function NetflixMovieList() {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<Movie[]>({
    queryKey: ["get-movie"],
    queryFn: getListMovie,
  });

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Flex align="center" justify="center" style={{ height: "100vh" }} gap="middle">
          <Spin size="large" />
        </Flex>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium">Có lỗi xảy ra khi tải dữ liệu!</p>
          <p className="text-gray-500 mt-2">Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

  // Filter movies by status
  const dangChieuMovies = data.filter(movie => movie.dangChieu);
  const sapChieuMovies = data.filter(movie => movie.sapChieu);
  const ngungChieuMovies = data.filter(movie => !movie.dangChieu && !movie.sapChieu);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-screen-2xl mx-auto">
        
        {/* Phim Đang Chiếu */}
        <MovieSection 
          title="Phim Đang Chiếu"
          movies={dangChieuMovies}
          icon={
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          }
        />
        
        {/* Phim Sắp Chiếu */}
        <MovieSection 
          title="Phim Sắp Chiếu"
          movies={sapChieuMovies}
          icon={
            <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            </div>
          }
        />
        
        {/* Phim Ngừng Chiếu */}
        <MovieSection 
          title="Phim Ngừng Chiếu"
          movies={ngungChieuMovies}
          icon={
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            </div>
          }
        />
      </div>

      {/* <style jsx>{`
        .movie-carousel .slick-track {
          display: flex;
          align-items: stretch;
        }
        .movie-carousel .slick-slide {
          height: inherit;
        }
        .movie-carousel .slick-slide > div {
          height: 100%;
        }
        .movie-carousel .slick-slide > div > div {
          height: 100%;
        }
      `}</style> */}
    </div>
  );
}