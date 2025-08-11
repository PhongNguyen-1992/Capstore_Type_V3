import { logo } from "./imgLogo";

export default function LogoBrand() {
  return (
    <div className="flex items-center">
      {/* Hình logo - ẩn ở mobile */}
      <img
        src={logo}
        alt="Logo"
        className="hidden md:block w-24 h-24"
      />
      
      {/* Chữ PANDA - luôn hiện */}
      <h1 className="ml-2 font-bold text-15 md:text-8">PANDA</h1>
    </div>
  );
}
