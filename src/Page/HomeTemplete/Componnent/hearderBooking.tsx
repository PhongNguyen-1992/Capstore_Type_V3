import { Typography, Button, Avatar } from "antd";
import { Home, User } from "lucide-react";
import {  useNavigate } from "react-router-dom";
import PandaLogo from "./Logo";
import { userAuthStore } from "@/store";

const { Title, Text } = Typography;

export default function MovieBookingHeader() {
  const navigate = useNavigate();
  const { user } = userAuthStore();

  const handleTrangChu = () => {
    navigate("/");
  };
  return (
    <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-2xl">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left side: Title + Description */}
        <div className="flex items-center space-x-4">
          <PandaLogo />

          <div>
            <Title level={1} className="!m-0 !text-3xl !font-bold !text-white">
              Đặt Vé Xem Phim
            </Title>
            <Text className="text-base !text-white mt-1">
              Trải nghiệm điện ảnh tuyệt vời đang chờ đón bạn
            </Text>
          </div>
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <Avatar
              size="large"
              icon={<User className="h-4 w-4 text-white" />}
              className="bg-gradient-to-br from-blue-500 to-purple-500"
            />
            <div className="hidden lg:block">
              <h1 className="text-md font-semibold text-white m-0">
                {user.hoTen}
              </h1>
            </div>
          </div>
        )}

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
