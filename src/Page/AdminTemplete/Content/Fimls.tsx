import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Form,
  Upload,
  DatePicker,
  message,
  Modal as AntdModal,
  Row,
  Col,
  Divider,
  Checkbox, 
  Alert,
  Modal,
} from "antd";
import { Edit, Trash2, Plus, Eye } from "lucide-react";
import { UploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import {
  updateMovieAPI,
  deleteMovieAPI,
  getMoviePaginatedAPI,
  
} from "@/service/admin.api";
import type { Movie } from "@/interfaces/movie.interface";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";


dayjs.extend(isSameOrBefore);

interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

const FilmsManage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [form] = Form.useForm();
  const [selectedKey, setSelectedKey] = useState<"list" | "add">("list");
  const [successModal, setSuccessModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewVisible, setPreviewVisible] = useState(false);

  // Fetch movies
  const fetchMovies = async (page: number = 1, pageSize: number = 10) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getMoviePaginatedAPI("GP01", page, pageSize);
      if (result && result.items && Array.isArray(result.items)) {
        setMovies(result.items);
        setPagination({
          current: result.currentPage || page,
          pageSize: pageSize,
          total: result.totalCount || 0,
        });
      } else {
        setMovies([]);
        setPagination((prev) => ({ ...prev, total: 0 }));
      }
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError("Không thể tải danh sách phim!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(1, 10);
  }, []);

  const handleTableChange = (paginationInfo: any) => {
    const { current, pageSize } = paginationInfo;
    fetchMovies(current, pageSize);
  };

  // Helper function to determine movie status based on release date
  const getMovieStatus = (releaseDate: any) => {
    if (!releaseDate) return { dangChieu: false, sapChieu: true };

    const now = dayjs();
    const release = dayjs(releaseDate);

    if (release.isSameOrBefore(now, "day")) {
      return { dangChieu: true, sapChieu: false };
    } else {
      return { dangChieu: false, sapChieu: true };
    }
  };

  // Helper function to convert file to base64 (for preview)
  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // Handle preview image - FIXED
  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      if (file.originFileObj) {
        file.preview = await getBase64(file.originFileObj);
      }
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  // Validate form data
  const validateFormData = (values: any): string | null => {
    if (!values.tenPhim?.trim()) {
      return "Vui lòng nhập tên phim!";
    }

    if (!values.trailer?.trim()) {
      return "Vui lòng nhập URL trailer!";
    }

    // Validate URL format
    try {
      new URL(values.trailer);
    } catch {
      return "URL trailer không hợp lệ!";
    }

    if (!values.moTa?.trim()) {
      return "Vui lòng nhập mô tả phim!";
    }

    if (!values.ngayKhoiChieu) {
      return "Vui lòng chọn ngày khởi chiếu!";
    }

    const danhGia = Number(values.danhGia);
    if (!values.danhGia || isNaN(danhGia) || danhGia < 0 || danhGia > 10) {
      return "Đánh giá phải là số từ 0 đến 10!";
    }

    return null;
  };

  // ADD movie - Keep your working version
  const handleAddMovie = async (values: any) => {
    try {     
      setLoading(true);

      // Validate form data
      const validationError = validateFormData(values);
      if (validationError) {
        message.error(validationError);
        return;
      }

      // Check for image - FIXED
      if (!values.hinhAnh || values.hinhAnh.length === 0 || !values.hinhAnh[0]?.originFileObj) {
        message.error("Vui lòng chọn hình ảnh cho phim!");
        return;
      }

      // Auto-determine status based on release date
      const status = getMovieStatus(values.ngayKhoiChieu);

      // Create FormData directly
      const formData = new FormData();

      formData.append("tenPhim", values.tenPhim.trim());
      formData.append("biDanh", values.tenPhim.trim());
      formData.append("trailer", values.trailer.trim());
      formData.append("moTa", values.moTa.trim());
      formData.append("maNhom", "GP01");
      formData.append("ngayKhoiChieu", values.ngayKhoiChieu.format("DD/MM/YYYY"));
      formData.append("sapChieu", status.sapChieu ? "true" : "false");
      formData.append("dangChieu", status.dangChieu ? "true" : "false");
      formData.append("hot", values.hot ? "true" : "false");
      formData.append("danhGia", values.danhGia.toString());

      // CRITICAL: Append file correctly
      const imageFile = values.hinhAnh[0].originFileObj;
      formData.append("File", imageFile);

      // Call API với FormData trực tiếp
      const response = await fetch(`${import.meta.env.VITE_API_URL}/QuanLyPhim/ThemPhimUploadHinh`, {
        method: 'POST',
        body: formData,
        headers: {
          'TokenCybersoft': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eVOf1g8zhTZZg6WSx4',
          ...(localStorage.getItem('user') && {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')!).accessToken}`
          })
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("✅ Movie added successfully:", result);

      message.success("Thêm phim thành công!");
      setSuccessModal(true);
      form.resetFields();

    } catch (err: any) {
      console.error("❌ Add movie error:", err);
      const errorMessage = err.message || "Thêm phim thất bại";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
 

  // UPDATE movie - FIXED
  const handleUpdateMovie = async (values: any) => {
    try {
      if (!currentMovie) {
        message.error("Không tìm thấy thông tin phim!");
        return;
      }

      setLoading(true);
      const formData = new FormData();

      // Auto-determine status based on release date
      const status = getMovieStatus(values.ngayKhoiChieu);

      formData.append("maPhim", currentMovie.maPhim.toString());
      formData.append("tenPhim", values.tenPhim);
      formData.append("biDanh", values.tenPhim); // Use tenPhim as biDanh
      formData.append("trailer", values.trailer);
      formData.append("moTa", values.moTa);
      formData.append("maNhom", "GP01");

      // Format ngày dd/MM/yyyy
      if (values.ngayKhoiChieu) {
        formData.append("ngayKhoiChieu", values.ngayKhoiChieu.format("DD/MM/YYYY"));
      }

      // Use auto-determined status or manual values
      formData.append("sapChieu", status.sapChieu ? "true" : "false");
      formData.append("dangChieu", status.dangChieu ? "true" : "false");
      formData.append("hot", values.hot ? "true" : "false");
      formData.append("danhGia", values.danhGia.toString());

      // Only append File if there's a new image uploaded
      if (values.hinhAnh?.[0]?.originFileObj) {
        formData.append("File", values.hinhAnh[0].originFileObj);
      }

      // Debug log FormData
      console.log("📤 Updating movie with data:");
      for (let [key, val] of formData.entries()) {
        console.log(key, val);
      }

      // Call API update
      await updateMovieAPI(formData);

      message.success("Cập nhật phim thành công!");
      setEditModal(false);
      setCurrentMovie(null);
      form.resetFields();
      fetchMovies(pagination.current, pagination.pageSize);

    } catch (err: any) {
      console.error("❌ Update movie error:", err);
      message.error(err.response?.data?.content || "Cập nhật phim thất bại");
    } finally {
      setLoading(false);
    }
  };
  

  // DELETE movie - FIXED
  const handleDeleteMovie = (movie: Movie) => {
    Modal.confirm({
      title: `Bạn có chắc muốn xoá phim "${movie.tenPhim}"?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác!',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setLoading(true);
          await deleteMovieAPI(movie.maPhim);
          message.success("Xoá phim thành công!");
          fetchMovies(pagination.current, pagination.pageSize);
        } catch (err: any) {
          console.error("❌ Delete movie error:", err);
          message.error(err.response?.data?.content || "Xoá phim thất bại!");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Watch ngayKhoiChieu changes to auto-update status
  const handleDateChange = (date: any) => {
    if (date) {
      const status = getMovieStatus(date);
      form.setFieldsValue({
        dangChieu: status.dangChieu,
        sapChieu: status.sapChieu,
      });
    }
  };

  const columns: ColumnsType<Movie> = [
    {
      title: "Mã Phim",
      dataIndex: "maPhim",
      key: "maPhim",
      width: 100,
      className: "text-center font-medium",
    },
    {
      title: "Tên Phim",
      dataIndex: "tenPhim",
      key: "tenPhim",
      width: 200,
      ellipsis: true,
      className: "font-semibold",
    },
    {
      title: "Hình Ảnh",
      dataIndex: "hinhAnh",
      key: "hinhAnh",
      width: 120,
      render: (hinhAnh: string, record) => (
        <div className="flex justify-center">
          <img
            src={hinhAnh}
            alt={record.tenPhim}
            className="w-16 h-20 object-cover rounded-lg shadow-md border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA2NCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yOCAzNkMyOCAzMi42ODYzIDMwLjY4NjMgMzAgMzQgMzBDMzcuMzEzNyAzMCA0MCAzMi42ODYzIDQwIDM2QzQwIDM5LjMxMzcgMzcuMzEzNyA0MiAzNCA0MkMzMC42ODYzIDQyIDI4IDM5LjMxMzcgMjggMzZaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yMCA1MEwyMCA1OEw0NCA1OEw0NCA1MEwzNi41IDQyLjVMMzEuNSA0Ny41TDI2LjUgNDIuNUwyMCA1MFoiIGZpbGw9IiM5QjlCQTAiLz4KPC9zdmc+";
            }}
            onClick={() => {
              setPreviewImage(hinhAnh);
              setPreviewVisible(true);
            }}
          />
        </div>
      ),
    },
    {
      title: "Mô Tả",
      dataIndex: "moTa",
      key: "moTa",
      width: 250,
      ellipsis: true,
      className: "text-gray-600",
    },
    {
      title: "Đánh Giá",
      dataIndex: "danhGia",
      key: "danhGia",
      width: 100,
      render: (danhGia: number) => (
        <div className="text-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            ⭐ {danhGia}/10
          </span>
        </div>
      ),
    },
    {
      title: "Ngày Khởi Chiếu",
      dataIndex: "ngayKhoiChieu",
      key: "ngayKhoiChieu",
      width: 130,
      render: (date: Date) => (
        <span className="text-sm font-medium">
          {new Date(date).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      title: "Trạng Thái",
      key: "status",
      width: 120,
      render: (_, record) => (
        <div className="space-y-1">
          {record.dangChieu && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              🎬 Đang chiếu
            </span>
          )}
          {record.sapChieu && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              🔜 Sắp chiếu
            </span>
          )}
          {record.hot && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              🔥 Hot
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Thao Tác",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="default"
            size="small"
            icon={<Eye className="w-4 h-4" />}
            className="bg-gray-100 hover:bg-gray-200 border-gray-300"
            onClick={() => {
              setPreviewImage(record.hinhAnh);
              setPreviewVisible(true);
            }}
            title="Xem ảnh"
          />
          <Button
            type="primary"
            size="small"
            icon={<Edit className="w-4 h-4" />}
            className="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600"
            onClick={() => {
              setCurrentMovie(record);
              setEditModal(true);
              form.setFieldsValue({
                tenPhim: record.tenPhim,
                trailer: record.trailer,
                moTa: record.moTa,
                ngayKhoiChieu: dayjs(record.ngayKhoiChieu),
                dangChieu: record.dangChieu,
                sapChieu: record.sapChieu,
                hot: record.hot,
                danhGia: record.danhGia,
              });
            }}
          />
          <Button
            danger
            size="small"
            icon={<Trash2 className="w-4 h-4" />}
            className="hover:bg-red-50"
            onClick={() => handleDeleteMovie(record)}
          />
        </Space>
      ),
    },
  ];

  const renderMovieForm = (onFinish: (values: any) => void, mode: "add" | "edit") => (
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
      className="max-w-2xl mx-auto"
      requiredMark="optional"
    >
      <Divider orientation="left" className="text-lg font-semibold text-gray-700">
        📽️ Thông tin phim
      </Divider>

      <Form.Item
        name="tenPhim"
        label="Tên phim"
        rules={[
          { required: true, message: "Vui lòng nhập tên phim!" },
          { min: 2, message: "Tên phim phải có ít nhất 2 ký tự!" }
        ]}
      >
        <Input
          placeholder="Nhập tên phim..."
          className="rounded-lg"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="trailer"
        label="Trailer (URL)"
        rules={[
          { required: true, message: "Vui lòng nhập URL trailer!" },
          { type: "url", message: "URL không hợp lệ!" }
        ]}
      >
        <Input
          placeholder="https://youtube.com/watch?v=..."
          className="rounded-lg"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="moTa"
        label="Mô tả"
        rules={[
          { required: true, message: "Vui lòng nhập mô tả phim!" },
          { min: 10, message: "Mô tả phải có ít nhất 10 ký tự!" }
        ]}
      >
        <Input.TextArea
          rows={4}
          placeholder="Nhập mô tả chi tiết về phim..."
          className="rounded-lg"
        />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="ngayKhoiChieu"
            label="Ngày khởi chiếu"
            rules={[{ required: true, message: "Vui lòng chọn ngày khởi chiếu!" }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              className="w-full rounded-lg"
              size="large"
              placeholder="Chọn ngày..."
             onChange={handleDateChange}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="danhGia"
            label="Đánh giá (0-10)"
            rules={[
              { required: true, message: "Vui lòng nhập đánh giá!" },
              {
                validator: async (_, value) => {
                  const numValue = Number(value);
                  if (isNaN(numValue) || numValue < 0 || numValue > 10) {
                    throw new Error("Đánh giá phải là số từ 0 đến 10!");
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input
              type="number"
              min={0}
              max={10}
              step={0.1}
              placeholder="Ví dụ: 8.5"
              className="rounded-lg"
              size="large"
            />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left" className="text-lg font-semibold text-gray-700">
        🎭 Trạng thái phim
      </Divider>

      <Alert
        message="💡 Lưu ý về trạng thái"
        description="Trạng thái sẽ được tự động cập nhật dựa trên ngày khởi chiếu. Nếu ngày khởi chiếu <= hôm nay → Đang chiếu, ngược lại → Sắp chiếu"
        type="info"
        showIcon
        className="mb-4"
      />

      <Row gutter={24}>
        <Col span={8}>
          <Form.Item name="dangChieu" valuePropName="checked">
            <Checkbox disabled className="text-green-600">
              🎬 Đang chiếu
            </Checkbox>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="sapChieu" valuePropName="checked">
            <Checkbox disabled className="text-blue-600">
              🔜 Sắp chiếu
            </Checkbox>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="hot" valuePropName="checked">
            <Checkbox className="text-red-600">
              🔥 Phim HOT
            </Checkbox>
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left" className="text-lg font-semibold text-gray-700">
        🖼️ Hình ảnh poster
      </Divider>

      <Form.Item
        name="hinhAnh"
        label="Chọn ảnh poster"
        valuePropName="fileList"
        getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
        rules={[{ required: mode === "add", message: "Vui lòng chọn hình ảnh!" }]}
      >
        <Upload
          beforeUpload={(file) => {
            // Validate file type
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
              message.error('Chỉ được tải lên file hình ảnh!');
              return Upload.LIST_IGNORE;
            }
            
            // Validate file size (max 5MB)
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
              message.error('Hình ảnh phải nhỏ hơn 5MB!');
              return Upload.LIST_IGNORE;
            }
            
            return false; // Prevent auto upload
          }}
          maxCount={1}
          listType="picture-card"
          accept="image/*"
          onPreview={handlePreview}
          className="w-full"
        >
          <div className="flex flex-col items-center justify-center p-4">
            <UploadOutlined className="text-2xl text-gray-400 mb-2" />
            <div className="text-gray-600">📤 Tải ảnh poster</div>
            <div className="text-xs text-gray-400 mt-1">PNG, JPG (max 5MB)</div>
          </div>
        </Upload>
      </Form.Item>

      <Form.Item className="text-center mt-8">
        <Space size="middle">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="px-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none"
            loading={loading}
          >
            {mode === "add" ? "💾 Lưu phim" : "✏️ Cập nhật phim"}
          </Button>
          <Button
            size="large"
            className="px-8 rounded-lg"
            onClick={() => {
              if (mode === "add") {
                setSelectedKey("list");
              } else {
                setEditModal(false);
              }
              form.resetFields();
            }}
          >
            ↩️ Quay lại
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  if (error) {
    return (
      <div className="p-6">
        <Alert
          message="Lỗi tải dữ liệu"
          description={error}
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={() => fetchMovies(1, 10)}>
              🔄 Thử lại
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {selectedKey === "list" && (
        <>
          <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-lg shadow-sm">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                🎬 Quản Lý Phim
              </h1>
              <p className="text-gray-600">Danh sách tất cả các phim trong hệ thống</p>
            </div>
            <Button
              type="primary"
              size="large"
              icon={<Plus className="w-5 h-5" />}
              onClick={() => {
                setSelectedKey("add");
                form.resetFields();
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-none rounded-lg px-6 h-12"
            >
              ➕ Thêm Phim Mới
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm">
            <Table
              columns={columns}
              dataSource={movies}
              rowKey="maPhim"
              loading={loading}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `🎭 Hiển thị ${range[0]}-${range[1]} trong ${total} phim`,
                pageSizeOptions: ["5", "10", "20", "50"],
                onChange: (page, pageSize) =>
                  handleTableChange({ current: page, pageSize }),
              }}
              onChange={handleTableChange}
              scroll={{ x: 1200 }}
              className="rounded-lg"
              size="middle"
              rowClassName="hover:bg-gray-50"
            />
          </div>
        </>
      )}

      {selectedKey === "add" && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              ➕ Thêm Phim Mới
            </h2>
            <p className="text-gray-600 mt-2">Điền thông tin chi tiết về phim mới</p>
          </div>
          {renderMovieForm(handleAddMovie, "add")}
        </div>
      )}

      {/* Modal cập nhật */}
      <AntdModal
        title={
          <div className="text-xl font-semibold text-gray-800">
            ✏️ Cập nhật thông tin phim
          </div>
        }
        open={editModal}
        onCancel={() => {
          setEditModal(false);
          setCurrentMovie(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
        className="rounded-lg"
      >
        {renderMovieForm(handleUpdateMovie, "edit")}
      </AntdModal>

      {/* Modal xem ảnh */}
      <AntdModal
        title="🖼️ Xem ảnh poster"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={600}
        className="rounded-lg"
        centered
      >
        <div className="flex justify-center p-4">
          <img
            src={previewImage}
            alt="Preview"
            style={{ maxWidth: '100%', maxHeight: '70vh' }}
            className="rounded-lg shadow-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA2NCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yOCAzNkMyOCAzMi42ODYzIDMwLjY4NjMgMzAgMzQgMzBDMzcuMzEzNyAzMCA0MCAzMi42ODYzIDQwIDM2QzQwIDM5LjMxMzcgMzcuMzEzNyA0MiAzNCA0MkMzMC42ODYzIDQyIDI4IDM5LjMxMzcgMjggMzZaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yMCA1MEwyMCA1OEw0NCA1OEw0NCA1MEwzNi41IDQyLjVMMzEuNSA0Ny41TDI2LjUgNDIuNUwyMCA1MFoiIGZpbGw9IiM5QjlCQTAiLz4KPC9zdmc+";
            }}
          />
        </div>
      </AntdModal>

      {/* Modal thêm thành công */}
      <AntdModal
        title={
          <div className="text-xl font-semibold text-green-600">
            ✅ Thao tác thành công!
          </div>
        }
        open={successModal}
        onOk={() => {
          setSuccessModal(false);
          setSelectedKey("list");
          fetchMovies(pagination.current, pagination.pageSize);
        }}
        onCancel={() => setSuccessModal(false)}
        okText="📋 Về danh sách"
        cancelText="❌ Đóng"
        className="rounded-lg"
      >
        <div className="py-4">
          <p className="text-gray-700 text-center">
            🎉 Thao tác đã được thực hiện thành công!
          </p>
        </div>
      </AntdModal>
    </div>
  );
};

export default FilmsManage;