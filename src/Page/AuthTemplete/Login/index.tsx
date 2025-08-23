import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useMutation } from "@tanstack/react-query";
import { NavLink, useNavigate } from "react-router-dom";
import { Card, Button, Input, Form, message, Space, Typography, Divider } from "antd";
import {
  User,
  Lock, 
  ArrowRight,   
  Loader2,
  Eye,
  EyeOff
} from "lucide-react";
import { loginAPI } from "../../../service/auth.api";
import { userAuthStore } from "../../../store";

const { Title, Text, Link } = Typography;

const schema = z.object({
  taiKhoan: z.string().nonempty("Tài Khoản Không Được Bỏ Trống"),
  matKhau: z.string().nonempty("Mật Khẩu Không Được Bỏ Trống"),
});

type LoginFormInputs = z.infer<typeof schema>;

export default function LoginPage() {
  const { setUser } = userAuthStore();
  const navigate = useNavigate();

  const { mutate: handleLogin, isPending } = useMutation({
    mutationFn: (data: LoginFormInputs) => loginAPI(data),
    onSuccess: (currentUser) => {
      setUser(currentUser);
      message.success("Đăng nhập thành công!");
      navigate("/");
    },
    onError: (error: any) => {
      console.log("Login Error:", error);
      console.log("Error Response:", error?.response?.data);
      
      const errorData = error?.response?.data;
      const statusCode = error?.response?.status;
      
      if (statusCode === 404) {
        if (errorData?.message === "Không tìm thấy tài nguyên!") {
          message.error("Endpoint API không đúng! Vui lòng kiểm tra lại URL API.");
        } else {
          message.error("Tài khoản không tồn tại!");
        }
      } else if (statusCode === 401 || statusCode === 400) {
        message.error("Tài khoản hoặc mật khẩu không đúng!");
      } else {
        message.error(errorData?.content || "Đăng nhập thất bại! Vui lòng thử lại.");
      }
    },
  });

  const {
   
    formState:{},
    
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      taiKhoan: "",
      matKhau: "",
    },
  });


  const onFinish = (values: any) => {
    handleLogin(values);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Title 
            level={1} 
            className="!text-3xl !font-bold !bg-gradient-to-r !from-blue-600 !to-purple-600 !bg-clip-text !text-transparent !mb-2"
          >
            Đăng Nhập
          </Title>
          <Text className="text-gray-600 text-base">
            Chào mừng trở lại! Đăng nhập để tiếp tục
          </Text>
        </div>

        {/* Login Card */}
        <Card 
          className="shadow-2xl !border-0 !rounded-2xl overflow-hidden"
          bodyStyle={{ padding: '2rem' }}
        >
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            className="space-y-4"
          >
            {/* Username Field */}
            <Form.Item
              label={
                <Space className="text-sm font-semibold text-gray-700">
                  <User className="h-4 w-4" />
                  Tài Khoản
                </Space>
              }
              name="taiKhoan"
              rules={[
                { required: true, message: 'Tài Khoản Không Được Bỏ Trống' }
              ]}
              className="mb-6"
            >
              <Input
                prefix={<User className="h-4 w-4 text-gray-400" />}
                placeholder="Nhập tài khoản"
                className="h-12 !rounded-xl !border-2 hover:!border-blue-300 focus:!border-blue-500 transition-all duration-300"
              />
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              label={
                <Space className="text-sm font-semibold text-gray-700">
                  <Lock className="h-4 w-4" />
                  Mật Khẩu
                </Space>
              }
              name="matKhau"
              rules={[
                { required: true, message: 'Mật Khẩu Không Được Bỏ Trống' }
              ]}
              className="mb-4"
            >
              <Input.Password
                prefix={<Lock className="h-4 w-4 text-gray-400" />}
                placeholder="Nhập mật khẩu"
                iconRender={(visible) => 
                  visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />
                }
                className="h-12 !rounded-xl !border-2 hover:!border-blue-300 focus:!border-blue-500 transition-all duration-300"
              />
            </Form.Item>

            {/* Forgot Password */}
            <div className="text-right mb-6">
              <Link 
                href="#" 
                className="!text-blue-600 hover:!text-blue-700 !text-sm font-medium transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Login Button */}
            <Form.Item className="mb-6">
              <Button
                type="primary"
                htmlType="submit"
                loading={isPending}
                className="w-full !bg-gradient-to-r !from-blue-600 !to-purple-600 hover:!from-blue-700 hover:!to-purple-700 !border-0 !rounded-xl !shadow-lg hover:!shadow-xl !transition-all !duration-300 !h-12 !font-semibold"
                icon={isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              >
                {isPending ? "Đang đăng nhập..." : "Đăng Nhập"}
              </Button>
            </Form.Item>
          </Form>

          {/* Register Link */}
          <Divider className="!my-6" />
          <div className="text-center">
            <Text className="text-gray-600">
              Chưa có tài khoản?{" "}
              <NavLink
                to="/auth/register"
                className="!text-blue-600 hover:!text-blue-700 !font-semibold !transition-colors !no-underline"
              >
                Đăng ký ngay
              </NavLink>
            </Text>
          </div>
        </Card>

        {/* Additional Features */}
        <div className="mt-6 text-center">
          <Space direction="vertical" size="small">
            <Text className="text-gray-500 text-sm">
              Hoặc đăng nhập bằng
            </Text>
            <Space size="large">
              <Button
                shape="circle"
                size="large"
                className="!w-12 !h-12 !border-2 !border-gray-200 hover:!border-blue-300 !transition-all !duration-300"
                icon={
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                }
              />
              <Button
                shape="circle"
                size="large"
                className="!w-12 !h-12 !border-2 !border-gray-200 hover:!border-blue-300 !transition-all !duration-300"
                icon={
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                }
              />
            </Space>
          </Space>
        </div>
      </div>
    </div>
  );
}