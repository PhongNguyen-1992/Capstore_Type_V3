import React from "react";
import { Button, Card, Space } from "antd";
import { Eye, Ticket, Star, Calendar, Play } from "lucide-react";
import type { Movie } from "../../../interfaces/movie.interface";
import { useNavigate } from "react-router-dom";

interface MovieProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieProps) {
  const navigate = useNavigate();

  const handleDetail = () => {
    navigate(`/movie-detail/${movie.maPhim}`);
  };

  const handleBooking = () => {
    // Handle booking logic here
    console.log("Đặt vé phim:", movie.tenPhim);
  };

  return (
    <div className="group relative">
      <Card
        hoverable
        className="w-64 h-96 overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-b from-white to-gray-50"
        bodyStyle={{ padding: 0 }}
        cover={
          <div className="relative overflow-hidden h-64">
            <img
              src={movie.hinhAnh}
              alt={movie.tenPhim}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/240x250?text=No+Image';
              }}
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />         
            {/* Hot Badge */}
            {movie.hot && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
                🔥 HOT
              </div>
            )}

            {/* Rating Badge */}
            {movie.danhGia && (
              <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                <Star className="h-3 w-3" fill="currentColor" />
                {movie.danhGia}
              </div>
            )}

            {/* Status Badge */}
            <div className={`absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs font-bold shadow-lg ${
              movie.dangChieu 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                : movie.sapChieu 
                ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white'
                : 'bg-gradient-to-r from-gray-500 to-slate-500 text-white'
            }`}>
              {movie.dangChieu ? "ĐANG CHIẾU" : movie.sapChieu ? "SẮP CHIẾU" : "NGỪNG CHIẾU"}
            </div>
          </div>
        }
      >
        <div className="p-4 h-32 flex flex-col justify-between">
          {/* Movie Title */}
          <div className="mb-3">
            <h3 
              className="text-lg font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 cursor-pointer"
              onClick={handleDetail}
              title={movie.tenPhim}
            >
              {movie.tenPhim}
            </h3>
            
            {/* Ngày Khởi Chiếu */}
            {movie.ngayKhoiChieu && (
              <div className="flex items-center gap-1 mt-2 text-gray-500 text-sm">
                <Calendar className="h-4 w-4" />
                <span>Ngày Chiếu:{" "}
                  {new Date(movie.ngayKhoiChieu).toLocaleDateString('vi-VN')}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <Space className="w-full justify-center gap-2">
            <Button
              type="default"            
              onClick={handleDetail}
              className=" hover:bg-blue-50 hover:border-blue-600 transition-all duration-300 font-semibold flex items-center justify-center gap-1 h-9"
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
          </Space>
        </div>
      </Card>
    </div>
  );
}