import { useEffect, useRef, useState, type FC } from "react";
import { Carousel, Typography, Flex, Spin, Button, Input } from "antd";
import { ChevronLeft, ChevronRight, Play, Clock, StopCircle } from "lucide-react";
import type { Movie, MovieSectionProps } from "../../../interfaces/movie.interface";
import { getListMovie } from "../../../service/movie.api";
import MovieCard from "./movie";

const { Title, Text } = Typography;

// Component hiển thị 1 section phim với carousel
const MovieSection: FC<MovieSectionProps> = ({ title, movies, icon }) => {
  const carouselRef = useRef<any>(null);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    responsive: [
      { breakpoint: 1400, settings: { slidesToShow: 3, slidesToScroll: 2 } },
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  if (movies.length === 0) return null;

  return (
    <div className="mb-20 px-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {icon}
          <Title level={2} className="!m-0 !text-white !font-bold text-2xl">{title}</Title>
          <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 px-3 sm:px-4 py-1 sm:py-2 rounded-full">
            <Text className="!text-white font-medium text-xs sm:text-sm">{movies.length}</Text>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            shape="circle"
            size="large"
            className="group !bg-gray-800/60 !backdrop-blur-sm !border-gray-700/50 hover:!bg-gray-700/60 hover:!border-gray-600/50 !shadow-lg transition-all duration-300"
            icon={<ChevronLeft className="w-5 h-5 !text-white group-hover:text-blue-400 transition-colors duration-300" />}
            onClick={() => carouselRef.current?.prev()}
          />
          <Button
            shape="circle"
            size="large"
            className="group !bg-gray-800/60 !backdrop-blur-sm !border-gray-700/50 hover:!bg-gray-700/60 hover:!border-gray-600/50 !shadow-lg transition-all duration-300"
            icon={<ChevronRight className="w-5 h-5 !text-white group-hover:text-blue-400 transition-colors duration-300" />}
            onClick={() => carouselRef.current?.next()}
          />
        </div>
      </div>

      <Carousel ref={carouselRef} {...settings} className="movie-carousel" swipeToSlide draggable>
        {movies.map((movie) => (
          <div key={movie.maPhim} className="px-3">
            <MovieCard movie={movie} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

// Normalize chuỗi tiếng Việt để search
const normalizeString = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

// Component chính MovieList
export default function MovieList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movieData, setMovieData] = useState<Movie[]>([]);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const data = await getListMovie();
        if (data) setMovieData(data);
      } catch (error) {
        console.error("Lỗi lấy danh sách phim:", error);
      }
    }
    fetchMovies();
  }, []);

  // Filter theo search
  const filteredMovies = searchTerm
    ? movieData.filter((movie) =>
        normalizeString(movie.tenPhim).includes(normalizeString(searchTerm))
      )
    : movieData;

  // Phân loại phim
  const dangChieuMovies = filteredMovies.filter((movie) => movie.dangChieu);
  const sapChieuMovies = filteredMovies.filter((movie) => movie.sapChieu);
  const ngungChieuMovies = filteredMovies.filter(
    (movie) => !movie.dangChieu && !movie.sapChieu
  );

  if (!movieData.length) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen flex items-center justify-center">
        <Flex align="center" justify="center" gap="middle">
          <Spin size="large" className="text-blue-500" />
        </Flex>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen py-16 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header + Search */}
      <div className="text-center mb-16 px-6 relative z-10">
        <Title level={1} className="!text-white !font-bold !mb-4 text-3xl sm:text-4xl md:text-5xl">
          Cinema Collection
        </Title>
        <Text className="!text-white  sm:text-lg md:text-lg">
          Khám phá thế giới điện ảnh tuyệt vời
        </Text>

        <div className="mt-6 max-w-md mx-auto">
          <Input
            placeholder="Tìm kiếm phim..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl bg-gray-700/50 text-white placeholder-gray-300 px-4 py-2"
          />
        </div>
      </div>

      {/* Sections phim */}
      <div className="relative z-10 max-w-screen-2xl mx-auto">
        <MovieSection
          title="Phim Đang Chiếu"
          movies={dangChieuMovies}
          icon={
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
              <Play className="w-4 h-4 sm:w-6 sm:h-6 text-white fill-white" />
            </div>
          }
        />
        <MovieSection
          title="Phim Sắp Chiếu"
          movies={sapChieuMovies}
          icon={
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          }
        />
        <MovieSection
          title="Phim Ngừng Chiếu"
          movies={ngungChieuMovies}
          icon={
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl shadow-lg">
              <StopCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white fill-white" />
            </div>
          }
        />
      </div>

      {/* Inline styles carousel */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .movie-carousel .slick-track { display: flex; align-items: stretch; }
            .movie-carousel .slick-slide { height: inherit; }
            .movie-carousel .slick-slide > div { height: 100%; }
            .movie-carousel .slick-slide > div > div { height: 100%; }
            ::-webkit-scrollbar { width: 6px; }
            ::-webkit-scrollbar-track { background: #1f2937; }
            ::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 3px; }
            ::-webkit-scrollbar-thumb:hover { background: #6b7280; }
          `,
        }}
      />
    </div>
  );
}
