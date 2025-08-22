import { useRef, type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { Carousel, Typography, Flex, Spin, Button } from "antd";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Clock,
  StopCircle,
} from "lucide-react";
import type {
  Movie,
  MovieSectionProps,
} from "../../../interfaces/movie.interface";
import { getListMovie } from "../../../service/movie.api";
import MovieCard from "./movie";

const { Title, Text } = Typography;

const MovieSection: FC<MovieSectionProps> = ({ title, movies, icon }) => {
  const carouselRef = useRef<any>(null);

  // Cấu hình setting show Movie
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
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (movies.length === 0) return null;

  return (
    <div className="mb-20 px-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {icon}
          <Title level={2} className="!m-0 !text-white !font-bold text-2xl">
            {title}
          </Title>
          <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 px-3 sm:px-4 py-1 sm:py-2 rounded-full">
            <Text className="!text-white font-medium text-xs sm:text-sm">
              {movies.length}
            </Text>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            shape="circle"
            size="large"
            className="group !bg-gray-800/60 !backdrop-blur-sm 
               !border-gray-700/50 hover:!bg-gray-700/60 
               hover:!border-gray-600/50 !shadow-lg transition-all duration-300"
            icon={
              <ChevronLeft className="w-5 h-5 !text-white group-hover:text-blue-400 transition-colors duration-300" />
            }
            onClick={() => carouselRef.current?.prev()}
          />
          <Button
            shape="circle"
            size="large"
            className="group !bg-gray-800/60 !backdrop-blur-sm 
               !border-gray-700/50 hover:!bg-gray-700/60 
               hover:!border-gray-600/50 !shadow-lg transition-all duration-300"
            icon={
              <ChevronRight className="w-5 h-5 !text-white group-hover:text-blue-400 transition-colors duration-300" />
            }
            onClick={() => carouselRef.current?.next()}
          />
        </div>
      </div>

      <Carousel
        ref={carouselRef}
        {...settings}
        className="movie-carousel"
        swipeToSlide
        draggable
      >
        {movies.map((movie) => (
          <div key={movie.maPhim} className="px-3">
            <MovieCard movie={movie} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default function MovieList() {
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
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen">
        <Flex
          align="center"
          justify="center"
          style={{ height: "100vh" }}
          gap="middle"
        >
          <div className="text-center">
            <Spin size="large" className="text-blue-500" />
            <p className="text-gray-400 mt-4 text-lg">Đang tải dữ liệu...</p>
          </div>
        </Flex>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <StopCircle className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-red-400 text-xl font-semibold mb-2">
            Có lỗi xảy ra khi tải dữ liệu!
          </p>
          <p className="text-gray-400">Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

  // Filter movies
  const dangChieuMovies = data.filter((movie) => movie.dangChieu);
  const sapChieuMovies = data.filter((movie) => movie.sapChieu);
  const ngungChieuMovies = data.filter(
    (movie) => !movie.dangChieu && !movie.sapChieu
  );

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen py-16 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-screen-2xl mx-auto relative z-10">
        {/* Header */}
        {/* Header */}
        <div className="text-center mb-16 px-6">
          <Title
            level={1}
            className="!text-white !font-bold !mb-4
      text-3xl sm:text-4xl md:text-5xl"
          >
            Cinema Collection
          </Title>
          <Text className="text-gray-400 text-base sm:text-lg md:text-lg">
            Khám phá thế giới điện ảnh tuyệt vời
          </Text>
        </div>

        {/* Phim Đang Chiếu */}
        <MovieSection
          title="Phim Đang Chiếu"
          movies={dangChieuMovies}
          icon={
            <div
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 
      bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg"
            >
              <Play className="w-4 h-4 sm:w-6 sm:h-6 text-white fill-white" />
            </div>
          }
        />

        {/* Phim Sắp Chiếu */}
       <MovieSection
          title="Phim Sắp Chiếu"
          movies={sapChieuMovies}
          icon={
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          }
        />

        {/* Phim Ngừng Chiếu */}
        <MovieSection
          title="Phim Ngừng Chiếu"
          movies={ngungChieuMovies}
          icon={
            <div
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 
      bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg"
            >
              <StopCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white fill-white" />
            </div>
          }
        />
      </div>

      {/* Inline styles for carousel */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
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
          
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 6px;
          }
          ::-webkit-scrollbar-track {
            background: #1f2937;
          }
          ::-webkit-scrollbar-thumb {
            background: #4b5563;
            border-radius: 3px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #6b7280;
          }
        `,
        }}
      />
    </div>
  );
}
