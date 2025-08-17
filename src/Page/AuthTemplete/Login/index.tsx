import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, Alert, Divider, message } from "antd";
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Film, 
  ArrowRight,
  Github,
  Chrome,
  AlertCircle,
  Loader2
} from "lucide-react";
import { loginAPI } from "../../../service/auth.api";
import { userAuthStore } from "../../../store";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

const schema = z.object({
  taiKhoan: z.string().nonempty("Tài Khoản Không Được Bỏ Trống"),
  matKhau: z.string().nonempty("Mật Khẩu Không Được Bỏ Trống"),
});

type LoginFormInputs = z.infer<typeof schema>;

export default function LoginPage() {
  const { user, setUser, clearUser } = userAuthStore();
  const navigate = useNavigate();

  const { mutate: handleLogin, isPending } = useMutation({
    mutationFn: (data: LoginFormInputs) => loginAPI(data),
    onSuccess: (currentUser) => {
      setUser(currentUser);
      message.success('Đăng nhập thành công!');
      navigate('/');
    },
    onError: (error: any) => {
      message.error('Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      taiKhoan: "",
      matKhau: "",
    },
  });

  const onSubmit = (data: LoginFormInputs) => {
    handleLogin(data);  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <Film className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            PANDA CINEMA
          </h1>
          <p className="text-gray-600">
            Chào mừng trở lại! Đăng nhập để tiếp tục
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Username Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Tài Khoản
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Nhập tài khoản"
                    {...register("taiKhoan")}
                    className={`pl-10 h-12 rounded-xl border-2 transition-all duration-300 ${
                      errors.taiKhoan 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 hover:border-blue-300 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.taiKhoan && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {errors.taiKhoan.message}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Mật Khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    {...register("matKhau")}
                    className={`pl-10 h-12 rounded-xl border-2 transition-all duration-300 ${
                      errors.matKhau 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 hover:border-blue-300 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.matKhau && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {errors.matKhau.message}
                  </div>
                )}
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <a 
                  href="#" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  Quên mật khẩu?
                </a>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-12 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4" />
                    Đăng Nhập
                  </>
                )}
              </Button>
            </form>         


            {/* Register Link */}
            <div className="text-center mt-8 pt-6 border-t border-gray-100">
              <p className="text-gray-600">
                Chưa có tài khoản?{' '}
                <a 
                  href="/register" 
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Đăng ký ngay
                </a>
              </p>
            </div>
          </div>
        </Card>
    
      </div>
    </div>
  );
}