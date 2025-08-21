import { useState, useEffect } from "react";
import {  useParams } from "react-router-dom";
import {
  Card,
  Button,
  Select,
  Tag,
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
  StarOutlined,
  ClockCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import type { Movie } from "@/interfaces/movie.interface";
import type { Cinema, CumRap, Rap } from "@/interfaces/rap.interface";
import { getListMovie } from "@/service/movie.api";
import { diaChiRap, getListCumRap } from "@/service/rap.api";
import MovieBookingHeader from "./hearder";

const { Title, Text, Paragraph } = Typography;
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
  const [loading, setLoading] = useState<boolean>(true);  
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

  // click chọn rạp sẽ show ra địa chỉ
  const handleSelectCinema = async (cinema: Cinema) => {
    setSelectedCinema(cinema.tenHeThongRap);
    setSelectedAddress(""); // Reset address when changing cinema

    try {
      const data = await diaChiRap(cinema.maHeThongRap);
      const addressesArray = Array.isArray(data) ? data : [data];
      setCinemaAddresses(addressesArray);
    } catch (error) {
      console.error("Lỗi khi lấy địa chỉ rạp:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách địa chỉ rạp",
      });
    }
  };

  // Toggle chọn ghế
  const toggleSeat = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
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

    notification.success({
      message: "Đặt vé thành công! 🎉",
      description: `Đã đặt ${selectedSeats.length} ghế cho suất ${selectedShowtime} tại ${selectedCinema}`,
      duration: 4,
    });

    // Reset form after successful booking
    setSelectedSeats([]);
    setSelectedShowtime("");
  };

  // Render ghế với thiết kế đẹp hơn
  const renderSeats = () => {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    return (
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row} className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg shadow-md">
              {row}
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 10 }, (_, i) => {
                const seatId = `${row}${i + 1}`;
                const isSelected = selectedSeats.includes(seatId);
                const isOccupied = Math.random() < 0.15; // Reduced occupied seats for better UX

                return (
                  <Button
                    key={seatId}
                    size="small"
                    disabled={isOccupied}
                    className={`!w-12 !h-12 !p-0 !border-2 !rounded-xl !font-semibold !text-xs transition-all duration-300 transform ${
                      isSelected
                        ? "!bg-gradient-to-r !from-green-400 !to-green-600 !border-green-500 !text-white !shadow-xl !scale-110 hover:!scale-115"
                        : isOccupied
                        ? "!bg-gradient-to-r !from-red-100 !to-red-200 !border-red-300 !text-red-600 cursor-not-allowed opacity-60"
                        : "!bg-gradient-to-r !from-blue-50 !to-indigo-50 !border-blue-200 !text-blue-700 hover:!bg-gradient-to-r hover:!from-blue-100 hover:!to-indigo-100 hover:!border-blue-400 hover:!shadow-lg hover:!scale-105"
                    }`}
                    onClick={() => !isOccupied && toggleSeat(seatId)}
                  >
                    {i + 1}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Seat legend */}
        <div className="flex justify-center gap-8 mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg"></div>
            <Text className="text-sm font-medium text-gray-700">Còn trống</Text>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-600 rounded-lg"></div>
            <Text className="text-sm font-medium text-gray-700">Đã chọn</Text>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-red-100 to-red-200 border-2 border-red-300 rounded-lg opacity-60"></div>
            <Text className="text-sm font-medium text-gray-700">Đã bán</Text>
          </div>
        </div>
      </div>
    );
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
      <div className="max-w-7xl mx-auto px-4">
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
                  {renderSeats()}
                </div>
              </div>
            </Card>
          </Col>

          {/* Thông tin đặt vé */}
          <Col xs={24} lg={8}>
            <Card
              className="!shadow-2xl !border-0 !rounded-3xl sticky top-8 overflow-hidden"
              bodyStyle={{ padding: 0 }}
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                <Title level={3} className="!text-white !mb-0 text-center">
                  <StarOutlined className="mr-2" />
                  Thông Tin Đặt Vé
                </Title>
              </div>

              <div className="p-6">
                {/* Movie Info */}
                <div className="mb-8">
                  <div className="relative mb-4 rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={movieData.hinhAnh}
                      alt={movieData.tenPhim}
                      className="w-full h-64 object-cover"
                      preview={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <Title level={4} className="!text-white !mb-1">
                        {movieData.tenPhim}
                      </Title>
                    </div>
                  </div>
                  <Paragraph
                    ellipsis={{ rows: 3, expandable: true, symbol: "Xem thêm" }}
                    className="text-gray-600 text-sm leading-relaxed"
                  >
                    {movieData.moTa}
                  </Paragraph>
                </div>

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
                    onChange={(value: string) => setSelectedAddress(value)}
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
                  <div className="grid grid-cols-2 gap-3">
                    {["10:00", "13:00", "15:30", "18:00", "20:30"].map(
                      (time) => (
                        <Button
                          key={time}
                          type={
                            selectedShowtime === time ? "primary" : "default"
                          }
                          size="large"
                          className={`!h-12 !rounded-xl !font-semibold !transition-all !duration-300 !transform ${
                            selectedShowtime === time
                              ? "!bg-gradient-to-r !from-blue-500 !to-purple-600 !shadow-xl !scale-105 hover:!scale-110"
                              : "!bg-white !border-gray-300 hover:!border-blue-400 hover:!shadow-md hover:!scale-105"
                          }`}
                          onClick={() => setSelectedShowtime(time)}
                        >
                          {time}
                        </Button>
                      )
                    )}
                  </div>
                </div>

                <Divider className="!border-gray-200" />

                {/* Selected Seats */}
                <div className="mb-8">
                  <Text strong className="block mb-4 text-gray-800 text-lg">
                    Ghế đã chọn ({selectedSeats.length} ghế)
                  </Text>
                  <div className="min-h-[80px] p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border">
                    {selectedSeats.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedSeats.map((seat) => (
                          <Tag
                            key={seat}
                            color="success"
                            closable
                            onClose={() => toggleSeat(seat)}
                            className="!px-3 !py-1 !text-sm !font-medium !rounded-lg !border-0"
                          >
                            {seat}
                          </Tag>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-12">
                        <Text className="text-gray-500 text-center">
                          🪑 Chưa chọn ghế nào
                        </Text>
                      </div>
                    )}
                  </div>
                </div>

                {/* Total Price */}
                <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                  <div className="flex justify-between items-center mb-2">
                    <Text strong className="text-gray-800 text-lg">
                      Tổng tiền:
                    </Text>
                    <Text
                      strong
                      className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      {(selectedSeats.length * 120000).toLocaleString("vi-VN")}{" "}
                      VNĐ
                    </Text>
                  </div>
                  <Text className="text-sm text-gray-600">
                    {selectedSeats.length} ghế × 120.000 VNĐ
                  </Text>
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
      </div>
    </div>
  );
}
