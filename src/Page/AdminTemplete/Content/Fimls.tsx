import { useEffect, useState } from "react";
import { Table, Button, Space, Alert} from "antd";
import { Edit, Trash2, Plus } from "lucide-react";
import { getMoviePaginatedAPI } from "@/service/admin.api";
import type { Movie } from "@/interfaces/movie.interface";
import type { ColumnsType } from "antd/es/table";

interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

const SearchUserCard: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchMovies = async (page: number = 1, pageSize: number = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getMoviePaginatedAPI("GP01", page, pageSize);
      console.log("API Response:", result);
      
      if (result && result.items && Array.isArray(result.items)) {
        setMovies(result.items);
        setPagination({
          current: result.currentPage || page,
          pageSize: pageSize,
          total: result.totalCount || 0,
        });
        console.log("Movies data:", result.items);
        console.log("Pagination info:", {
          currentPage: result.currentPage,
          totalCount: result.totalCount,
          totalPages: result.totalPages
        });
      } else {
        console.log("No items found in response");
        setMovies([]);
        setPagination(prev => ({ ...prev, total: 0 }));
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

  const handleEdit = (movie: Movie) => {
    console.log("Edit movie:", movie);
    // Implement edit logic here
  };

  const handleDelete = async (movie: Movie) => {
    console.log("Delete movie:", movie);
    // Implement delete logic here
    // After successful delete, refresh current page
    // await deleteMovieAPI(movie.maPhim);
    // fetchMovies(pagination.current, pagination.pageSize);
  };

  const handleAddMovie = () => {
    console.log("Add new movie");
    // Implement add movie logic here
    // After successful add, refresh first page
    // fetchMovies(1, pagination.pageSize);
  };

  const columns: ColumnsType<Movie> = [
    {
      title: "Mã Phim",
      dataIndex: "maPhim",
      key: "maPhim",
      width: 100,
      sorter: false,
    },
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
          style={{
            width: "64px",
            height: "80px",
            objectFit: "cover",
            borderRadius: "6px"
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
          }}
        />
      ),
    },
    {
      title: "Mô Tả",
      dataIndex: "moTa",
      key: "moTa",
      width: 250,
      ellipsis: true,
      render: (moTa: string) => (
        <div style={{ maxWidth: "200px" }} title={moTa}>
          {moTa}
        </div>
      ),
    },
    {
      title: "Đánh Giá",
      dataIndex: "danhGia",
      key: "danhGia",
      width: 100,
      render: (danhGia: number) => (
        <span style={{ fontWeight: "600", color: "#d97706" }}>
          {danhGia}/10
        </span>
      ),
    },
    {
      title: "Trạng Thái",
      key: "status",
      width: 120,
      render: (_, record) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div>
            <span 
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "2px 8px",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: "500",
                backgroundColor: record.dangChieu ? "#dcfce7" : "#dbeafe",
                color: record.dangChieu ? "#166534" : "#1e40af"
              }}
            >
              {record.dangChieu ? "Đang Chiếu" : "Sắp Chiếu"}
            </span>
          </div>
          {record.hot && (
            <div>
              <span 
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "2px 8px",
                  borderRadius: "9999px",
                  fontSize: "12px",
                  fontWeight: "500",
                  backgroundColor: "#fee2e2",
                  color: "#991b1b"
                }}
              >
                HOT
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Ngày Khởi Chiếu",
      dataIndex: "ngayKhoiChieu",
      key: "ngayKhoiChieu",
      width: 130,
      render: (date: Date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: "Thao Tác",
      key: "actions",
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<Edit style={{ width: "16px", height: "16px" }} />}
            onClick={() => handleEdit(record)}
            style={{ 
              backgroundColor: "#3b82f6", 
              borderColor: "#3b82f6" 
            }}
          />
          <Button
            danger
            size="small"
            icon={<Trash2 style={{ width: "16px", height: "16px" }} />}
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert message={error} type="error" />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <div 
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px"
        }}
      >
        <h1 
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#1f2937",
            margin: 0
          }}
        >
          Danh Sách Phim
        </h1>
        <Button
          type="primary"
          size="large"
          icon={<Plus style={{ width: "20px", height: "20px" }} />}
          onClick={handleAddMovie}
          style={{
            backgroundColor: "#10b981",
            borderColor: "#10b981",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          Thêm Phim
        </Button>
      </div>

      {/* Table with Server Pagination */}
      <div 
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
        }}
      >
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
            pageSizeOptions: ['5', '10', '20', '50'],
            onChange: (page, pageSize) => {
              handleTableChange({ current: page, pageSize });
            },
            onShowSizeChange: ( size) => {
              handleTableChange({ current: 1, pageSize: size });
            },
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
          style={{ borderRadius: "8px" }}
          size="middle"
        />
      </div>     
    </div>
  );
};

export default SearchUserCard;