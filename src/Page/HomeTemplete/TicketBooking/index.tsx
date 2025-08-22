import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Button,
  Row,
  Col,
  Card,
  Space,
  notification,
  Badge,
  Tooltip,
  Rate,
  Divider,
} from "antd";
import {
  Film,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Play,
  Calendar,
  Star,
} from "lucide-react";
import { getMovieDetailsAPI } from "@/service/movie.api";
import { getLichChieuPhim } from "@/service/rap.api";
import type {
  MovieShowtime,
  HeThongRap,
  CumRap,
  LichChieuPhim,
} from "@/interfaces/rap.interface";
import type { Movie } from "@/interfaces/movie.interface";
import MovieBookingHeader from "../Componnent/hearderBooking";
import Footer from "../Componnent/Footer";

const { Title, Text } = Typography;

export default function TicketBooking() {
  const { movieID } = useParams<{ movieID: string }>();

  // State phim
  const [movie, setMovie] = useState<Movie | null>(null);

  // State lịch chiếu
  const [showtimeData, setShowtimeData] = useState<MovieShowtime | null>(null);
  const [cinemas, setCinemas] = useState<HeThongRap[]>([]);
  const [cinemaAddresses, setCinemaAddresses] = useState<CumRap[]>([]);
  const [showtimes, setShowtimes] = useState<LichChieuPhim[]>([]);

  // State lựa chọn
  const [selectedCinema, setSelectedCinema] = useState<string>("");
  const [selectedCinemaId, setSelectedCinemaId] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [selectedShowtime, setSelectedShowtime] = useState<string>("");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      if (!movieID) return;
      try {
        const data = await getMovieDetailsAPI(Number(movieID));
        setMovie(data ?? null);
      } catch (err) {
        console.error("Lỗi tải phim:", err);
      }
    };
    fetchMovie();
  }, [movieID]);

  // Fetch showtime
  useEffect(() => {
    const fetchShowtime = async () => {
      if (!movieID) return;
      try {
        const data = await getLichChieuPhim(Number(movieID));
        setShowtimeData(data ?? null);
        setCinemas(data?.heThongRapChieu || []);
      } catch (err) {
        console.error("Lỗi tải lịch chiếu:", err);
      }
    };
    fetchShowtime();
  }, [movieID]);

  // Chọn rạp
  const handleSelectCinema = (cinema: HeThongRap) => {
    setSelectedCinema(cinema.tenHeThongRap);
    setSelectedCinemaId(cinema.maHeThongRap);
    setSelectedAddress("");
    setSelectedShowtime("");
    setSelectedSeats([]);

    const heThong = showtimeData?.heThongRapChieu.find(
      (h) => h.maHeThongRap === cinema.maHeThongRap
    );
    setCinemaAddresses(heThong?.cumRapChieu || []);
    setShowtimes([]);
  };

  // Chọn cụm rạp
  const handleSelectAddress = (maCumRap: string) => {
    setSelectedAddress(maCumRap);
    setSelectedShowtime("");
    setSelectedSeats([]);

    const cumRap = cinemaAddresses.find((c) => c.maCumRap === maCumRap);
    setShowtimes(cumRap?.lichChieuPhim || []);
  };

  // Chọn ghế
  const handleSelectSeat = (seat: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
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
        description: "Vui lòng chọn rạp, cụm rạp, suất chiếu và ghế",
        icon: <AlertCircle className="text-yellow-500" />,
      });
      return;
    }

    notification.success({
      message: "Đặt vé thành công",
      description: `Đã đặt ${selectedSeats.length} ghế tại ${selectedCinema} - suất chiếu ${selectedShowtime}`,
      duration: 4,
      icon: <CheckCircle2 className="text-green-500" />,
    });

    setSelectedSeats([]);
  };

  // Get selected showtime details for summary
  const getSelectedShowtimeDetails = () => {
    if (!selectedShowtime) return null;

    const showtime = showtimes.find((s) => s.maLichChieu === selectedShowtime);
    if (!showtime) return null;

    return new Date(showtime.ngayChieuGioChieu);
  };

  // Get selected address name
  const getSelectedAddressName = () => {
    if (!selectedAddress) return "";
    const cumRap = cinemaAddresses.find((c) => c.maCumRap === selectedAddress);
    return cumRap?.tenCumRap || selectedAddress;
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50">
      <MovieBookingHeader />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Movie Info Card */}
        {movie && (
          <Card className="mb-8 shadow-xl rounded-2xl overflow-hidden border-0">
            <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 text-white">
              <Row gutter={[32, 24]} className="p-8">
                {/* Movie Poster */}
                <Col xs={24} md={8} lg={6}>
                  <div className="relative group">
                    <img
                      src={movie.hinhAnh}
                      alt={movie.tenPhim}
                      className="w-full h-auto max-h-96 object-cover rounded-xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-xl group-hover:bg-black/10 transition-colors duration-300"></div>
                  </div>
                </Col>

                {/* Movie Details */}
                <Col xs={24} md={16} lg={18}>
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      <Title
                        level={1}
                        className="!text-white !mb-4 !text-3xl lg:!text-4xl font-bold"
                      >
                        {movie.tenPhim}
                      </Title>

                      {/* Movie Stats */}
                      <div className="flex flex-wrap items-center gap-6 mb-6">
                        <div className="flex items-center gap-2">
                          <Star
                            className="text-yellow-400 fill-yellow-400"
                            size={20}
                          />
                          <Rate
                            disabled
                            defaultValue={movie.danhGia / 2}
                            className="!text-yellow-400"
                          />
                          <span className="text-xl font-bold">
                            {movie.danhGia}/10
                          </span>
                        </div>
                        <Divider
                          type="vertical"
                          className="!border-white/30 !h-6"
                        />

                        <div className="flex items-center gap-2">
                          <Calendar className="text-green-300" size={20} />
                          <span className="text-lg">
                            {new Date(movie.ngayKhoiChieu).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-6">
                        <Text className="!text-gray-200 text-lg leading-relaxed line-clamp-4">
                          {movie.moTa}
                        </Text>
                      </div>
                    </div>

                    {/* Action Button */}

                    <div className="flex gap-4">
                      <Button
                        type="primary"
                        size="large"
                        icon={<Play size={20} />}
                        className="!bg-gradient-to-r !from-red-500 !to-pink-600 !border-0 !h-14 !px-8 !rounded-xl !text-lg font-bold shadow-lg hover:!from-red-600 hover:!to-pink-700 transition-all duration-300 hover:scale-105"
                      ></Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        )}

        {/* Selection Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Step 1: Chọn rạp */}
          <Card
            title={
              <div className="flex items-center gap-3 text-lg font-bold">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <Film size={20} />
                <span>Chọn rạp chiếu</span>
              </div>
            }
            className="shadow-lg rounded-xl border-l-4 border-l-blue-500 hover:shadow-xl transition-shadow duration-300"
          >
            <Space direction="vertical" className="w-full" size="small">
              {cinemas.map((cinema) => (
                <Button
                  key={cinema.maHeThongRap}
                  block
                  size="large"
                  className={`!h-14 !rounded-xl border-2 transition-all duration-300 ${
                    selectedCinemaId === cinema.maHeThongRap
                      ? "!bg-blue-500 !text-white !border-blue-500 shadow-lg scale-105"
                      : "!bg-gray-50 hover:!bg-blue-50 !border-gray-200 hover:!border-blue-300"
                  }`}
                  onClick={() => handleSelectCinema(cinema)}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">
                      <img
                        src={cinema.logo}
                        alt={cinema.tenHeThongRap}
                        className="h-8 w-auto object-contain inline-block"
                      />{" "}
                      {cinema.tenHeThongRap}
                    </span>

                    {selectedCinemaId === cinema.maHeThongRap && (
                      <CheckCircle2 size={20} />
                    )}
                  </div>
                </Button>
              ))}
            </Space>
          </Card>

          {/* Step 2: Chọn cụm rạp */}
          <Card
            title={
              <div className="flex items-center gap-3 text-lg font-bold">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <MapPin size={20} />
                <span>Chọn cụm rạp</span>
              </div>
            }
            className="shadow-lg rounded-xl border-l-4 border-l-green-500 hover:shadow-xl transition-shadow duration-300"
          >
            <Space direction="vertical" className="w-full" size="small">
              {cinemaAddresses.length > 0 ? (
                cinemaAddresses.map((cumRap) => (
                  <Button
                    key={cumRap.maCumRap}
                    block
                    size="large"
                    className={`!h-auto !min-h-14 !rounded-xl border-2 transition-all duration-300 ${
                      selectedAddress === cumRap.maCumRap
                        ? "!bg-green-500 !text-white !border-green-500 shadow-lg scale-105"
                        : "!bg-gray-50 hover:!bg-green-50 !border-gray-200 hover:!border-green-300"
                    }`}
                    onClick={() => handleSelectAddress(cumRap.maCumRap)}
                  >
                    <div className="flex items-center justify-between w-full py-2">
                      <div className="text-left">
                        <div className="font-medium">{cumRap.tenCumRap}</div>
                        <div className="text-xs opacity-75">
                          {cumRap.diaChi}
                        </div>
                      </div>
                      {selectedAddress === cumRap.maCumRap && (
                        <CheckCircle2 size={20} />
                      )}
                    </div>
                  </Button>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <MapPin size={48} className="mx-auto mb-2 opacity-30" />
                  <Text type="secondary">Vui lòng chọn rạp trước</Text>
                </div>
              )}
            </Space>
          </Card>

          {/* Step 3: Chọn suất chiếu */}
          <Card
            title={
              <div className="flex items-center gap-3 text-lg font-bold">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <Clock size={20} />
                <span>Chọn suất chiếu</span>
              </div>
            }
            className="shadow-lg rounded-xl border-l-4 border-l-purple-500 hover:shadow-xl transition-shadow duration-300"
          >
            {showtimes.length > 0 ? (
              <div className="space-y-6">
                {Object.entries(
                  showtimes.reduce((acc, lich) => {
                    const date = new Date(
                      lich.ngayChieuGioChieu
                    ).toLocaleDateString("vi-VN");
                    if (!acc[date]) acc[date] = [];
                    acc[date].push(lich);
                    return acc;
                  }, {} as Record<string, typeof showtimes>)
                ).map(([date, lichTrongNgay]) => (
                  <div key={date}>
                    {/* Header ngày */}
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={18} className="text-purple-500" />
                      <span className="font-semibold text-gray-800">
                        {date}
                      </span>
                    </div>

                    {/* Các giờ chiếu */}
                    <Row gutter={[12, 12]}>
                      {lichTrongNgay.map((lich) => (
                        <Col
                          key={lich.maLichChieu}
                          xs={12}
                          sm={8}
                          md={6}
                          lg={4}
                        >
                          <Button
                            block
                            className={`!h-14 !rounded-xl flex flex-col items-center justify-center py-2 transition-all duration-300 font-semibold shadow-lg ${
                              selectedShowtime === lich.maLichChieu
                                ? "!bg-purple-500 !text-white !border-purple-500 shadow-lg"
                                : "!bg-gray-50 hover:!bg-purple-50 !border-gray-200 hover:!border-purple-300"
                            }`}
                            onClick={() =>
                              setSelectedShowtime(lich.maLichChieu)
                            }
                          >
                            <span className="text-base font-bold">
                              {new Date(
                                lich.ngayChieuGioChieu
                              ).toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </Button>
                        </Col>
                      ))}
                    </Row>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Clock size={48} className="mx-auto mb-2 opacity-30" />
                <Text type="secondary">Chọn cụm rạp để xem suất chiếu</Text>
              </div>
            )}
          </Card>
        </div>

        {/* Seat Selection */}
        <Card
          className="mb-8 shadow-lg rounded-xl"
          title={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-lg font-bold">
                <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <Users size={20} />
                <span>Chọn ghế ngồi</span>
              </div>
              <Badge
                count={selectedSeats.length}
                showZero
                className="!bg-red-500"
              >
                <div className="bg-red-100 px-3 py-1 rounded-full">
                  <span className="text-red-600 font-medium">Đã chọn</span>
                </div>
              </Badge>
            </div>
          }
        >
          {/* Screen */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white text-center py-3 rounded-t-2xl mx-auto max-w-md">
              <span className="font-bold">Màn hình</span>
            </div>
            <div className="h-2 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 mx-auto max-w-md rounded-b-xl shadow-lg"></div>
          </div>

          {/* Seats Grid */}
          <Row gutter={[4, 4]} justify="center">
            {Array.from({ length: 60 }, (_, i) => {
              const row = String.fromCharCode(65 + Math.floor(i / 10)); // A, B, C, D, E, F
              const seat = `${row}${(i % 10) + 1}`;
              const isSelected = selectedSeats.includes(seat);
              const isOccupied = Math.random() < 0.1; // 10% ghế đã có người đặt

              return (
                <Col key={seat} xs={4} sm={3} md={2}>
                  <Tooltip
                    title={isOccupied ? "Ghế đã được đặt" : `Ghế ${seat}`}
                  >
                    <Button
                      block
                      size="small"
                      disabled={isOccupied}
                      className={`!h-8 !w-8 !min-w-8 !rounded-lg !p-0 transition-all duration-300 text-xs font-bold ${
                        isOccupied
                          ? "!bg-gray-300 !text-gray-500 !cursor-not-allowed"
                          : isSelected
                          ? "!bg-red-500 !text-white !border-red-500 shadow-lg scale-110"
                          : "!bg-green-100 hover:!bg-green-200 !text-green-700 !border-green-300 hover:scale-105"
                      }`}
                      onClick={() => !isOccupied && handleSelectSeat(seat)}
                    >
                      {seat}
                    </Button>
                  </Tooltip>
                </Col>
              );
            })}
          </Row>

          {/* Seat Legend */}
          <div className="mt-6 flex justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span className="text-sm">Trống</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">Đã chọn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <span className="text-sm">Đã đặt</span>
            </div>
          </div>
        </Card>

        {/* Booking Summary & Confirmation */}
        <Card className="shadow-xl rounded-2xl bg-gradient-to-br from-blue-50 via-white to-purple-50 border-0">
          <div className="text-center space-y-6">
            {/* Summary */}
            {(selectedCinema ||
              selectedAddress ||
              selectedShowtime ||
              selectedSeats.length > 0) && (
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <Title
                    level={3}
                    className="!mb-0 !text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  >
                    Thông tin đặt vé
                  </Title>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedCinema && (
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Film className="text-blue-600" size={20} />
                        <span className="font-semibold text-blue-800">
                          Rạp chiếu
                        </span>
                      </div>
                      <div className="text-gray-800 font-medium text-lg">
                        {selectedCinema}
                      </div>
                    </div>
                  )}

                  {selectedAddress && (
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin className="text-green-600" size={20} />
                        <span className="font-semibold text-green-800">
                          Cụm rạp
                        </span>
                      </div>
                      <div className="text-gray-800 font-medium text-lg">
                        {getSelectedAddressName()}
                      </div>
                    </div>
                  )}

                  {selectedShowtime && (
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="text-purple-600" size={20} />
                        <span className="font-semibold text-purple-800">
                          Suất chiếu
                        </span>
                      </div>
                      <div className="text-gray-800 font-medium text-lg">
                        {getSelectedShowtimeDetails() && (
                          <>
                            <div>
                              {getSelectedShowtimeDetails()!.toLocaleTimeString(
                                "vi-VN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              {getSelectedShowtimeDetails()!.toLocaleDateString(
                                "vi-VN",
                                {
                                  weekday: "long",
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedSeats.length > 0 && (
                    <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="text-red-600" size={20} />
                        <span className="font-semibold text-red-800">
                          Ghế đã chọn
                        </span>
                      </div>
                      <div className="text-gray-800 font-medium text-lg">
                        <Badge count={selectedSeats.length} className="mr-2">
                          <span>{selectedSeats.join(", ")}</span>
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Confirm Button */}
            <div className="pt-4">
              <Button
                type="primary"
                size="large"
                className={`!h-16 !rounded-2xl !px-12 !text-xl font-bold shadow-2xl transition-all duration-300 ${
                  selectedCinema &&
                  selectedAddress &&
                  selectedShowtime &&
                  selectedSeats.length > 0
                    ? "!bg-gradient-to-r !from-blue-500 !to-purple-600 hover:!from-blue-600 hover:!to-purple-700 hover:scale-105 hover:shadow-2xl"
                    : ""
                }`}
                onClick={handleBookTicket}
                icon={<CheckCircle2 size={24} />}
              >
                Xác nhận đặt vé
                {selectedSeats.length > 0 && (
                  <Badge count={selectedSeats.length} className="ml-3" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
