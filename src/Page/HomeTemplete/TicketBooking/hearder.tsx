import { Typography, Button } from "antd";
import { Play, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function MovieBookingHeader() {
  const navigate = useNavigate();

  const handleTrangChu = () => {
    navigate("/");
  };
  return (
    <div className="bg-white border-b border-gray-100 px-8 py-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left side: Title + Description */}
        <div className="flex items-center space-x-4">
          <div className="bg-blue-50 p-3 rounded-xl">
            <Play className="w-7 h-7 text-blue-600" />
          </div>

          <div>
            <Title
              level={1}
              className="!m-0 !text-3xl !font-bold !text-gray-900"
            >
              Đặt Vé Xem Phim
            </Title>
            <Text className="text-base text-gray-600 mt-1">
              Trải nghiệm điện ảnh tuyệt vời đang chờ đón bạn
            </Text>
          </div>
        </div>

        {/* Right side: Home Button */}
        <div>
          <Button
            type="primary"
            size="large"
            icon={<Home className="w-5 h-5" />}
            onClick={handleTrangChu}
            className="!bg-blue-600 hover:!bg-blue-700 !border-blue-600 hover:!border-blue-700 !shadow-sm hover:!shadow-md !transition-all !duration-200 !px-6 !font-medium"
          >
            Trang Chủ
          </Button>
        </div>
      </div>
    </div>
  );
}
