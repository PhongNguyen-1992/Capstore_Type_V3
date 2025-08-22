import { Button, Drawer, Avatar, Input, Dropdown, type MenuProps } from "antd";
import { NavLink } from "react-router-dom";
import { Menu, X, Home, Film, User, LogIn, Search, LogOut } from "lucide-react";
import { userAuthStore } from "../../../store";
import { useEffect, useState } from "react";
import PandaLogo from "./Logo";

export default function Header() {
  const [isMdUp, setIsMdUp] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMdUp(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { user, clearUser } = userAuthStore((state: any) => state);
  const handleLogout = () => {
    clearUser();
  };
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navigationItems = [
    { to: "/", label: "Trang Chủ", icon: Home },
    { to: "/", label: "Phim", icon: Film },
  ];

  const showDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  // Menu dropdown cho avatar
  const avatarMenu: MenuProps["items"] = [
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogOut className="h-4 w-4 text-red-500" />,
      onClick: handleLogout,
    },
  ];

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-25">
            {/* Logo Section */}
            <div className="flex items-center gap-8">
              <NavLink to="/" className="flex items-center gap-2 group">
                <div className="flex items-center">
                  {isMdUp && <PandaLogo width={400} height={90} />}
                </div>
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
              {user ? (
                <Dropdown menu={{ items: avatarMenu }} placement="bottomRight" arrow>
                  <div className="flex items-center gap-2 cursor-pointer ">
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
                </Dropdown>
              ) : (
                <NavLink to="/auth/login" className="text-white font-semibold">
                  <Button
                    type="primary"
                    icon={<LogIn className="h-4 w-4" />}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Đăng Nhập
                  </Button>
                </NavLink>
              )}

              <Button
                type="text"
                onClick={showDrawer}
                className="md:hidden flex items-center justify-center w-12 h-12 rounded-md bg-gray-300 p-2 hover:bg-gray-400 transition-colors duration-300"
              >
                <Menu className="h-6 w-6 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
  <Drawer
  title={null}
  placement="right"
  onClose={closeDrawer}
  open={isDrawerOpen}
  width={300}
  className="md:hidden"
  closeIcon={<X className="h-5 w-5 text-gray-600 hover:text-gray-800" />}
  styles={{
    body: { 
      padding: 0,
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    },
    header: {
      padding: '16px 20px',
      borderBottom: '1px solid #e2e8f0'
    }
  }}
  destroyOnClose={false}
>
  <div className="flex flex-col h-full relative overflow-hidden">
    {/* Decorative Background */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-8 translate-x-8"></div>
    <div className="absolute bottom-20 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/10 to-orange-400/10 rounded-full -translate-x-6"></div>

    {/* Header with Logo */}
    <div className="relative z-10 px-5 py-4 bg-white/50 backdrop-blur-sm border-b border-gray-200/50">
      <PandaLogo />
    </div>

    {/* User Section */}
    <div className="relative z-10 px-5 py-4">
      {user ? (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 p-4 shadow-xl">
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          
          {/* Decorative circles */}
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-white/5 rounded-full"></div>
          
          <div className="relative flex items-center gap-4">
            <div className="relative">
              <Avatar
                size={56}
                src={user.avatar}
                className="ring-3 ring-white/30 shadow-lg border-2 border-white/20"
                icon={<User className="h-7 w-7 text-white" />}
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-base truncate">{user.hoTen}</h3>
              <p className="text-blue-100 text-sm font-medium">  {user.maLoaiNguoiDung}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl bg-white/70 backdrop-blur-sm p-6 shadow-lg border border-gray-200/50">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-4 font-medium">Chào mừng đến với PandaMovie</p>
            <NavLink to="/auth/login">
              <Button
                onClick={closeDrawer}
                type="primary"
                icon={<LogIn className="h-4 w-4" />}
                className="w-full h-11 bg-gradient-to-r from-blue-500 to-purple-600 border-0 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                Đăng Nhập Ngay
              </Button>
            </NavLink>
          </div>
        </div>
      )}
    </div>

    {/* Search Bar */}
    <div className="relative z-10 px-5 mb-4">
      <div className="relative">
        <Input
          placeholder="Tìm kiếm phim yêu thích..."
          prefix={<Search className="h-4 w-4 text-gray-400" />}
          className="w-full h-12 rounded-xl border-gray-200 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-300"
          style={{
            fontSize: '15px'
          }}
        />
      </div>
    </div>

    {/* Navigation Links */}
    <nav className="relative z-10 flex-1 px-3 space-y-1 overflow-y-auto">
      <div className="pb-4">
        {navigationItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeDrawer}
              className={({ isActive }) =>
                `group flex items-center gap-4 px-4 py-3.5 mx-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 shadow-md border border-blue-200/50"
                    : "text-gray-700 hover:bg-white/60 hover:shadow-sm"
                }`
              }
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              {({ isActive }) => (
                <>
                  <div className={`p-2 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? "bg-blue-100 text-blue-600" 
                      : "bg-gray-100 group-hover:bg-gray-200 text-gray-500"
                  }`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <span className="flex-1 text-15">{item.label}</span>
                  {isActive && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>

    {/* User Actions Footer */}
    {user && (
      <div className="absolute bottom-0 left-0 right-0 z-20 px-5 py-4 bg-white/80 backdrop-blur-md border-t border-gray-200/60 shadow-lg">
        <Button
          type="text"
          icon={<LogOut className="h-4 w-4" />}
          className="w-full justify-start text-left text-red-600 hover:bg-red-50 hover:text-red-700 h-12 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-sm"
          onClick={() => {
            handleLogout();
            closeDrawer();
          }}
        >
          <span className="ml-2">Đăng xuất tài khoản</span>
        </Button>
      </div>
    )}
  </div>
</Drawer>

    </>
  );
}
