import { useEffect, useState, type FC } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartData } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Users, Shield, Play, Clock, TrendingUp, BarChart3, type LucideIcon } from "lucide-react";
import { getListMovie } from "@/service/movie.api";
import { getAllUsersAPI } from "@/service/admin.api";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);
interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  
  subtitle?: string;
  color?: string;
  bgColor?: string;
}
interface ChartCardProps {
  title: string;
 data: ChartData<"pie"> 
  icon: LucideIcon;      
  color?: string;        
}



export default function DashBoard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminCount: 0,
    nowShowing: 0,
    comingSoon: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch users and movies in parallel for better performance
        const [users, movies] = await Promise.all([
          getAllUsersAPI("GP00"),
          getListMovie()
        ]);

        // Count admin users
        const adminCount = users.filter(
          (user) => user.maLoaiNguoiDung === "QuanTri"
        ).length;

        // Count movies by status
        const nowShowing = movies.filter((movie) => movie.dangChieu).length;
        const comingSoon = movies.filter((movie) => movie.sapChieu).length;

        setStats({
          totalUsers: users.length,
          adminCount,
          nowShowing,
          comingSoon,
        });
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Dashboard:", error);
        // You might want to show a toast notification or error state here
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const userChartData = {
    labels: ["Admin", "Khách hàng"],
    datasets: [
      {
        data: [stats.adminCount, stats.totalUsers - stats.adminCount],
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(59, 130, 246, 0.8)"
        ],
        borderColor: [
          "rgba(239, 68, 68, 1)",
          "rgba(59, 130, 246, 1)"
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          "rgba(239, 68, 68, 0.9)",
          "rgba(59, 130, 246, 0.9)"
        ],
      },
    ],
  };

  const movieChartData = {
    labels: ["Đang Chiếu", "Sắp Chiếu"],
    datasets: [
      {
        data: [stats.nowShowing, stats.comingSoon],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(168, 85, 247, 0.8)"
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(168, 85, 247, 1)"
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          "rgba(34, 197, 94, 0.9)",
          "rgba(168, 85, 247, 0.9)"
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: { size: 14, weight: 500 },
          color: "#374151",
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      datalabels: {
        color: "#ffffff",
        font: { weight: "bold" as const, size: 16 },
        formatter: (value:any) => value > 0 ? value : '',
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        cornerRadius: 8,
        displayColors: false,
      }
    },
    animation: {
      animateRotate: true,
      duration: 1000,
    }
  };
  

  const StatCard:FC<StatCardProps> = ({ icon: Icon, title, value, subtitle, color, bgColor }) => (
    <div className={`${bgColor} p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color} mb-1`}>
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            ) : (
              value
            )}
          </p>
          <p className="text-gray-500 text-xs">{subtitle}</p>
        </div>
        <div className={`p-4 rounded-full ${color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </div>
    </div>
  );

  const ChartCard:FC<ChartCardProps> = ({ title, data, icon: Icon, color }) => (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-500"></div>
        </div>
      ) : (
        <div className="h-80">
          <Pie data={data} options={chartOptions} />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Tổng quan hệ thống quản lý</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          title="Tổng người dùng"
          value={stats.totalUsers}
          subtitle="Tất cả users"
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={Shield}
          title="Quản trị viên"
          value={stats.adminCount}
          subtitle="Admin users"
          color="text-red-600"
          bgColor="bg-red-50"
        />
        <StatCard
          icon={Play}
          title="Đang chiếu"
          value={stats.nowShowing}
          subtitle="Phim hiện tại"
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <StatCard
          icon={Clock}
          title="Sắp chiếu"
          value={stats.comingSoon}
          subtitle="Phim sắp ra"
          color="text-purple-600"
          bgColor="bg-purple-50"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <ChartCard
          title="Phân bố người dùng"
          data={userChartData}
          icon={Users}
          color="text-blue-600"
        />
        <ChartCard
          title="Tình trạng phim"
          data={movieChartData}
          icon={TrendingUp}
          color="text-green-600"
        />
      </div>

      {/* Additional Info */}
      <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Thống kê tổng quan</h3>
            <p className="opacity-90">
              Hệ thống đang hoạt động tốt với {stats.totalUsers} người dùng và {stats.nowShowing + stats.comingSoon} bộ phim
            </p>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{((stats.adminCount / stats.totalUsers) * 100 || 0).toFixed(1)}%</div>
                <div className="text-sm opacity-75">Tỷ lệ admin</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{((stats.nowShowing / (stats.nowShowing + stats.comingSoon)) * 100 || 0).toFixed(1)}%</div>
                <div className="text-sm opacity-75">Phim đang chiếu</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}