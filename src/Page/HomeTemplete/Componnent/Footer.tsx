import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  Smartphone,
  CreditCard,
  Shield,
  Award
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-2xl font-bold">🐼</span>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                PANDA CINEMA
              </h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Trải nghiệm điện ảnh đỉnh cao với công nghệ hiện đại và dịch vụ tận tâm. 
              Nơi mỗi bộ phim trở thành hành trình khó quên.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors duration-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-pink-600 hover:bg-pink-700 rounded-full flex items-center justify-center transition-colors duration-300">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-sky-500 hover:bg-sky-600 rounded-full flex items-center justify-center transition-colors duration-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors duration-300">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-orange-400">Liên kết nhanh</h4>
            <ul className="space-y-3">
              {[
                'Phim đang chiếu',
                'Phim sắp chiếu',
                'Lịch chiếu',
                'Giá vé',
                'Khuyến mãi',
                'Thành viên',
                'Tin tức'
              ].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center">
                    <span className="w-1 h-1 bg-orange-400 rounded-full mr-3"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-orange-400">Thông tin liên hệ</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-orange-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">69 Khuất Văn Bứt, Bình Chánh</p>
                  <p className="text-gray-300">TP. Hồ Chí Minh</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-orange-400 mr-3" />
                <p className="text-gray-300">096.50.167.92</p>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-orange-400 mr-3" />
                <p className="text-gray-300">phongnguyenfpt1992@gmail.com</p>
              </div>
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-orange-400 mr-3 mt-1" />
                <div>
                  <p className="text-gray-300">Thứ 2 - Chủ nhật</p>
                  <p className="text-gray-300">8:00 - 23:30</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services & Features */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-orange-400">Dịch vụ</h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <Smartphone className="w-5 h-5 text-orange-400 mr-3" />
                
                <span className="text-gray-300">Đặt vé online</span>
              </div>
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-orange-400 mr-3" />
                <span className="text-gray-300">Thanh toán đa dạng</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-orange-400 mr-3" />
                <span className="text-gray-300">Bảo mật thông tin</span>
              </div>
              <div className="flex items-center">
                <Award className="w-5 h-5 text-orange-400 mr-3" />
                <span className="text-gray-300">Chất lượng cao cấp</span>
              </div>
            </div>
            
            {/* App Download */}
            <div className="mt-6">
              <p className="text-sm text-gray-300 mb-3">Tải ứng dụng:</p>
              <div className="flex flex-col space-y-2">
                <a href="#" className="inline-flex items-center px-4 py-2 bg-black rounded-lg hover:bg-gray-800 transition-colors duration-300">
                  <div className="mr-3">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-xs">Tải trên</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </a>
                <a href="#" className="inline-flex items-center px-4 py-2 bg-black rounded-lg hover:bg-gray-800 transition-colors duration-300">
                  <div className="mr-3">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-xs">Tải trên</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2024 PANDA CINEMA. Tất cả quyền được bảo lưu.
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-orange-400 transition-colors duration-300">
                Chính sách bảo mật
              </a>
              <a href="#" className="hover:text-orange-400 transition-colors duration-300">
                Điều khoản sử dụng
              </a>
              <a href="#" className="hover:text-orange-400 transition-colors duration-300">
                Hỗ trợ khách hàng
              </a>
              <a href="#" className="hover:text-orange-400 transition-colors duration-300">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;