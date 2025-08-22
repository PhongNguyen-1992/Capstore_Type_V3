import { useState, useEffect } from "react";
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
  const [showControls, setShowControls] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

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

  const handleCardClick = () => {
    if (isMobile) {
      setShowControls(!showControls);
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setShowControls(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setShowControls(false);
    }
  };

  return (
    <div className="group relative">
      <Card
        hoverable={!isMobile}
        className={`w-64 h-96 overflow-hidden border-0 shadow-lg transition-all duration-500 bg-black cursor-pointer
          ${!isMobile ? 'hover:shadow-2xl hover:-translate-y-2' : ''}
          ${showControls && isMobile ? 'shadow-2xl -translate-y-1' : ''}
        `}
        bodyStyle={{ padding: 0 }}
        onClick={handleCardClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        cover={
          <div className="relative w-full h-96">
            <img
              src={movie.hinhAnh}
              alt={movie.tenPhim}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 
                ${!isMobile ? 'group-hover:scale-110' : ''}
                ${showControls && isMobile ? 'scale-110' : ''}
              `}
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/240x250?text=No+Image";
              }}
            />

            {/* Overlay */}
            <div 
              className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-500
                ${!isMobile ? 'opacity-0 group-hover:opacity-100' : ''}
                ${showControls && isMobile ? 'opacity-100' : 'opacity-0'}
              `} 
            />

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
              className={`absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs font-bold shadow-lg z-10 ${
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

            {/* Mobile hint */}
            {/* {isMobile && !showControls && (
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                Chạm để xem
              </div>
            )} */}

            {/* Trailer button */}
            <div 
              className={`absolute inset-0 flex items-center justify-center transition-all duration-500 z-20
                ${!isMobile ? 'opacity-0 group-hover:opacity-100' : ''}
                ${showControls && isMobile ? 'opacity-100' : 'opacity-0'}
              `}
            >
              <Button
                shape="circle"
                size="large"
                className="bg-white/90 hover:bg-white text-red-600 shadow-xl flex items-center justify-center transform hover:scale-110 transition-all duration-300"
                icon={<Play className="h-6 w-6" />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTrailer();
                }}
              />
            </div>

            {/* Title + Date */}
            <div 
              className={`absolute bottom-16 left-0 right-0 px-4 text-center transition-all duration-500 z-10
                ${!isMobile ? 'opacity-0 group-hover:opacity-100' : ''}
                ${showControls && isMobile ? 'opacity-100' : 'opacity-0'}
              `}
            >
              <h3
                className="text-lg font-bold text-white line-clamp-2 cursor-pointer hover:text-blue-400 transition-colors duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDetail();
                }}
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
            <div 
              className={`absolute bottom-3 left-0 right-0 flex justify-center gap-2 transition-all duration-500 px-4 z-20
                ${!isMobile ? 'opacity-0 group-hover:opacity-100' : ''}
                ${showControls && isMobile ? 'opacity-100' : 'opacity-0'}
              `}
            >
              <Button
                type="default"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDetail();
                }}
                className="hover:bg-blue-50 hover:border-blue-600 transition-all duration-300 font-semibold flex items-center justify-center gap-1 h-9 bg-white/90 backdrop-blur-sm"
                icon={<Eye className="h-4 w-4" />}
              >
                Chi Tiết
              </Button>
              <Button
                type="primary"
                danger
                onClick={(e) => {
                  e.stopPropagation();
                  handleBooking();
                }}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 border-0 hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-semibold flex items-center justify-center gap-1 h-9 shadow-lg transform hover:scale-105"
                icon={<Ticket className="h-4 w-4" />}
              >
                Đặt Vé
              </Button>
            </div>

            {/* Mobile: Always show title at bottom when controls are hidden */}
         
          </div>
        }
      />

      {/* Modal Trailer */}
      <Modal
        open={openTrailer}
        footer={null}
        onCancel={() => setOpenTrailer(false)}
        centered
        width={isMobile ? '90%' : 800}
        bodyStyle={{ padding: 0 }}
        destroyOnClose
        style={isMobile ? { top: 20 } : {}}
      >
        {movie.trailer && (
          <iframe
            width="100%"
            height={isMobile ? "250" : "450"}
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