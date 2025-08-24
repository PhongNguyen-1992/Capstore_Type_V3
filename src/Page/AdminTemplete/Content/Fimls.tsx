import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Alert,
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
} from "antd";
import { Edit, Trash2, Plus } from "lucide-react";
import { UploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import {
  addMovieAPI,
  updateMovieAPI,
  deleteMovieAPI,
  getMoviePaginatedAPI,
} from "@/service/admin.api";
import type { Movie } from "@/interfaces/movie.interface";
import type { ColumnsType } from "antd/es/table";
import type { MovieFormData } from "@/interfaces/admin.interface";
import dayjs from "dayjs";

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

  // ADD movie
  const handleAddMovie = async (values: any) => {
    try {
      const formData = buildFormData(values);
      await addMovieAPI(formData as unknown as MovieFormData);
      setSuccessModal(true);
      form.resetFields();
    } catch (err) {
      console.error(err);
      message.error("Thêm phim thất bại");
    }
  };

  // UPDATE movie
  const handleUpdateMovie = async (values: any) => {
  if (!currentMovie) return;
  try {
    const movieData: MovieFormData = {
      maPhim: currentMovie.maPhim,
      tenPhim: values.tenPhim,
      biDanh: values.tenPhim,
      trailer: values.trailer,
      moTa: values.moTa,
      ngayKhoiChieu: values.ngayKhoiChieu.format("DD/MM/YYYY"),
      danhGia: Number(values.danhGia),
      dangChieu: values.dangChieu || false,
      sapChieu: values.sapChieu || false,
      hot: values.hot || false,
      hinhAnh: values.hinhAnh?.[0]?.originFileObj || null,
    };

    await updateMovieAPI(movieData);
    message.success("Cập nhật phim thành công!");
    setEditModal(false);
    fetchMovies(pagination.current, pagination.pageSize);
  } catch (err) {
    console.error(err);
    message.error("Cập nhật phim thất bại!");
  }
};
  // DELETE movie
  const handleDelete = (movie: Movie) => {
    console.log("🚀 ~ handleDelete ~ movie:", movie)
    AntdModal.confirm({
      title: "Xác nhận xóa",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa phim "${movie.tenPhim}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      async onOk() {
        try {
          await deleteMovieAPI(movie.maPhim);
          message.success("Xóa phim thành công!");
          fetchMovies(pagination.current, pagination.pageSize);
        } catch (err) {
          console.error(err);
          message.error("Xóa phim thất bại!");
        }
      },
    });
  };

  // Helper build form data
  const buildFormData = (values: any) => {
    const fd = new FormData();
    fd.append("tenPhim", values.tenPhim);
    fd.append("trailer", values.trailer);
    fd.append("moTa", values.moTa);
    fd.append("maNhom", "GP01");
    fd.append("ngayKhoiChieu", values.ngayKhoiChieu.format("DD/MM/YYYY"));
    fd.append("sapChieu", values.sapChieu ? "true" : "false");
    fd.append("dangChieu", values.dangChieu ? "true" : "false");
    fd.append("hot", values.hot ? "true" : "false");
    fd.append("danhGia", values.danhGia.toString());
    if (values.hinhAnh && values.hinhAnh[0]?.originFileObj) {
      fd.append("File", values.hinhAnh[0].originFileObj);
    }
    return fd;
  };

  const columns: ColumnsType<Movie> = [
    { title: "Mã Phim", dataIndex: "maPhim", key: "maPhim", width: 100 },
    {
      title: "Tên Phim",
      dataIndex: "tenPhim",
      key: "tenPhim",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Hình Ảnh",
      dataIndex: "hinhAnh",
      key: "hinhAnh",
      width: 120,
      render: (hinhAnh: string) => (
        <img
          src={hinhAnh}
          alt="poster"
          style={{ width: 64, height: 80, objectFit: "cover", borderRadius: 6 }}
          onError={(e) =>
            ((e.target as HTMLImageElement).src = "/placeholder-image.jpg")
          }
        />
      ),
    },
    {
      title: "Mô Tả",
      dataIndex: "moTa",
      key: "moTa",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Đánh Giá",
      dataIndex: "danhGia",
      key: "danhGia",
      width: 100,
      render: (danhGia: number) => (
        <span style={{ fontWeight: 600, color: "#d97706" }}>{danhGia}/10</span>
      ),
    },
    {
      title: "Ngày Khởi Chiếu",
      dataIndex: "ngayKhoiChieu",
      key: "ngayKhoiChieu",
      width: 130,
      render: (date: Date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao Tác",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<Edit style={{ width: 16, height: 16 }} />}
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
            icon={<Trash2 style={{ width: 16, height: 16 }} />}
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  const renderMovieForm = (onFinish: (values: any) => void, mode :"add" | "edit") => (
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
      style={{ maxWidth: 700, margin: "0 auto" }}
    >
      <Divider orientation="left">Thông tin phim</Divider>
      <Form.Item name="tenPhim" label="Tên phim" rules={[{ required: true }]}>
        <Input placeholder="Nhập tên phim" />
      </Form.Item>
      <Form.Item name="trailer" label="Trailer" rules={[{ required: true }]}>
        <Input placeholder="Nhập trailer" />
      </Form.Item>
      <Form.Item name="moTa" label="Mô tả" rules={[{ required: true }]}>
        <Input.TextArea rows={4} placeholder="Nhập mô tả" />
      </Form.Item>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="ngayKhoiChieu"
            label="Ngày khởi chiếu"
            rules={[{ required: true }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="danhGia"
            label="Đánh giá"
            rules={[{ required: true }]}
          >
            <Input type="number" min={0} max={10} placeholder="0 - 10" />
          </Form.Item>
        </Col>
      </Row>
      <Divider orientation="left">Trạng thái</Divider>
      <Row gutter={24}>
        <Col>
          <Form.Item name="dangChieu" valuePropName="checked">
            <Checkbox>Đang chiếu</Checkbox>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="sapChieu" valuePropName="checked">
            <Checkbox>Sắp chiếu</Checkbox>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="hot" valuePropName="checked">
            <Checkbox>Hot</Checkbox>
          </Form.Item>
        </Col>
      </Row>
      <Divider orientation="left">Hình ảnh</Divider>
      <Form.Item
        name="hinhAnh"
        label="Chọn ảnh"
        valuePropName="fileList"
        getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
      >
        <Upload beforeUpload={() => false} maxCount={1} listType="picture">
          <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
        </Upload>
      </Form.Item>
       <Form.Item style={{ textAlign: "center", marginTop: 20 }}>
    <Button type="primary" htmlType="submit">
      {mode === "add" ? "Lưu phim" : "Cập nhật phim"}
    </Button>
    <Button
      style={{ marginLeft: 10 }}
      onClick={() => {
        if (mode === "add") {
          setSelectedKey("list");
        } else {
          setEditModal(false);
        }
      }}
    >
      Quay lại
    </Button>
  </Form.Item>
    </Form>
  );

  return (
    <div style={{ padding: 24 }}>
      {selectedKey === "list" && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <h1 style={{ fontSize: 24, fontWeight: "bold", margin: 0 }}>
              Danh Sách Phim
            </h1>
            <Button
              type="primary"
              size="large"
              icon={<Plus style={{ width: 20, height: 20 }} />}
              onClick={() => setSelectedKey("add")}
              style={{ backgroundColor: "#10b981", borderColor: "#10b981" }}
            >
              Thêm Phim
            </Button>
          </div>
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
                `${range[0]}-${range[1]} của ${total} phim`,
              pageSizeOptions: ["5", "10", "20", "50"],
              onChange: (page, pageSize) =>
                handleTableChange({ current: page, pageSize }),
            }}
            onChange={handleTableChange}
            scroll={{ x: 1200 }}
            style={{ borderRadius: 8 }}
            size="middle"
          />
        </>
      )}

      {selectedKey === "add" && renderMovieForm(handleAddMovie, "add")}

      {/* Modal cập nhật */}
      <AntdModal
        title="Cập nhật phim"
        open={editModal}
        onCancel={() => setEditModal(false)}
        footer={null}
        width={720}
      >
        {renderMovieForm(handleUpdateMovie,"edit")}
      </AntdModal>

      {/* Modal thêm thành công */}
      <AntdModal
        title="Thêm phim thành công"
        open={successModal}
        onOk={() => {
          setSuccessModal(false);
          setSelectedKey("list");
          fetchMovies(1, pagination.pageSize);
        }}
        onCancel={() => setSuccessModal(false)}
        okText="Về danh sách"
        cancelText="Đóng"
      >
        <p>Phim đã được thêm vào hệ thống.</p>
      </AntdModal>
    </div>
  );
};

export default FilmsManage;
