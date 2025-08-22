import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Button,
  Select,
  Image,
  Spin,
  Alert,
  Typography,
  Row,
  Col,
  Space,
  Divider,
  notification,
  Badge,
} from "antd";
import {
  EnvironmentOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  ClockCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import type { Movie } from "@/interfaces/movie.interface";
import type { CumRap, Rap, SuatChieu } from "@/interfaces/rap.interface";
import { getListMovie } from "@/service/movie.api";
import {
  diaChiRap,
  getListCumRap,
  getNgayChieuVaGiaVe,
} from "@/service/rap.api";
import MovieBookingHeader from "../Componnent/hearderBooking";
import RenderSeats from "./Seat/Seat";
import TotalPrice from "./Pay/TotalPrice";
import HeadderInfo from "./Bookking/Info";
import Footer from "../Componnent/Footer";

// Interface cho suất chiếu mới


const { Title, Text } = Typography;
const { Option } = Select;

export default function TicketBooking() {
  const { movieID } = useParams<{ movieID: string }>();
  const [movieData, setMovieData] = useState<Movie | null>(null);
  const [cinemaList, setCinemaList] = useState<Rap[]>([]);
  const [cinemaAddresses, setCinemaAddresses] = useState<CumRap[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedCinema, setSelectedCinema] = useState<string>("");
  const [selectedShowtime, setSelectedShowtime] = useState<string>("");
  const [showtimes, setShowtimes] = useState<SuatChieu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingShowtimes, setLoadingShowtimes] = useState<boolean>(false);
  const [ticketPrice, setTicketPrice] = useState<number>(75000); // lấy từ API showtime

  // Lấy dữ liệu phim & danh sách rạp
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movies = await getListMovie();
        const foundMovie = movies.find((m) => String(m.maPhim) === movieID);
        setMovieData(foundMovie || null);
      } catch (error) {
        console.error(error);
        notification.error({
          message: "Lỗi",
          description: "Không thể tải thông tin phim",
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchRap = async () => {
      try {
        const rap = await getListCumRap();
        setCinemaList(rap || []);
      } catch (error) {
        console.error(error);
        notification.error({
          message: "Lỗi",
          description: "Không thể tải danh sách rạp",
        });
      }
    };

    fetchMovie();
    fetchRap();
  }, [movieID]);

  // Hàm lấy suất chiếu và giá vé

  const handleFetchShowtimes = async (maHeThongRap: string) => {
    setLoadingShowtimes(true);
    try {
      const suatChieuData = await getNgayChieuVaGiaVe(maHeThongRap);

      // Lọc và format dữ liệu suất chiếu
      const uniqueShowtimes = suatChieuData.filter(
        (item, index, self) =>
          index ===
          self.findIndex((t) => t.ngayChieuGioChieu === item.ngayChieuGioChieu)
      );

      setShowtimes(uniqueShowtimes);

      // Cập nhật giá vé mặc định (lấy giá vé đầu tiên)
      if (uniqueShowtimes.length > 0) {
        setTicketPrice(uniqueShowtimes[0].giaVe);
      }
    } catch (error) {
      console.error("Lỗi khi lấy suất chiếu:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách suất chiếu",
      });
      setShowtimes([]);
    } finally {
      setLoadingShowtimes(false);
    }
  };

  // click chọn rạp sẽ show ra địa chỉ và suất chiếu
  const handleSelectCinema = async (cinema: Rap) => {
    setSelectedCinema(cinema.tenHeThongRap);
    setSelectedAddress("");
    setSelectedShowtime("");
    setShowtimes([]);

    try {
      // Lấy địa chỉ rạp
      const data = await diaChiRap(cinema.maHeThongRap);
      const addressesArray = Array.isArray(data) ? data : [data];
      setCinemaAddresses(addressesArray);

      // Lấy suất chiếu và giá vé
      await handleFetchShowtimes(cinema.maHeThongRap);
    } catch (error) {
      console.error("Lỗi khi lấy địa chỉ rạp:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách địa chỉ rạp",
      });
    }
  };

  // Xử lý khi chọn địa chỉ
  const handleSelectAddress = (selectedAddressValue: string) => {
    setSelectedAddress(selectedAddressValue);
    setSelectedShowtime(""); // Reset showtime khi đổi địa chỉ
  };

  // Xử lý khi chọn suất chiếu
  const handleSelectShowtime = (showtime: SuatChieu) => {
    setSelectedShowtime(showtime.ngayChieuGioChieu);
    setTicketPrice(showtime.giaVe); // Cập nhật giá vé theo suất chiếu đã chọn
  };

  // Format thời gian hiển thị
  const formatShowtime = (dateTime: string): string => {
    const date = new Date(dateTime);
    const time = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const day = date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
    return `${time} - ${day}`;
  };

  // Đặt vé
  const handleBookTicket = () => {
    if (
      !selectedCinema ||
      !selectedAddress ||
      !selectedShowtime ||
      selectedSeats.length === 0
    ) {
      notification.warning({
        message: "Thông tin chưa đầy đủ",
        description: "Vui lòng chọn đủ rạp, địa chỉ, suất chiếu và ghế ngồi",
      });
      return;
    }

    const selectedShowtimeData = showtimes.find(
      (s) => s.ngayChieuGioChieu === selectedShowtime
    );
    const formattedShowtime = selectedShowtimeData
      ? formatShowtime(selectedShowtimeData.ngayChieuGioChieu)
      : selectedShowtime;

    notification.success({
      message: "Đặt vé thành công! 🎉",
      description: `Đã đặt ${selectedSeats.length} ghế cho suất ${formattedShowtime} tại ${selectedCinema}`,
      duration: 4,
    });

    // Reset form after successful booking
    setSelectedSeats([]);
    setSelectedShowtime("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center space-y-4">
          <Spin
            size="large"
            indicator={
              <LoadingOutlined
                style={{ fontSize: 48, color: "#3B82F6" }}
                spin
              />
            }
          />
          <Text className="text-xl font-medium text-gray-700">
            Đang tải thông tin phim...
          </Text>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!movieData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Alert
          message="Không tìm thấy phim"
          description="Phim bạn đang tìm kiếm không tồn tại hoặc đã bị xóa"
          type="error"
          showIcon
          className="max-w-md !rounded-2xl !shadow-xl"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-8">
      <div className="max-w-7xl mx-auto px- space-y-16">
        <div className="mb-6">
          <MovieBookingHeader />
        </div>
        <Row gutter={[32, 32]}>
          {/* Chọn ghế */}
          <Col xs={24} lg={16}>
            <Card
              className="!shadow-2xl !border-0 !rounded-3xl overflow-hidden"
              bodyStyle={{ padding: 0 }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircleOutlined className="mr-3 text-2xl" />
                    <Title level={3} className="!text-white !mb-0">
                      Chọn ghế ngồi
                    </Title>
                  </div>
                  <Badge
                    count={selectedSeats.length}
                    className="bg-white text-blue-600"
                  />
                </div>
              </div>

              <div className="p-8">
                {/* Screen */}
                <div className="relative mb-12">
                  <div className="h-4 bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full mx-auto w-4/5 mb-3 shadow-lg"></div>
                  <div className="h-2 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full mx-auto w-3/5 mb-4"></div>
                  <Text className="block text-center text-gray-600 font-semibold text-lg">
                    MÀN HÌNH
                  </Text>
                </div>

                {/* Seats */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-3xl shadow-inner">
                  <RenderSeats />
                </div>
              </div>
            </Card>
          </Col>

          {/* Thông tin đặt vé */}
          <Col xs={24} lg={8}>
            <Card
              className="!shadow-2xl !border-0 !rounded-3xl sticky  overflow-hidden"
              bodyStyle={{ padding: 0 }}
            >
              <div className="p-6">
                <HeadderInfo />

                <Divider className="!border-gray-200" />

                {/* Cinema Selection */}
                <div className="mb-8">
                  <Text
                    strong
                    className="flex items-center mb-4 text-gray-800 text-lg"
                  >
                    <HomeOutlined className="mr-2 text-orange-500" />
                    Chọn rạp chiếu
                  </Text>
                  <Row gutter={[12, 12]}>
                    {cinemaList.map((cinema) => (
                      <Col xs={12} sm={8} key={cinema.maHeThongRap}>
                        <Card
                          hoverable
                          size="small"
                          onClick={() => handleSelectCinema(cinema)}
                          className={`!cursor-pointer !rounded-xl !transition-all !duration-300 !transform hover:!scale-105 hover:!shadow-lg ${
                            selectedCinema === cinema.tenHeThongRap
                              ? "!border-2 !border-blue-500 !shadow-xl !bg-blue-50"
                              : "!border-gray-200"
                          }`}
                        >
                          <Space
                            direction="vertical"
                            align="center"
                            className="w-full"
                          >
                            <Image
                              src={cinema.logo}
                              alt={cinema.tenHeThongRap}
                              width={50}
                              height={50}
                              preview={false}
                              className="!rounded-lg object-cover"
                            />
                            <Text
                              className={`text-center font-medium ${
                                selectedCinema === cinema.tenHeThongRap
                                  ? "text-blue-600"
                                  : "text-gray-700"
                              }`}
                              style={{
                                textTransform:
                                  cinema.tenHeThongRap === "cgv"
                                    ? "uppercase"
                                    : "none",
                              }}
                            >
                              {cinema.tenHeThongRap}
                            </Text>
                          </Space>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>

                {/* Address Selection*/}
                <div className="mb-8">
                  <Text
                    strong
                    className="flex items-center mb-4 text-gray-800 text-lg"
                  >
                    <EnvironmentOutlined className="mr-2 text-red-500" />
                    Địa chỉ rạp
                  </Text>
                  <Select
                    value={selectedAddress || undefined}
                    style={{ width: "100%" }}
                    size="large"
                    placeholder={
                      selectedCinema
                        ? "Chọn địa chỉ rạp"
                        : "Vui lòng chọn rạp trước"
                    }
                    onChange={handleSelectAddress}
                    disabled={!selectedCinema}
                    className="!rounded-xl"
                    dropdownClassName="!rounded-xl"
                  >
                    {cinemaAddresses.map((address) => (
                      <Option key={address.maCumRap} value={address.diaChi}>
                        <div className="py-1">
                          <Text className="text-gray-800">
                            {address.diaChi}
                          </Text>
                        </div>
                      </Option>
                    ))}
                  </Select>
                  {!selectedCinema && (
                    <Text className="text-xs text-gray-500 mt-2 block">
                      * Chọn rạp để xem danh sách địa chỉ
                    </Text>
                  )}
                </div>

                {/* Showtime */}
                <div className="mb-8">
                  <Text
                    strong
                    className="flex items-center mb-4 text-gray-800 text-lg"
                  >
                    <ClockCircleOutlined className="mr-2 text-green-500" />
                    Suất chiếu
                  </Text>

                  <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                    {loadingShowtimes ? (
                      <div className="text-center py-4">
                        <Spin size="small" />
                        <Text type="secondary" className="ml-2">
                          Đang tải suất chiếu...
                        </Text>
                      </div>
                    ) : showtimes.length > 0 ? (
                      showtimes.map((showtime, index) => (
                        <Button
                          key={`${showtime.ngayChieuGioChieu}-${index}`}
                          type={
                            selectedShowtime === showtime.ngayChieuGioChieu
                              ? "primary"
                              : "default"
                          }
                          size="large"
                          className={`!h-16 !rounded-xl !font-semibold !transition-all !duration-300 !transform !flex !flex-col !justify-center !items-start !px-4 ${
                            selectedShowtime === showtime.ngayChieuGioChieu
                              ? "!bg-gradient-to-r !from-blue-500 !to-purple-600 !shadow-xl !scale-105 hover:!scale-110"
                              : "!bg-white !border-gray-300 hover:!border-blue-400 hover:!shadow-md hover:!scale-105"
                          }`}
                          onClick={() => handleSelectShowtime(showtime)}
                        >
                          <div
                            className={`text-sm font-bold ${
                              selectedShowtime === showtime.ngayChieuGioChieu
                                ? "text-white"
                                : "text-gray-800"
                            }`}
                          >
                            {formatShowtime(showtime.ngayChieuGioChieu)}
                          </div>
                          <div
                            className={`text-xs ${
                              selectedShowtime === showtime.ngayChieuGioChieu
                                ? "text-white/90"
                                : "text-gray-500"
                            }`}
                          >
                            Giá vé: {showtime.giaVe.toLocaleString("vi-VN")} VNĐ
                          </div>
                        </Button>
                      ))
                    ) : selectedCinema ? (
                      <div className="text-center py-4">
                        <Text type="secondary">
                          Không có suất chiếu cho phim này
                        </Text>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Text type="secondary">Chọn rạp để xem suất chiếu</Text>
                      </div>
                    )}
                  </div>
                </div>

                <Divider className="!border-gray-200" />

                {/* Total Price */}
                {/* <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                  <div className="flex justify-between items-center mb-2">
                    <Text strong className="text-gray-800 text-lg">
                      Tổng tiền:
                    </Text>
                    <Text
                      strong
                      className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      {(selectedSeats.length * ticketPrice).toLocaleString(
                        "vi-VN"
                      )}{" "}
                      VNĐ
                    </Text>
                  </div>
                  <Text className="text-sm text-gray-600">
                    {selectedSeats.length} ghế ×{" "}
                    {ticketPrice.toLocaleString("vi-VN")} VNĐ
                  </Text>
                  {selectedShowtime && (
                    <Text className="text-xs text-blue-600 mt-1 block">
                      * Giá vé đã bao gồm suất chiếu đã chọn
                    </Text>
                  )}
                </div> */}
                <div>
                  {/* Component tổng tiền */}
                  <TotalPrice
                    selectedSeats={selectedSeats}
                    ticketPrice={ticketPrice}
                    selectedShowtime={selectedShowtime}
                  />
                </div>

                {/* Booking Button */}
                <Button
                  type="primary"
                  size="large"
                  block
                  className="!h-14 !rounded-2xl !font-bold !text-lg !bg-gradient-to-r !from-purple-600 !to-pink-600 !border-0 !shadow-xl hover:!shadow-2xl !transition-all !duration-300 !transform hover:!scale-105"
                  onClick={handleBookTicket}
                  disabled={
                    !selectedCinema ||
                    !selectedAddress ||
                    !selectedShowtime ||
                    selectedSeats.length === 0
                  }
                >
                  <CheckCircleOutlined className="mr-2" />
                  Xác Nhận Đặt Vé
                </Button>

                {(!selectedCinema ||
                  !selectedAddress ||
                  !selectedShowtime ||
                  selectedSeats.length === 0) && (
                  <Text className="text-xs text-gray-500 text-center mt-3 block">
                    Vui lòng chọn đầy đủ thông tin để tiếp tục
                  </Text>
                )}
              </div>
            </Card>
          </Col>
        </Row>
        <Footer/>
      </div>
    </div>
  );
}
