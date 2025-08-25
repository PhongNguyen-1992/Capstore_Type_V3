import {
  useEffect,
  useState,
  useCallback,
  type ErrorInfo,
  type ReactNode,
  Component,
  type FC,
} from "react";
import {
  Table,
  Spin,
  Alert,
  Button,
  Modal,
  Form,
  Input,
  message,
  Card,
  Row,
  Col,
  Tag,
  Avatar,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  ClearOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Search, Users, UserPlus } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { ProfileAdmin } from "@/interfaces/admin.interface";
import type { ProfileUser } from "@/interfaces/auth.interface";
import {
  getAllUsersAPI,
  getUserProfilePaginatedAPI,
  searchUsersAPI,
} from "@/service/admin.api";
import { addUserAPI, isLoggedIn, getCurrentUser } from "@/service/auth.api";
import ModalAddUser from "../Active/AddUser";

// Error Boundary Component
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("React Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <Alert
            message="Có lỗi xảy ra trong ứng dụng"
            description={this.state.error?.message || "Lỗi không xác định"}
            type="error"
            showIcon
            action={
              <Button
                size="small"
                danger
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.reload();
                }}
              >
                Tải lại trang
              </Button>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}

const { Search: AntSearch } = Input;

const SearchUserTable: FC = () => {
  const [users, setUsers] = useState<ProfileAdmin[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ProfileAdmin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  // pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // modal state
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  // total admin and customer
  const [adminCount, setAdminCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);

  // Check login status when component mounts
  useEffect(() => {
    if (!isLoggedIn()) {
      console.warn("User not logged in");
      // Optionally redirect or show warning
      message.warning("Vui lòng đăng nhập để sử dụng chức năng này");
    } else {
      const user = getCurrentUser();
      console.log("Current user:", user?.taiKhoan);
    }
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getUserProfilePaginatedAPI(
        "GP00", // nhóm mặc định
        page,
        pageSize
      );

      if (result && result.items && Array.isArray(result.items)) {
        setUsers(result.items);
        setFilteredUsers(result.items);
        setTotal(result.totalCount || 0);
      } else {
        setUsers([]);
        setFilteredUsers([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Không thể tải danh sách người dùng!");
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize]);

  // Search handler
  const handleSearch = useCallback(
    async (value: string) => {
      setSearchText(value);

      if (!value.trim()) {
        fetchUsers();
        return;
      }

      setLoading(true);
      try {
        const result = await searchUsersAPI(value, "GP00", page, pageSize);
        setFilteredUsers(result.items);
        setTotal(result.totalCount);
        setPage(1);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize]
  );

  const clearSearch = () => {
    setSearchText("");
    setFilteredUsers(users);
    setPage(1);
  };

  // User type badge component
  const UserTypeBadge = ({ type }: { type: string }) => {
    const isAdmin = type === "QuanTri";
    return (
      <Tag
        color={isAdmin ? "red" : "blue"}
        icon={isAdmin ? <UsergroupAddOutlined /> : <UserOutlined />}
        className="rounded-full"
      >
        {isAdmin ? "Quản Trị" : "Khách Hàng"}
      </Tag>
    );
  };

  // định nghĩa cột bảng
  const columns: ColumnsType<ProfileAdmin> = [
    {
      title: "Avatar",
      key: "avatar",
      width: 80,
      render: (_, record) => (
        <Avatar
          size={40}
          style={{
            backgroundColor:
              record.maLoaiNguoiDung === "QuanTri" ? "#ff4d4f" : "#1677ff",
          }}
          icon={<UserOutlined />}
        >
          {record.hoTen?.charAt(0)?.toUpperCase()}
        </Avatar>
      ),
    },
    {
      title: "Tài khoản",
      dataIndex: "taiKhoan",
      key: "taiKhoan",
      width: 150,
      render: (text: string) => (
        <span className="font-semibold text-gray-800">{text}</span>
      ),
      sorter: (a, b) => (a.taiKhoan || "").localeCompare(b.taiKhoan || ""),
    },
    {
      title: "Thông tin cá nhân",
      key: "personalInfo",
      width: 250,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <UserOutlined className="text-gray-400 text-xs" />
            <span className="font-medium">{record.hoTen}</span>
          </div>
          <div className="flex items-center gap-2">
            <MailOutlined className="text-gray-400 text-xs" />
            <span className="text-sm text-gray-600">{record.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <PhoneOutlined className="text-gray-400 text-xs" />
            <span className="text-sm text-gray-600">{record.soDT}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Loại người dùng",
      dataIndex: "maLoaiNguoiDung",
      key: "maLoaiNguoiDung",
      width: 150,
      render: (type: string) => <UserTypeBadge type={type} />,
      filters: [
        { text: "Quản Trị", value: "QuanTri" },
        { text: "Khách Hàng", value: "KhachHang" },
      ],
      onFilter: (value, record) => record.maLoaiNguoiDung === value,
    },
    {
      title: "Mật khẩu",
      dataIndex: "matKhau",
      key: "matKhau",
      width: 120,
      render: (password: string) => (
        <Tooltip title="Click để hiện mật khẩu">
          <Button
            type="text"
            size="small"
            className="text-gray-400 hover:text-gray-600"
            onClick={() => {
              Modal.info({
                title: "Mật khẩu",
                content: (
                  <div className="py-2">
                    {/* Chỉ dùng Input thường để show */}
                    <Input value={password} readOnly className="font-mono" />
                  </div>
                ),
                okText: "Đóng",
              });
            }}
          >
            ••••••••
          </Button>
        </Tooltip>
      ),
    },
  ];

  const handleAddUser = async () => {
    try {
      console.log("Starting handleAddUser...");

      // Kiểm tra đăng nhập trước
      if (!isLoggedIn()) {
        Modal.error({
          title: "Chưa đăng nhập",
          content: "Vui lòng đăng nhập để thực hiện chức năng này!",
          onOk: () => {
            // Có thể redirect to login page
            // window.location.href = '/login';
          },
        });
        return;
      }

      // Validate form first
      const values = await form.validateFields();
      console.log("Form validation passed:", values);

      // Check required fields manually
      const requiredFields = [
        { field: "taiKhoan", name: "tài khoản" },
        { field: "matKhau", name: "mật khẩu" },
        { field: "email", name: "email" },
        { field: "hoTen", name: "họ tên" },
      ];

      for (const { field, name } of requiredFields) {
        if (!values[field]?.trim()) {
          Modal.error({
            title: "Thiếu thông tin",
            content: `Vui lòng nhập ${name}!`,
          });
          return;
        }
      }

      // Create payload with proper field mapping
      const payload: ProfileUser = {
        taiKhoan: values.taiKhoan.trim(),
        matKhau: values.matKhau.trim(),
        email: values.email.trim(),
        soDt: values.soDT?.trim() || "", // Map soDT -> soDt
        hoTen: values.hoTen?.trim() || "",
        maLoaiNguoiDung: values.maLoaiNguoiDung || "KhachHang",
        maNhom: "GP00",
      };

      console.log("Sending payload:", payload);

      // Show loading state
      setLoading(true);

      // Call API
      const result = await addUserAPI(payload);
      console.log("API call successful:", result);

      // Success handling
      Modal.success({
        title: "Thành công",
        content: `Người dùng "${payload.taiKhoan}" đã được thêm thành công!`,
      });

      // Cleanup
      setOpen(false);
      form.resetFields();

      // Refresh data
      console.log("Refreshing user list...");
      await fetchUsers();

      // Show success message
      message.success(`Đã thêm người dùng "${payload.hoTen}" thành công!`);
    } catch (err: any) {
      console.error("handleAddUser error:", err);

      // Show error modal with specific message
      Modal.error({
        title: "Thêm người dùng thất bại",
        content: err.message || "Có lỗi xảy ra, vui lòng thử lại!",
      });

      // Show error message in notification
      message.error(err.message || "Thêm người dùng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  // Gọi Full danh sách user để đếm
  const fetchAllUsersForCount = async () => {
    try {
      const allUsers = await getAllUsersAPI("GP00");
      setAdminCount(
        allUsers.filter((u) => u.maLoaiNguoiDung === "QuanTri").length
      );
      setCustomerCount(
        allUsers.filter((u) => u.maLoaiNguoiDung === "KhachHang").length
      );
    } catch (err) {
      console.error("Không thể lấy danh sách user để đếm");
    }
  };

  useEffect(() => {
    fetchAllUsersForCount();
  }, []);

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Đang tải danh sách người dùng..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert
          message="Lỗi tải dữ liệu"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={fetchUsers}>
              Thử lại
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header Section */}
        <Card className="mb-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-500" />
                Quản Lý Người Dùng
              </h1>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>
                  Tổng: <strong>{filteredUsers.length}</strong>
                </span>
                <span>
                  Quản trị:{" "}
                  <strong className="text-red-600">{adminCount}</strong>
                </span>
                <span>
                  Khách hàng:{" "}
                  <strong className="text-blue-600">{customerCount}</strong>
                </span>
              </div>
            </div>
            <Button
              type="primary"
              size="large"
              icon={<UserPlus className="w-4 h-4" />}
              onClick={() => setOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none rounded-lg px-6"
              disabled={!isLoggedIn()}
            >
              Thêm Người Dùng
            </Button>
          </div>
        </Card>

        {/* Search Section */}
        <Card className="mb-6 shadow-sm">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={18} md={20}>
              <AntSearch
                placeholder="Tìm kiếm theo tên, tài khoản, email hoặc số điện thoại..."
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                onSearch={handleSearch}
                size="large"
                className="rounded-lg"
                allowClear
                enterButton={
                  <Button
                    type="primary"
                    icon={<Search className="w-4 h-4" />}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Tìm kiếm
                  </Button>
                }
              />
            </Col>
            <Col xs={24} sm={6} md={4}>
              <Button
                icon={<ClearOutlined />}
                onClick={clearSearch}
                disabled={!searchText}
                className="w-full rounded-lg"
                size="large"
              >
                Xóa bộ lọc
              </Button>
            </Col>
          </Row>

          {searchText && (
            <div className="mt-3 text-sm text-gray-600">
              Tìm thấy{" "}
              <strong className="text-blue-600">{filteredUsers.length}</strong>{" "}
              kết quả cho "{searchText}"
            </div>
          )}
        </Card>

        {/* Table Section */}
        <Card className="shadow-sm">
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="taiKhoan"
            loading={loading}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `Hiển thị ${range[0]}-${range[1]} trong ${total} người dùng`,
              pageSizeOptions: ["5", "10", "20", "50"],
              onChange: (p, ps) => {
                setPage(p);
                if (ps) setPageSize(ps);
              },
            }}
            scroll={{ x: 800 }}
            className="rounded-lg"
            rowClassName="hover:bg-blue-50"
            size="middle"
          />
        </Card>

        {/* Modal Add User - Now using the separated component */}
        <ModalAddUser
          open={open}
          loading={loading}
          form={form}
          onCancel={handleModalCancel}
          onOk={handleAddUser}
        />
      </div>
    </ErrorBoundary>
  );
};

export default SearchUserTable;