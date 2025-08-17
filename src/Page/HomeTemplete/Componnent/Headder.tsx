import React, { useState } from "react";
import { Button, Drawer, Badge, Avatar, Dropdown, Input } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Film,
  User,
  LogIn,
  Search,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import { userAuthStore } from "../../../store";

export default function Header() {
  const { user, setUser, clearUser } = userAuthStore((state: any) => state);
  const handleLogout = () => {
    clearUser();
  }

  const navigate = useNavigate();
  const handleLogin =()=>{
    navigate("auth/login")
  }
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const userMenuItems = [
    {
      key: "profile",
      label: (
        <div className="flex items-center gap-2 py-1">
          <User className="h-4 w-4" />
          <span>Hồ sơ</span>
        </div>
      ),
    },
    {
      key: "settings",
      label: (
        <div className="flex items-center gap-2 py-1">
          <Settings className="h-4 w-4" />
          <span>Cài đặt</span>
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: (
        <div className="flex items-center gap-2 py-1 text-red-600">
          <LogOut className="h-4 w-4" />
          <span>Đăng xuất</span>
        </div>
      ),
    },
  ];

  const navigationItems = [
    { to: "/", label: "Trang Chủ", icon: Home },
    { to: "/", label: "Phim", icon: Film },
  ];

  const showDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center gap-8">
              <NavLink to="/" className="flex items-center gap-2 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                    <Film className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-wider">
                  PANDA
                </h1>
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
                            ? "bg-blue-50 text-blue-600 shadow-sm"
                            : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
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
              {/* Search */}
              <Input 
                placeholder="Nhập Tên Phim..." 
                className="hidden md:block w-64"
                prefix={<Search className="h-4 w-4 text-gray-400" />}
              />

              {user ? (
                <>
                  {/* User Section - Desktop */}
                  <div className="flex items-center gap-3">
                    <Avatar 
                      size="large"
                      src={user.avatar}
                      icon={<User className="h-4 w-4" />}
                      className="bg-gradient-to-br from-blue-500 to-purple-500"
                    />
                    <div className="hidden lg:block">
                      <h1 className="text-md font-semibold text-gray-800 m-0">
                        {user.hoTen}
                      </h1>                      
                    </div>                    
                  </div>
                </>
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

              {/* Mobile Menu Button - Only visible on small screens */}
              <Button
                type="text"
                icon={<Menu className="h-5 w-5" />}
                onClick={showDrawer}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors duration-300"
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