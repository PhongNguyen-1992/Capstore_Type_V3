import { Typography } from "antd";

const { Text } = Typography;

interface TotalPriceProps {
  selectedSeats: string[];
  ticketPrice: number;
  selectedShowtime?: any; // có thể refine kiểu
}

export default function TotalPrice({
  selectedSeats,
  ticketPrice,
  selectedShowtime,
}: TotalPriceProps) {
  const total = selectedSeats.length * ticketPrice;

  return (
    <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
      <div className="flex justify-between items-center mb-2">
        <Text strong className="text-gray-800 text-lg">
          Tổng tiền:
        </Text>
        <Text
          strong
          className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
        >
          {total.toLocaleString("vi-VN")} VNĐ
        </Text>
      </div>
      <Text className="text-sm text-gray-600">
        {selectedSeats.length} ghế × {ticketPrice.toLocaleString("vi-VN")} VNĐ
      </Text>
      {selectedShowtime && (
        <Text className="text-xs text-blue-600 mt-1 block">
          * Giá vé đã bao gồm suất chiếu đã chọn
        </Text>
      )}
    </div>
  );
}
