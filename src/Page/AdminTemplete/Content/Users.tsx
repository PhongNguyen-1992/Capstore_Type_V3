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
  Form,
  Input,
  message,
  Card,
  Row,
  Col,
  Tag,
  Avatar,
  Tooltip,
  Space,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  ClearOutlined,
  UsergroupAddOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Users, UserPlus } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { ProfileAdmin } from "@/interfaces/admin.interface";
import type { ProfileUser } from "@/interfaces/auth.interface";
import {
  getAllUsersAPI,
  getUserProfilePaginatedAPI,
  searchUsersAPI,
  updateUserAPI,
  deleteUserAPI,
} from "@/service/admin.api";
import { addUserAPI, isLoggedIn, getCurrentUser } from "@/service/auth.api";
import ModalAddUser from "../Active/AddUser";
import ModalEditUser from "../Active/EditUser";
import DeleteUserButton from "../Active/DeleteUser";

// -------------------- ERROR BOUNDARY --------------------
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

// -------------------- HELPER COMPONENTS --------------------
const UserTypeBadge: FC<{ type: string }> = ({ type }) => {
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

const ActionCell: FC<{
  record: ProfileAdmin;
  canEdit: (r: ProfileAdmin) => boolean;
  canDelete: (r: ProfileAdmin) => boolean;
  onEdit: (r: ProfileAdmin) => void;
  onDelete: (taiKhoan: string) => void;
  deleteLoading: string | null;
}> = ({ record, canEdit, canDelete, onEdit, onDelete, deleteLoading }) => (
  <Space size="small">
    <Tooltip title={canEdit(record) ? "Sửa thông tin" : "Bạn không có quyền sửa"}>
      <Button
        type="primary"
        ghost
        size="small"
        icon={<EditOutlined />}
        onClick={() => onEdit(record)}
        disabled={!canEdit(record)}
      />
    </Tooltip>
    <DeleteUserButton
      taiKhoan={record.taiKhoan}
      canDelete={canDelete(record)}
      loading={deleteLoading === record.taiKhoan}
      onDelete={onDelete}
    />
  </Space>
);

// -------------------- MAIN COMPONENT --------------------
const { Search: AntSearch } = Input;

const SearchUserTable: FC = () => {
  // --------- STATE ---------
  const [users, setUsers] = useState<ProfileAdmin[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ProfileAdmin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm] = Form.useForm();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm] = Form.useForm();
  const [editingUser, setEditingUser] = useState<ProfileAdmin | null>(null);

  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [adminCount, setAdminCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.maLoaiNguoiDung === "QuanTri";

  const canEdit = (record: ProfileAdmin) =>
    isLoggedIn() && (isAdmin || currentUser?.taiKhoan === record.taiKhoan);

  const canDelete = () => isLoggedIn() && isAdmin;

  // --------- API CALLS ---------
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getUserProfilePaginatedAPI("GP00", page, pageSize);
      if (result?.items && Array.isArray(result.items)) {
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

  const fetchAllUsersForCount = async () => {
    try {
      const allUsers = await getAllUsersAPI("GP00");
      setAdminCount(allUsers.filter((u) => u.maLoaiNguoiDung === "QuanTri").length);
      setCustomerCount(allUsers.filter((u) => u.maLoaiNguoiDung === "KhachHang").length);
    } catch (err) {
      console.error("Không thể lấy danh sách user để đếm");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAllUsersForCount();
  }, [page, pageSize]);

  const handleSearch = useCallback(
    async (value: string) => {
      setSearchText(value);
      if (!value.trim()) return fetchUsers();

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

  // --------- HANDLE ADD/EDIT/DELETE ---------
  const handleAddUser = async () => {
    try {
      if (!isLoggedIn()) {
        return message.error("Vui lòng đăng nhập!");
      }
      const values = await addForm.validateFields();
      const payload: ProfileUser = {
        taiKhoan: values.taiKhoan.trim(),
        matKhau: values.matKhau.trim(),
        email: values.email.trim(),
        soDt: values.soDT?.trim() || "",
        hoTen: values.hoTen?.trim() || "",
        maLoaiNguoiDung: values.maLoaiNguoiDung || "KhachHang",
        maNhom: "GP00",
      };
      setLoading(true);
      await addUserAPI(payload);
      message.success(`Đã thêm người dùng "${payload.hoTen}" thành công!`);
      setAddModalOpen(false);
      addForm.resetFields();
      await fetchUsers();
      await fetchAllUsersForCount();
    } catch (err: any) {
      console.error(err);
      message.error(err.message || "Thêm người dùng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (record: ProfileAdmin) => {
    if (!canEdit(record)) {
      return message.error("Bạn chỉ có thể chỉnh sửa thông tin của chính mình.");
    }
    setEditingUser(record);
    editForm.setFieldsValue({
      taiKhoan: record.taiKhoan,
      matKhau: record.matKhau,
      email: record.email,
      soDt: record.soDT,
      hoTen: record.hoTen,
      maLoaiNguoiDung: record.maLoaiNguoiDung,
      maNhom: "GP00",
    });
    setEditModalOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      setUpdateLoading(true);
      const values = await editForm.validateFields();
      const payload: ProfileUser = {
        taiKhoan: values.taiKhoan.trim(),
        matKhau: values.matKhau.trim(),
        email: values.email.trim(),
        soDt: values.soDt?.trim() || "",
        hoTen: values.hoTen?.trim() || "",
        maLoaiNguoiDung: values.maLoaiNguoiDung || "KhachHang",
        maNhom: "GP00",
      };
      await updateUserAPI(payload);
      message.success(`Cập nhật người dùng "${payload.hoTen}" thành công!`);
      setEditModalOpen(false);
      setEditingUser(null);
      editForm.resetFields();
      await fetchUsers();
      await fetchAllUsersForCount();
    } catch (err: any) {
      console.error(err);
      message.error(err.message || "Cập nhật thất bại!");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteUser = async (taiKhoan: string) => {
    try {
      setDeleteLoading(taiKhoan);
      await deleteUserAPI(taiKhoan);
      message.success(`Xóa người dùng "${taiKhoan}" thành công!`);
      await fetchUsers();
      await fetchAllUsersForCount();
    } catch (err: any) {
      console.error(err);
      message.error(err.message || "Xóa người dùng thất bại!");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEditModalCancel = () => {
    setEditModalOpen(false);
    setEditingUser(null);
    editForm.resetFields();
  };

  const handleAddModalCancel = () => {
    setAddModalOpen(false);
    addForm.resetFields();
  };

  // --------- TABLE COLUMNS ---------
  const columns: ColumnsType<ProfileAdmin> = [
    {
      title: "Avatar",
      key: "avatar",
      width: 80,
      render: (_, record) => (
        <Avatar
          size={40}
          style={{
            backgroundColor: record.maLoaiNguoiDung === "QuanTri" ? "#ff4d4f" : "#1677ff",
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
      render: (text: string) => <span className="font-semibold">{text}</span>,
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
      title: "Thao tác",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <ActionCell
          record={record}
          canEdit={canEdit}
          canDelete={canDelete}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          deleteLoading={deleteLoading}
        />
      ),
    },
  ];

  // --------- RENDER ---------
  if (loading && users.length === 0)
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Đang tải danh sách người dùng..." />
      </div>
    );

  if (error)
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

  return (
    <ErrorBoundary>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <Card className="mb-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-500" /> Quản Lý Người Dùng
              </h1>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>Tổng: <strong>{filteredUsers.length}</strong></span>
                <span>Quản trị: <strong className="text-red-600">{adminCount}</strong></span>
                <span>Khách hàng: <strong className="text-blue-600">{customerCount}</strong></span>
              </div>
            </div>
            <Button
              type="primary"
              size="large"
              icon={<UserPlus className="w-4 h-4" />}
              onClick={() => setAddModalOpen(true)}
              disabled={!isLoggedIn()}
            >
              Thêm Người Dùng
            </Button>
          </div>
        </Card>

        {/* Search */}
        <Card className="mb-6 shadow-sm">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={18} md={20}>
              <AntSearch
                placeholder="Tìm kiếm..."
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                onSearch={handleSearch}
                size="large"
                allowClear
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
        </Card>

        {/* Table */}
        <Card className="shadow-sm">
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="taiKhoan"
            loading={loading}
            pagination={{
              current: page,
              pageSize,
              total,
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
            rowClassName="hover:bg-blue-50"
            size="middle"
          />
        </Card>

        {/* Modals */}
        <ModalAddUser
          open={addModalOpen}
          loading={loading}
          form={addForm}
          onCancel={handleAddModalCancel}
          onOk={handleAddUser}
        />
        <ModalEditUser
          open={editModalOpen}
          loading={updateLoading}
          form={editForm}
          isAdmin={isAdmin}
          onCancel={handleEditModalCancel}
          onSubmit={handleUpdateUser}
        />
      </div>
    </ErrorBoundary>
  );
};

export default SearchUserTable;
