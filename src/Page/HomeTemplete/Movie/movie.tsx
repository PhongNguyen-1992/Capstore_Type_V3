import { useState } from "react";
import { Button, Card, Modal } from "antd";
import { Eye, Ticket, Star, Calendar, Play } from "lucide-react";
import type { Movie } from "../../../interfaces/movie.interface";
import { useNavigate } from "react-router-dom";

interface MovieProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieProps) {
  const navigate = useNavigate();
  const [openTrailer, setOpenTrailer] = useState(false);

  const handleDetail = () => {
    navigate(`/movie-detail/${movie.maPhim}`);
  };

  const handleBooking = () => {
    navigate(`/TicketBooking/${movie.maPhim}`);
  };

  const handleTrailer = () => {
    if (movie.trailer) {
      setOpenTrailer(true);
    }
  };

  return (
    <div className="group relative">
      <Card
        hoverable
        className="w-64 h-96 overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-black"
        bodyStyle={{ padding: 0 }}
        cover={
          <div className="relative w-full h-96">
            <img
              src={movie.hinhAnh}
              alt={movie.tenPhim}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/240x250?text=No+Image";
              }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Badge HOT */}
            {movie.hot && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
                🔥 HOT
              </div>
            )}

            {/* Badge Rating */}
            {movie.danhGia && (
              <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                <Star className="h-3 w-3" fill="currentColor" />
                {movie.danhGia}
              </div>
            )}

            {/* Badge Status */}
            <div
              className={`absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs font-bold shadow-lg ${
                movie.dangChieu
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                  : movie.sapChieu
                  ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
                  : "bg-gradient-to-r from-gray-500 to-slate-500 text-white"
              }`}
            >
              {movie.dangChieu
                ? "ĐANG CHIẾU"
                : movie.sapChieu
                ? "SẮP CHIẾU"
                : "NGỪNG CHIẾU"}
            </div>

            {/* Trailer button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
              <Button
                shape="circle"
                size="large"
                className="bg-white/80 hover:bg-white text-red-600 shadow-xl flex items-center justify-center"
                icon={<Play className="h-6 w-6" />}
                onClick={handleTrailer}
              />
            </div>

            {/* Title + Date */}
            <div className="absolute bottom-16 left-0 right-0 px-4 text-center opacity-0 group-hover:opacity-100 transition-all duration-500">
              <h3
                className="text-lg font-bold text-white line-clamp-2 cursor-pointer hover:text-blue-400"
                onClick={handleDetail}
              >
                {movie.tenPhim}
              </h3>
              {movie.ngayKhoiChieu && (
                <div className="flex items-center justify-center gap-1 mt-1 text-gray-200 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(movie.ngayKhoiChieu).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 px-4">
              <Button
                type="default"
                onClick={handleDetail}
                className="hover:bg-blue-50 hover:border-blue-600 transition-all duration-300 font-semibold flex items-center justify-center gap-1 h-9"
                icon={<Eye className="h-4 w-4" />}
              >
                Chi Tiết
              </Button>
              <Button
                type="primary"
                danger
                onClick={handleBooking}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 border-0 hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-semibold flex items-center justify-center gap-1 h-9 shadow-lg"
                icon={<Ticket className="h-4 w-4" />}
              >
                Đặt Vé
              </Button>
            </div>
          </div>
        }
      />

      {/* Modal Trailer */}
      <Modal
        open={openTrailer}
        footer={null}
        onCancel={() => setOpenTrailer(false)}
        centered
        width={800}
        bodyStyle={{ padding: 0 }}
        destroyOnClose // Tắt popup là clip tắt
      >
        {movie.trailer && (
          <iframe
            width="100%"
            height="450"
            src={movie.trailer.replace("watch?v=", "embed/")}
            title="Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </Modal>
    </div>
  );
}
