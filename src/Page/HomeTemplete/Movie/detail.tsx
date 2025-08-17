import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Film, Clock, AlertCircle, Play, Ticket, Star, House } from "lucide-react";
import { getMovieDetailsAPI } from "../../../service/movie.api";

export default function MovieDetail() {
  const { movieID } = useParams();
  const navigate = useNavigate();
  const handleTrangChu = ()=>{
    navigate('/')
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movie-detail", movieID],
    queryFn: () => getMovieDetailsAPI(movieID!),
    enabled: !!movieID,
  });

  console.log("Movie Detail:", data);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-gray-300 rounded-lg aspect-[3/4] w-full"></div>
              </div>
              <div className="lg:col-span-4 space-y-6">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                </div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Đã có lỗi xảy ra
          </h3>
          <p className="text-red-600">
            Không thể tải thông tin phim. Vui lòng thử lại sau.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-0">
            {/* Movie Poster */}
            <div className="lg:col-span-2 relative group">
              <div className="aspect-[3/4] lg:aspect-auto lg:h-full relative overflow-hidden rounded-tl-xl lg:rounded-none">
                <img
                  src={data?.hinhAnh}
                  alt={data?.tenPhim}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x600?text=No+Image';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>                
                {data?.trailer && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={() => window.open(data.trailer, '_blank')}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transform hover:scale-110 transition-all duration-300 shadow-2xl"
                    >
                      <Play className="h-8 w-8 ml-1 bg-amber-700" fill="currentColor" /> <span className="text-black">Trailler</span>
                    </button>
                  </div>
                )}
                {/* Hot Badge */}
                {data?.hot && (
                  <div className="absolute top-4 left-4">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      🔥 HOT
                    </div>
                  </div>
                )}
                {/* Rating Badge */}
                {data?.danhGia && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <Star className="h-3 w-3" fill="currentColor" />
                      {data.danhGia}/10
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Movie Details */}
            <div className="lg:col-span-4 p-8">
              <div className="space-y-6">
                {/* Title & Actions */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Film className="h-7 w-7 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-2">
                          {data?.tenPhim}
                        </h1>                        
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3 lg:flex-col xl:flex-row">
                      <button 
                        onClick={() => {
                          // Handle booking logic here
                          console.log('Đặt vé phim:', data?.tenPhim);
                        }}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <Ticket className="h-5 w-5" />
                        Đặt Vé Ngay
                      </button>
                      
                      <button onClick={handleTrangChu} className="border-2 border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-500 px-4 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 hover:bg-red-50">
                        <House className="h-5 w-5" />
                        Trang Chủ
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                    Mô tả phim
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-justify">
                    {data?.moTa || "Chưa có mô tả cho phim này."}
                  </p>
                </div>

                {/* Release Date */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Thông tin chiếu phim
                  </h3>
                  {/* Ngày Khởi Chiếu */}
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">                   
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          Ngày khởi chiếu
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        {data?.ngayKhoiChieu &&
                          format(new Date(data.ngayKhoiChieu), "dd/MM/yyyy")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Info Cards */}
                {data && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {data.danhGia || "N/A"}
                        <span className="text-base">/10</span>
                      </div>
                      <div className="text-sm text-blue-800 font-medium">
                        Đánh giá
                      </div>
                    </div>
                    
                    <div className={`rounded-lg p-4 text-center border ${
                      data.hot 
                        ? 'bg-red-50 border-red-100' 
                        : 'bg-gray-50 border-gray-100'
                    }`}>
                      <div className={`text-2xl font-bold mb-1 ${
                        data.hot ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {data.hot ? "🔥 HOT" : "THƯỜNG"}
                      </div>
                      <div className={`text-sm font-medium ${
                        data.hot ? 'text-red-800' : 'text-gray-800'
                      }`}>
                        Độ hot
                      </div>
                    </div>
                    
                    <div className={`rounded-lg p-4 text-center border ${
                      data.dangChieu 
                        ? 'bg-green-50 border-green-100' 
                        : data.sapChieu 
                        ? 'bg-orange-50 border-orange-100'
                        : 'bg-gray-50 border-gray-100'
                    }`}>
                      <div className={`text-2xl font-bold mb-1 ${
                        data.dangChieu 
                          ? 'text-green-600' 
                          : data.sapChieu 
                          ? 'text-orange-600'
                          : 'text-gray-600'
                      }`}>
                        {data.dangChieu ? "ĐANG CHIẾU" : data.sapChieu ? "SẮP CHIẾU" : "NGỪNG CHIẾU"}
                      </div>
                      <div className={`text-sm font-medium ${
                        data.dangChieu 
                          ? 'text-green-800' 
                          : data.sapChieu 
                          ? 'text-orange-800'
                          : 'text-gray-800'
                      }`}>
                        Trạng thái
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}