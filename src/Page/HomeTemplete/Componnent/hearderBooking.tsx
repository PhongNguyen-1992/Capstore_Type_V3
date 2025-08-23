import {  Button, Avatar } from "antd";
import { Home, User } from "lucide-react";
import {  useNavigate } from "react-router-dom";
import PandaLogo from "./Logo";
import { userAuthStore } from "@/store";



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
         <div className="hidden md:block">
    <PandaLogo />
  </div>
        {user && (
          <div className="flex items-center gap-3">
            <Avatar
              size="large"
              icon={<User className="h-4 w-4 !text-white" />}
              className="bg-gradient-to-br from-blue-500 to-purple-500"
            />
            <div className=" lg:block">
              <h1 className="text-md font-semibold m-0 text-white">
  <span className="text-blue-400 font-bold">Xin chào!</span> {user.hoTen}
</h1>

            </div>
          </div>
        )}

        {/* Right side: Home Button */}
        <div>
          <Button
  type="primary"
  size="middle"
  icon={<Home className="w-5 h-5" />}
  onClick={handleTrangChu}
  className="!bg-blue-600 hover:!bg-blue-700 !border-blue-600 hover:!border-blue-700
             !shadow-sm hover:!shadow-md !transition-all !duration-200
             !px-3 sm:!px-6 !py-1 sm:!py-2 text-sm sm:text-base"
>
  {/* Chữ chỉ hiện từ sm trở lên */}
  <span className="hidden sm:inline">Trang Chủ</span>
</Button>

        </div>
      </div>
    </div>
  );
}
