import { Button, Drawer, Avatar, Input } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Home, Film, User, LogIn, Search, LogOut } from "lucide-react";
import { userAuthStore } from "../../../store";
import { useState } from "react";
import PandaLogo from "./Logo";

export default function Header() {
  const { user, clearUser } = userAuthStore((state: any) => state);
  const handleLogout = () => {
    clearUser();
  };

  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("auth/login");
  };
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navigationItems = [
    { to: "/", label: "Trang Chủ", icon: Home },
    { to: "/", label: "Phim", icon: Film },
  ];

  const showDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-25">
            {/* Logo Section */}
            <div className="flex items-center gap-8">
              <NavLink to="/" className="flex items-center gap-2 group">
                <PandaLogo width={400} height={90} />
              </NavLink>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          isActive
                            ? "bg-gray-700 text-white shadow-sm"
                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                        }`
                      }
                    >
                      <IconComponent className="h-4 w-4" />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              <div className="hidden md:block w-64">
                <Input
                  placeholder="Nhập Tên Phim..."
                  prefix={<Search className="h-4 w-4 text-gray-400" />}
                  className="bg-gray-800 text-white border-gray-700 placeholder-gray-400"
                />
              </div>
              {user ? (
                <div className="flex items-center gap-3">
                  <Avatar
                    size="large"
                    src={user.avatar}
                    icon={<User className="h-4 w-4 text-white" />}
                    className="bg-gradient-to-br from-blue-500 to-purple-500"
                  />
                  <div className="hidden lg:block">
                    <h1 className="text-md font-semibold text-white m-0">
                      {user.hoTen}
                    </h1>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleLogin}
                  type="primary"
                  icon={<LogIn className="h-4 w-4" />}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Đăng Nhập
                </Button>
              )}

              <Button
                type="text"
                icon={<Menu className="h-5 w-5 text-white" />}
                onClick={showDrawer}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-800 transition-colors duration-300"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Film className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PANDA
            </span>
          </div>
        }
        placement="right"
        onClose={closeDrawer}
        open={isDrawerOpen}
        width={280}
        className="md:hidden"
        closeIcon={<X className="h-5 w-5" />}
      >
        <div className="flex flex-col gap-4">
          {/* User Section - Mobile */}
          {user ? (
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <Avatar
                size="large"
                src={user.avatar}
                className="bg-gradient-to-br from-blue-500 to-purple-500"
                icon={<User className="h-5 w-5" />}
              />
              <div>
                <div className="font-semibold text-gray-900">{user.hoTen}</div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600 mb-3">Chưa đăng nhập</p>
              <Button
                onClick={() => {
                  handleLogin();
                  closeDrawer();
                }}
                type="primary"
                icon={<LogIn className="h-4 w-4" />}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 border-0"
              >
                Đăng Nhập
              </Button>
            </div>
          )}

          {/* Search Mobile */}
          <div className="md:hidden">
            <Input
              placeholder="Tìm kiếm phim..."
              prefix={<Search className="h-4 w-4 text-gray-400" />}
              className="w-full"
            />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeDrawer}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  <IconComponent className="h-5 w-5" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* User Actions - Mobile */}
          {user && (
            <>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="space-y-2">
                <Button
                  type="text"
                  icon={<LogOut className="h-4 w-4" />}
                  className="w-full justify-start text-left text-red-600 hover:bg-red-50 h-12"
                  onClick={() => {
                    handleLogout();
                    closeDrawer();
                  }}
                >
                  Đăng xuất
                </Button>
              </div>
            </>
          )}
        </div>
      </Drawer>
    </>
  );
}
