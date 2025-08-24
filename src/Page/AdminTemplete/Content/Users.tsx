import { useEffect, useState } from "react";
import { Table, Spin, Alert, Button, Modal, Form, Input, Select, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ProfileAdmin, ProfileUser } from "@/interfaces/admin.interface";
import { getUserProfilePaginatedAPI, addUserAPI } from "@/service/admin.api";
import { PlusOutlined } from "@ant-design/icons";

const SearchUserTable: React.FC = () => {
  const [users, setUsers] = useState<ProfileAdmin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  // modal state
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await getUserProfilePaginatedAPI(
        "GP00", // nhóm mặc định
        page,
        pageSize
      );
      setUsers(result.items);
      setTotal(result.totalCount);
    } catch (err) {
      setError("Không thể tải danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize]);

  // định nghĩa cột bảng
  const columns: ColumnsType<ProfileAdmin> = [
    { title: "Tài khoản", dataIndex: "taiKhoan", key: "taiKhoan" },
    { title: "Mật khẩu", dataIndex: "matKhau", key: "matKhau" },
    { title: "Họ tên", dataIndex: "hoTen", key: "hoTen" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "SĐT", dataIndex: "soDT", key: "soDT" },
    { title: "Loại", dataIndex: "maLoaiNguoiDung", key: "maLoaiNguoiDung" },
  ];

  const handleAddUser = async () => {
    try {
      const values = await form.validateFields();
      const payload: ProfileUser = {
        ...values,
        maNhom: "GP00", // nhóm mặc định
      };
      await addUserAPI(payload);
      message.success("Thêm người dùng thành công!");
      setOpen(false);
      form.resetFields();
      fetchUsers(); // reload table
    } catch (err) {
      message.error("Không thể thêm người dùng!");
    }
  };

  if (loading) return <Spin tip="Đang tải thông tin..." />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <>
      <Table
        title={() => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontWeight: 600,
                fontSize: "20px",
                color: "#1677ff",
              }}
            >
              Danh Sách Người Dùng
            </h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              shape="round"
              onClick={() => setOpen(true)}
            >
              Thêm Người Dùng
            </Button>
          </div>
        )}
        columns={columns}
        dataSource={users}
        rowKey="taiKhoan"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps);
          },
        }}
      />

      <Modal
        title="Thêm Người Dùng"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleAddUser}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="taiKhoan" label="Tài khoản" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="matKhau" label="Mật khẩu" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="hoTen" label="Họ tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="soDT" label="Số điện thoại" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="maLoaiNguoiDung"
            label="Loại người dùng"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: "KhachHang", label: "Khách Hàng" },
                { value: "QuanTri", label: "Quản Trị" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SearchUserTable;
