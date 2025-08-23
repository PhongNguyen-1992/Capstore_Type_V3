import { useEffect, useState } from "react";
import { Card, Spin, Alert } from "antd";

import type { ProfileAdmin } from "@/interfaces/admin.interface";
import { getAdminProfileAPI } from "@/service/admin.api";

const SearchUserCard: React.FC = () => {
  const [users, setUsers] = useState<ProfileAdmin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const result = await getAdminProfileAPI("GP01", "Adm08"); //query cứng mẫu
        setUsers(result);
      } catch (err) {
        setError("Không thể tải danh sách người dùng!");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <Spin tip="Đang tải thông tin..." />;
  if (error) return <Alert message={error} type="error" />;

  return (
  <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%", // để chiếm full height content
    padding: "24px 0",
  }}
>
  <Card
    title="Profile Admin"
    bordered={false}
    style={{
      width: 500,
      borderRadius: 12,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      padding: "16px",
      backgroundColor: "#fefefe",
    }}
  >
    {users.map((u) => (
      <div
        key={u.taiKhoan}
        style={{
          marginBottom: 12,
          padding: 12,
          borderRadius: 8,
          backgroundColor: "#ffffff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <p><strong style={{ color: "#555" }}>Tài khoản:</strong> <span style={{ color: "#111" }}>{u.taiKhoan}</span></p>
        <p><strong style={{ color: "#555" }}>Mật Khẩu:</strong> <span style={{ color: "#111" }}>{u.matKhau}</span></p>
        <p><strong style={{ color: "#555" }}>Họ tên:</strong> <span style={{ color: "#111" }}>{u.hoTen}</span></p>
        <p><strong style={{ color: "#555" }}>Email:</strong> <span style={{ color: "#111" }}>{u.email}</span></p>
        <p><strong style={{ color: "#555" }}>SĐT:</strong> <span style={{ color: "#111" }}>{u.soDT}</span></p>
        <p><strong style={{ color: "#555" }}>Loại:</strong> <span style={{ color: "#111" }}>{u.maLoaiNguoiDung}</span></p>
      </div>
    ))}
  </Card>
</div>

  );
};

export default SearchUserCard;
