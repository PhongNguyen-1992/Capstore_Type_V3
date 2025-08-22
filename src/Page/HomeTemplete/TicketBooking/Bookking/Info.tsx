import type { Movie } from "@/interfaces/movie.interface";
import { getListMovie } from "@/service/movie.api";
import { Image, notification, Spin, Typography } from "antd";
import { StarOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const { Title, Paragraph } = Typography;

export default function HeadderInfo() {
  const { movieID } = useParams<{ movieID: string }>();
  const [movieData, setMovieData] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movies = await getListMovie();
        const foundMovie = movies.find((m) => String(m.maPhim) === movieID);
        setMovieData(foundMovie || null);
      } catch (error) {
        console.error(error);
        notification.error({
          message: "Lỗi",
          description: "Không thể tải thông tin phim",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieID]);

  return (
    <div>
      {/* Header Gradient */}
      <div className="-mx-6 -mt-6">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <Title level={3} className="!text-white !mb-0 text-center">
            <StarOutlined className="mr-2" />
            Thông Tin Đặt Vé
          </Title>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Spin size="large" tip="Đang tải thông tin phim..." />
        </div>
      ) : !movieData ? (
        <p className="text-center text-gray-500 py-6">Không tìm thấy phim</p>
      ) : (
        <div className="mb-8 p-4">
          {/* Ảnh & overlay */}
          <div className="relative mb-4 rounded-2xl overflow-hidden shadow-xl">
            <Image
              src={movieData.hinhAnh}
              alt={movieData.tenPhim}
              className="w-full h-full object-cover"
              preview={false}
              fallback="https://via.placeholder.com/600x400?text=No+Image"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <Title level={4} className="!text-white !mb-1 drop-shadow-lg">
                {movieData.tenPhim}
              </Title>
            </div>
          </div>

          {/* Mô tả */}
          <Paragraph
            ellipsis={{ rows: 3, expandable: true, symbol: "Xem thêm" }}
            className="text-gray-700 text-sm leading-relaxed"
          >
            {movieData.moTa}
          </Paragraph>
        </div>
      )}
    </div>
  );
}
