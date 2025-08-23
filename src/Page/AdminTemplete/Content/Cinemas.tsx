
import  { useEffect, useState } from "react";
import type { HeThongRap } from "../../../interfaces/rap.interface";
import api from "../../../service/api";



export default function CinemasManagement() {
  const [theaters, setTheaters] = useState<HeThongRap[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const res = await api.get<{ content: HeThongRap[] }>("/QuanLyRap/LayThongTinHeThongRap");
        setTheaters(res.data.content);
      } catch (err) {
        setError("Không thể tải danh sách rạp chiếu!");
      } finally {
        setLoading(false);
      }
    };
    fetchTheaters();
  }, []);

  if (loading) return <p className="text-center p-4">Đang tải dữ liệu...</p>;
  if (error) return <p className="text-center text-red-500 p-4">{error}</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Quản lý Hệ Thống Rạp
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 border text-center">Mã</th>
              <th className="px-4 py-3 border text-center">Tên Rạp</th>
              <th className="px-4 py-3 border text-center">Logo</th>
            </tr>
          </thead>
          <tbody>
            {theaters.map((rap) => (
              <tr key={rap.maHeThongRap} className="hover:bg-gray-50">
                <td className="px-4 py-3 border">{rap.maHeThongRap}</td>
                <td className="px-4 py-3 border">{rap.tenHeThongRap}</td>
                <td className="px-4 py-3 border text-center"> 
                  <img
                    src={rap.logo}
                    alt={rap.tenHeThongRap}
                    className="h-12 mx-auto object-contain"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
