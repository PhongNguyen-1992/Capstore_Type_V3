import { Typography, Button } from "antd";
import {  Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PandaLogo from "./Logo";

const { Title, Text } = Typography;

export default function MovieBookingHeader() {
  const navigate = useNavigate();

  const handleTrangChu = () => {
    navigate("/");
  };
  return (
          <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-2xl">

      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left side: Title + Description */}
        <div className="flex items-center space-x-4">
         <PandaLogo/>

          <div>
            <Title
              level={1}
              className="!m-0 !text-3xl !font-bold !text-white"
            >
              Đặt Vé Xem Phim
            </Title>
            <Text className="text-base !text-white mt-1">
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
