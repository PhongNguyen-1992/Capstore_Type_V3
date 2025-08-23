import { useEffect, useState } from "react";
import { Table, Spin, Alert, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ProfileAdmin } from "@/interfaces/admin.interface";
import { getUserProfilePaginatedAPI } from "@/service/admin.api";
import { PlusOutlined } from "@ant-design/icons";

const SearchUserTable: React.FC = () => {
  const [users, setUsers] = useState<ProfileAdmin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const result = await getUserProfilePaginatedAPI(
          "GP00", // nhóm mặc định
          page, // số trang hiện tại
          pageSize, // số phần tử / trang         
        );

        setUsers(result.items);
        setTotal(result.totalCount);
      } catch (err) {
        setError("Không thể tải danh sách người dùng!");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, pageSize]);

  if (loading) return <Spin tip="Đang tải thông tin..." />;
  if (error) return <Alert message={error} type="error" />;

  // định nghĩa cột bảng
  const columns: ColumnsType<ProfileAdmin> = [
    {
      title: "Tài khoản",
      dataIndex: "taiKhoan",
      key: "taiKhoan",
    },
    {
      title: "Mật Khẩu",
      dataIndex: "matKhau",
      key: "matKhau",
    },
    {
      title: "Họ tên",
      dataIndex: "hoTen",
      key: "hoTen",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "SĐT",
      dataIndex: "soDT",
      key: "soDt",
    },
    {
      title: "Loại",
      dataIndex: "maLoaiNguoiDung",
      key: "maLoaiNguoiDung",
    },
  ];

  return (
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
          <Button type="primary" icon={<PlusOutlined />} shape="round">
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
  );
};

export default SearchUserTable;
