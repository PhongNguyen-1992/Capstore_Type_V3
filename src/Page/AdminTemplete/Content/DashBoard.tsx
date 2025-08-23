import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import api from "../../../service/api";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function DashBoard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminCount: 0,
    nowShowing: 0,
    comingSoon: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // get list user
        const userRes = await api.get(
          "/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=GP00"
        );
        const users = userRes.data.content || [];
        const adminCount = users.filter(
          (u: any) => u.maLoaiNguoiDung === "QuanTri"
        ).length;

        // get list film
        const movieRes = await api.get(
          "/QuanLyPhim/LayDanhSachPhim?maNhom=GP02"
        );
        const movies = movieRes.data.content || [];
        const nowShowing = movies.filter((m: any) => m.dangChieu).length;
        const comingSoon = movies.filter((m: any) => m.sapChieu).length;

        setStats({
          totalUsers: users.length,
          adminCount,
          nowShowing,
          comingSoon,
        });
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Dashboard:", error);
      }
    };

    fetchData();
  }, []);

  const userChartData = {
    labels: ["Admin", "Khách hàng"],
    datasets: [
      {
        data: [stats.adminCount, stats.totalUsers - stats.adminCount],
        backgroundColor: ["#ef4444", "#3b82f6"],
      },
    ],
  };

  const movieChartData = {
    labels: ["Đang Chiếu", "Sắp Chiếu"],
    datasets: [
      {
        data: [stats.nowShowing, stats.comingSoon],
        backgroundColor: ["#ef4444", "#3b82f6"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: { size: 14 },
        },
      },
      datalabels: {
        color: "#fff",
        font: { weight: "bold" as const, size: 14 },
        formatter: (value: any) => value, // Hiển thị giá trị
      },
    },
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      {/* Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow flex flex-col items-center">
          <h2 className="text-lg font-bold text-center mb-4">
            Tỉ lệ User & Admin
          </h2>
          <div className="w-64 h-64">
            <Pie data={userChartData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow flex flex-col items-center">
          <h2 className="text-lg font-bold text-center mb-4">Tỉ lệ Phim</h2>
          <div className="w-64 h-64">
            <Pie data={movieChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
