import React, { useState } from "react";
import {
  CheckCircle,
  AlertCircle,
  UserPlus,
  Mail,
  Phone,
  User,
  Lock,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";
import type { Register } from "@/interfaces/auth.interface";
import { registerUser } from "../../../service/auth.api"; // Import API thật

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<Register>({
    taiKhoan: "",
    matKhau: "",
    email: "",
    soDt: "",
    maNhom: "",
    hoTen: "",
    maLoaiNguoiDung: "",
    tenLoai: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<Register | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "taiKhoan":
        if (!value.trim()) return "Tài khoản không được để trống!";
        if (value.length < 3) return "Tài khoản phải có ít nhất 3 ký tự";
        if (!/^[a-zA-Z0-9_]+$/.test(value))
          return "Tài khoản chỉ được chứa chữ cái, số và dấu gạch dưới";
        break;
      case "matKhau":
        if (!value) return "Mật khẩu không được để trống!";
        if (value.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
        break;
      case "hoTen":
        if (!value.trim()) return "Họ tên không được để trống!";
        if (value.trim().length < 2) return "Họ tên phải có ít nhất 2 ký tự";
        break;
      case "email":
        if (!value.trim()) return "Email không được để trống!";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Email không hợp lệ!";
        break;
      case "soDt":
        if (!value.trim()) return "Số điện thoại không được để trống!";
        if (!/^[0-9]{10,11}$/.test(value))
          return "Số điện thoại phải có 10-11 chữ số";
        break;
      case "maNhom":
        if (!value) return "Vui lòng chọn mã nhóm!";
        break;
    }
    return "";
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear general error when user makes changes
    if (errorDetails) {
      setErrorDetails(null);
    }
  };

  const handleInputBlur = (name: string, value: string) => {
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof Register]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const getErrorMessage = (error: any): string => {
    console.log("🚨 Error details:", error);
    
    // Kiểm tra response data trước
    if (error.response?.data) {
      const errorData = error.response.data;
      
      // Ưu tiên message từ API
      if (errorData.content) {
        return errorData.content;
      }
      
      if (errorData.message) {
        return errorData.message;
      }
    }

    // Xử lý theo status code
    if (error.response?.status) {
      switch (error.response.status) {
        case 400:
          return "Thông tin đăng ký không hợp lệ. Vui lòng kiểm tra lại.";
        case 401:
          return "Không có quyền thực hiện thao tác này.";
        case 403:
          return "Truy cập bị từ chối.";
        case 404:
          return "API đăng ký không tồn tại. Vui lòng liên hệ quản trị viên.";
        case 409:
          return "Tài khoản hoặc email đã tồn tại.";
        case 422:
          return "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.";
        case 500:
          return "Lỗi máy chủ nội bộ. Vui lòng thử lại sau.";
        case 503:
          return "Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.";
        default:
          return `Lỗi ${error.response.status}: ${
            error.response.statusText || "Không xác định"
          }`;
      }
    }

    if (error.request) {
      return "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
    }

    return error.message || "Đã xảy ra lỗi không xác định.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrorDetails(null);

    const registerData: Register = {
      taiKhoan: formData.taiKhoan.trim(),
      matKhau: formData.matKhau,
      email: formData.email.trim().toLowerCase(),
      soDt: formData.soDt.trim(),
      maNhom: formData.maNhom,
      hoTen: formData.hoTen.trim(),
      maLoaiNguoiDung: "KhachHang",
      tenLoai: "Khách Hàng",
    };

    console.log("🚀 Starting registration with data:", registerData);

    try {
      const result = await registerUser(registerData);
      
      console.log("✅ Registration successful:", result);

      if (result) {
        setRegisteredUser(result);
        setSuccessModalVisible(true);
        setFormData({
          taiKhoan: "",
          matKhau: "",
          email: "",
          soDt: "",
          maNhom: "",
          hoTen: "",
          maLoaiNguoiDung: "",
          tenLoai: "",
        });
        setErrors({});
      } else {
        setErrorDetails("Không nhận được phản hồi từ máy chủ.");
      }
    } catch (error: any) {
      console.error("❌ Registration failed:", error);
      const errorMessage = getErrorMessage(error);
      setErrorDetails(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false);
    setRegisteredUser(null);
  };

  const resetForm = () => {
    setFormData({
      taiKhoan: "",
      matKhau: "",
      email: "",
      soDt: "",
      maNhom: "",
      hoTen: "",
      maLoaiNguoiDung: "",
      tenLoai: "",
    });
    setErrors({});
    setErrorDetails(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Đăng Ký Tài Khoản
              </h1>
              <p className="text-gray-500 mt-2">Tạo tài khoản mới để bắt đầu</p>
            </div>

            {/* Error Display */}
            {errorDetails && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-800">
                      Lỗi đăng ký
                    </h3>
                    <p className="text-sm text-red-700 mt-1">{errorDetails}</p>
                  </div>
                  <button
                    onClick={() => setErrorDetails(null)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <span className="sr-only">Đóng</span>×
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tài Khoản */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium text-sm mb-2">
                  <User className="w-4 h-4" />
                  Tài Khoản
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.taiKhoan}
                    onChange={(e) =>
                      handleInputChange("taiKhoan", e.target.value)
                    }
                    onBlur={(e) => handleInputBlur("taiKhoan", e.target.value)}
                    placeholder="Nhập tên tài khoản..."
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.taiKhoan
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    required
                  />
                </div>
                {errors.taiKhoan && (
                  <p className="text-red-500 text-sm mt-1">{errors.taiKhoan}</p>
                )}
              </div>

              {/* Mật Khẩu */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium text-sm mb-2">
                  <Lock className="w-4 h-4" />
                  Mật Khẩu
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.matKhau}
                    onChange={(e) =>
                      handleInputChange("matKhau", e.target.value)
                    }
                    onBlur={(e) => handleInputBlur("matKhau", e.target.value)}
                    placeholder="Nhập mật khẩu..."
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.matKhau
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.matKhau && (
                  <p className="text-red-500 text-sm mt-1">{errors.matKhau}</p>
                )}
              </div>

              {/* Họ và Tên */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium text-sm mb-2">
                  <User className="w-4 h-4" />
                  Họ và Tên
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.hoTen}
                    onChange={(e) => handleInputChange("hoTen", e.target.value)}
                    onBlur={(e) => handleInputBlur("hoTen", e.target.value)}
                    placeholder="Nhập họ và tên..."
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.hoTen
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    required
                  />
                </div>
                {errors.hoTen && (
                  <p className="text-red-500 text-sm mt-1">{errors.hoTen}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium text-sm mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onBlur={(e) => handleInputBlur("email", e.target.value)}
                    placeholder="Nhập địa chỉ email..."
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.email
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Số Điện Thoại */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium text-sm mb-2">
                  <Phone className="w-4 h-4" />
                  Số Điện Thoại
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.soDt}
                    onChange={(e) => handleInputChange("soDt", e.target.value)}
                    onBlur={(e) => handleInputBlur("soDt", e.target.value)}
                    placeholder="Nhập số điện thoại..."
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.soDt
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    required
                  />
                </div>
                {errors.soDt && (
                  <p className="text-red-500 text-sm mt-1">{errors.soDt}</p>
                )}
              </div>

              {/* Mã Nhóm */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium text-sm mb-2">
                  <Users className="w-4 h-4" />
                  Mã Nhóm
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
                  <select
                    value={formData.maNhom}
                    onChange={(e) =>
                      handleInputChange("maNhom", e.target.value)
                    }
                    onBlur={(e) => handleInputBlur("maNhom", e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none bg-white ${
                      errors.maNhom
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="">Chọn Group Code</option>
                    <option value="GP01">GP01</option>
                    <option value="GP02">GP02</option>
                    <option value="GP03">GP03</option>
                    <option value="GP04">GP04</option>
                    <option value="GP05">GP05</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {errors.maNhom && (
                  <p className="text-red-500 text-sm mt-1">{errors.maNhom}</p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                >
                  Đặt Lại
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    "Đăng Ký"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {successModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Đăng ký thành công!
              </h2>
              <p className="text-gray-600 mb-6">
                Chào mừng{" "}
                <span className="font-semibold text-blue-600">
                  {registeredUser?.hoTen}
                </span>
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Thông tin tài khoản:
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Tài khoản:</span>{" "}
                    {registeredUser?.taiKhoan}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {registeredUser?.email}
                  </p>
                  <p>
                    <span className="font-medium">Mã nhóm:</span>{" "}
                    {registeredUser?.maNhom}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSuccessModalClose}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterForm;