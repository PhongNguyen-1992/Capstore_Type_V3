export default function LogoBrand() {
  return (
    <div className="flex items-center">
      {/* Hình logo - ẩn ở mobile */}
      {/* <img
        src="https://pandaweb.com.tr/wp-content/uploads/2023/05/logo-header.png"
        alt="Logo"
        className="hidden md:block w-full h-full"
      /> */}
      
      {/* Chữ PANDA - luôn hiện */}
      <h1 className="ml-2 text-white font-bold text-15 md:text-8">PANDA</h1>
    </div>
  );
}
