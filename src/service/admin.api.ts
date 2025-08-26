import api from "./api";
import type { BaseAPIResponse } from "@/interfaces/base.interface";
import type {   
  PaginatedMovieResponse,
  PaginatedUserResponse,
  ProfileAdmin,  
} from "@/interfaces/admin.interface";
import type { loginDataRequest, ProfileUser } from "@/interfaces/auth.interface";
import type { Movie } from "@/interfaces/movie.interface";

// Lấy danh sách admin
export const getAdminProfileAPI = async (
  maNhom: string = "GP01",
  tuKhoa: string = ""
): Promise<ProfileAdmin[]> => {
  const response = await api.get<BaseAPIResponse<ProfileAdmin[]>>(
    `/QuanLyNguoiDung/LayDanhSachNguoiDung`,
    {
      params: { MaNhom: maNhom, tuKhoa },
    }
  );
  return response.data.content;
};

// Lấy danh sách user phân trang
export const getUserProfilePaginatedAPI = async (
  maNhom: string = "GP01",
  soTrang: number = 1,
  soPhanTuTrenTrang: number = 10
): Promise<PaginatedUserResponse> => {
  const response = await api.get<BaseAPIResponse<PaginatedUserResponse>>(
    `/QuanLyNguoiDung/LayDanhSachNguoiDungPhanTrang`,
    {
      params: { MaNhom: maNhom, soTrang, soPhanTuTrenTrang },
    }
  );
  return response.data.content;
};

// Lấy danh sách phim phân trang
export const getMoviePaginatedAPI = async (
  maNhom: string = "GP01",
  soTrang: number = 1,
  soPhanTuTrenTrang: number = 10
): Promise<PaginatedMovieResponse> => {
  const response = await api.get<BaseAPIResponse<PaginatedMovieResponse>>(
    `/QuanLyPhim/LayDanhSachPhimPhanTrang`,
    {
      params: { MaNhom: maNhom, soTrang, soPhanTuTrenTrang },
    }
  );
  return response.data.content;
};

// seach full trang
export const searchUsersAPI = async (
  tuKhoa: string,
  maNhom: string = "GP00",
  soTrang: number = 1,
  soPhanTuTrenTrang: number = 10
) => {
  const response = await api.get<BaseAPIResponse<PaginatedUserResponse>>(
    "/QuanLyNguoiDung/TimKiemNguoiDungPhanTrang",
    { params: { MaNhom: maNhom, tuKhoa, soTrang, soPhanTuTrenTrang } }
  );
  return response.data.content;
};
// Đếm full danh sách user
export const getAllUsersAPI = async (maNhom: string = "GP00") => {
  const response = await api.get<BaseAPIResponse<ProfileAdmin[]>>(
    "/QuanLyNguoiDung/LayDanhSachNguoiDung",
    { params: { MaNhom: maNhom } }
  );
  return response.data.content;
};

// Thêm phim

// Cập nhật phim

export const updateMovieAPI = async (formData: FormData): Promise<Movie> => {
  const response = await api.post<BaseAPIResponse<Movie>>(
    `/QuanLyPhim/CapNhatPhimUpload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.content;
};
// Xóa Phim
export const deleteMovieAPI = async (maPhim: number | string): Promise<any> => {
  try {
    const user = localStorage.getItem("user");
    const token = user ? JSON.parse(user).accessToken : "";

    const response = await api.delete<BaseAPIResponse<any>>(
      `/QuanLyPhim/XP`,
      {
        params: { MaPhim: maPhim.toString() }, // Ép string cho chắc
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.content;
  } catch (error: any) {
    console.error("❌ deleteMovieAPI error:", error.response?.data || error);
    throw error;
  }
};
// loginAPI.ts
export const loginAPI = async (data: loginDataRequest) => {
  const res = await api.post<BaseAPIResponse<loginDataRequest>>(
    "/QuanLyNguoiDung/DangNhap",
    data
  );

  if (res.data.content) {
    // luôn lưu 1 key duy nhất
    localStorage.setItem("user", JSON.stringify(res.data.content)); 
   }

  return res.data.content;
};

// Lấy token
const getAuthToken = (): string | null => {
  try {
    // Thử lấy từ user object trước (như axios interceptor)
    const userLocal = localStorage.getItem("user");
    if (userLocal) {
      const userParsed = JSON.parse(userLocal);
      if (userParsed?.accessToken) {
        return userParsed.accessToken;
      }
    }
    
    // Fallback: thử lấy từ accessToken trực tiếp
    const directToken = localStorage.getItem('accessToken');
    if (directToken) {
      return directToken;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    // Nếu có lỗi parse, clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    return null;
  }
};

// API cập nhật người dùng
export const updateUserAPI = async (userData: ProfileUser): Promise<any> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }

    const response = await fetch(
      'https://movienew.cybersoft.edu.vn/api/QuanLyNguoiDung/CapNhatThongTinNguoiDung',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'TokenCybersoft': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCBTw6FuZyAwOSIsIkhldEhhblN0cmluZyI6IjMwLzA5LzIwMzEiLCJIZXRIYW5UaW1lIjoiMTk0ODU5MjAwMDAwMCIsIm5iZiI6MTY2MjMzNjAwMCwiZXhwIjoxOTQ4NTkyMDAwfQ.apo8xIj5IkJyWpuQhLrHVzwjvKgF7YPGtDC7WzRkFTM'
        },
        body: JSON.stringify(userData)
      }
    );

    // Xử lý lỗi 401 - token hết hạn
    if (response.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.content || errorData?.message || 'Cập nhật người dùng thất bại';
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('Update user API error:', error);
    
    // Nếu là lỗi network hoặc server không phản hồi
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Lỗi kết nối mạng. Vui lòng kiểm tra kết nối và thử lại.');
    }
    
    throw new Error(error.message || 'Có lỗi xảy ra khi cập nhật người dùng');
  }
};

// API xóa người dùng
export const deleteUserAPI = async (taiKhoan: string): Promise<any> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }

    const response = await fetch(
      `https://movienew.cybersoft.edu.vn/api/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${encodeURIComponent(taiKhoan)}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'TokenCybersoft': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCBTw6FuZyAwOSIsIkhldEhhblN0cmluZyI6IjMwLzA5LzIwMzEiLCJIZXRIYW5UaW1lIjoiMTk0ODU5MjAwMDAwMCIsIm5iZiI6MTY2MjMzNjAwMCwiZXhwIjoxOTQ4NTkyMDAwfQ.apo8xIj5IkJyWpuQhLrHVzwjvKgF7YPGtDC7WzRkFTM'
        }
      }
    );

    // Xử lý lỗi 401 - token hết hạn
    if (response.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }

    // Xử lý lỗi 403 - không có quyền
    if (response.status === 403) {
      throw new Error('Bạn không có quyền xóa người dùng này.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.content || errorData?.message || 'Xóa người dùng thất bại';
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('Delete user API error:', error);
    
    // Nếu là lỗi network hoặc server không phản hồi
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Lỗi kết nối mạng. Vui lòng kiểm tra kết nối và thử lại.');
    }
    
    throw new Error(error.message || 'Có lỗi xảy ra khi xóa người dùng');
  }
};

// // API cập nhật thông tin người dùng
// export const updateUserAPI = async (userData: ProfileUser): Promise<any> => {
//   try {
//     const token = localStorage.getItem('accessToken');
//     if (!token) {
//       throw new Error('Không tìm thấy token đăng nhập');
//     }

//     const response = await fetch(
//       'https://movienew.cybersoft.edu.vn/api/QuanLyNguoiDung/CapNhatThongTinNguoiDung',
//       {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//           'TokenCybersoft': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCBTw6FuZyAwOSIsIkhldEhhblN0cmluZyI6IjMwLzA5LzIwMzEiLCJIZXRIYW5UaW1lIjoiMTk0ODU5MjAwMDAwMCIsIm5iZiI6MTY2MjMzNjAwMCwiZXhwIjoxOTQ4NTkyMDAwfQ.apo8xIj5IkJyWpuQhLrHVzwjvKgF7YPGtDC7WzRkFTM'
//         },
//         body: JSON.stringify(userData)
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.content || 'Cập nhật người dùng thất bại');
//     }

//     const result = await response.json();
//     return result;
//   } catch (error: any) {
//     console.error('Update user API error:', error);
//     throw new Error(error.message || 'Có lỗi xảy ra khi cập nhật người dùng');
//   }
// };

// // API xóa người dùng
// export const deleteUserAPI = async (taiKhoan: string): Promise<any> => {
//   try {
//     const token = localStorage.getItem('accessToken');
//     if (!token) {
//       throw new Error('Không tìm thấy token đăng nhập');
//     }

//     const response = await fetch(
//       `https://movienew.cybersoft.edu.vn/api/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${encodeURIComponent(taiKhoan)}`,
//       {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'TokenCybersoft': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCBTw6FuZyAwOSIsIkhldEhhblN0cmluZyI6IjMwLzA5LzIwMzEiLCJIZXRIYW5UaW1lIjoiMTk0ODU5MjAwMDAwMCIsIm5iZiI6MTY2MjMzNjAwMCwiZXhwIjoxOTQ4NTkyMDAwfQ.apo8xIj5IkJyWpuQhLrHVzwjvKgF7YPGtDC7WzRkFTM'
//         }
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.content || 'Xóa người dùng thất bại');
//     }

//     const result = await response.json();
//     return result;
//   } catch (error: any) {
//     console.error('Delete user API error:', error);
//     throw new Error(error.message || 'Có lỗi xảy ra khi xóa người dùng');
//   }
// };
