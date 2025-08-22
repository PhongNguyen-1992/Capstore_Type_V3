import React from "react";
import { Button, Form, Input, InputNumber, Card, Select } from "antd";

const validateMessages = {
  required: "${label} không được để trống!",
  types: {
    email: "${label} không hợp lệ!",
    number: "${label} phải là số!",
  },
  number: {
    range: "${label} phải nằm trong khoảng ${min} đến ${max}",
  },
};

const onFinish = (values: any) => {
  console.log(values);
};

const App: React.FC = () => (
  <div className="m-20 p-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
    <Card className="w-full max-w-lg shadow-2xl rounded-2xl p-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 text-center">
        Đăng Ký
      </h1>

      <Form
        name="nest-messages"
        onFinish={onFinish}
        layout="vertical"
        validateMessages={validateMessages}
        className="space-y-5"
      >
        <Form.Item
          name={["user", "taiKhoan"]}
          label="Tài Khoản"
          rules={[{ required: true }]}
        >
          <Input
            placeholder="Tài khoản sẽ đăng nhập sau này..."
            className="rounded-lg border-gray-300"
          />
        </Form.Item>
        <Form.Item
          name={["user", "password"]}
          label="Mật Khẩu"
          rules={[
            { required: true, message: "Mật khẩu không được để trống" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
          ]}
        >
          <Input.Password
            placeholder="Nhập mật khẩu đăng nhập..."
            className="rounded-lg border-gray-300"
          />
        </Form.Item>

        <Form.Item
          name={["user", "name"]}
          label="Họ và tên"
          rules={[{ required: true }]}
        >
          <Input
            placeholder="Nhập họ và tên..."
            className="rounded-lg border-gray-300"
          />
        </Form.Item>

        <Form.Item
          name={["user", "email"]}
          label="Email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input
            placeholder="Nhập email..."
            className="rounded-lg border-gray-300"
          />
        </Form.Item>

        <Form.Item
          name={["user", "sdt"]}
          label="Số Điện Thoại"
          rules={[{ required: true }]}
        >
          <Input
            className="w-full rounded-lg border-gray-300"
            placeholder="Nhập số điện thoại..."
          />
        </Form.Item>

        <Form.Item
          name={["user", "groupCode"]}
          label="Mã Nhóm"
          rules={[{ required: true, message: "Vui lòng chọn Group Code!" }]}
        >
          <Select placeholder="Chọn Group Code" className="rounded-lg">
            <Select.Option value="GP01">GP01</Select.Option>
            <Select.Option value="GP02">GP02</Select.Option>
            <Select.Option value="GP03">GP03</Select.Option>
            <Select.Option value="GP04">GP04</Select.Option>
            <Select.Option value="GP05">GP05</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name={["user", "introduction"]} label="Giới thiệu bản thân">
          <Input.TextArea
            placeholder="Viết vài lời giới thiệu..."
            rows={4}
            className="rounded-lg border-gray-300"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Gửi
          </Button>
        </Form.Item>
      </Form>
    </Card>
  </div>
);

export default App;
