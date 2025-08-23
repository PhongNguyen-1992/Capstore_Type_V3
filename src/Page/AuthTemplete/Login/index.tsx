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
      </div>
    </div>
  );
}