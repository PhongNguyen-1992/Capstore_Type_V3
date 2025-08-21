import { Button, Typography } from "antd";
import { useState } from "react";
import SelectedSeats from "./SelectSeat";


const { Text } = Typography;

export default function RenderSeats() {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const toggleSeat = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];

  return (
    <div className="space-y-6">
      {/* Ghế ngồi */}
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row} className="flex items-center justify-center gap-3">
            {/* Ký hiệu hàng */}
            <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg shadow-md">
              {row}
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 10 }, (_, i) => {
                const seatId = `${row}${i + 1}`;
                const isSelected = selectedSeats.includes(seatId);
                const isOccupied = Math.random() < 0.15;

                return (
                  <Button
                    key={seatId}
                    size="small"
                    disabled={isOccupied}
                    className={`!w-12 !h-12 !p-0 !border-2 !rounded-xl !font-semibold !text-xs transition-all duration-300 transform ${
                      isSelected
                        ? "!bg-gradient-to-r !from-green-400 !to-green-600 !border-green-500 !text-white !shadow-xl !scale-110 hover:!scale-125"
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
      </div>

      {/* Chú thích trạng thái ghế */}
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

      {/* Ghế đã chọn */}
      <SelectedSeats
        selectedSeats={selectedSeats}
        onRemove={(seatId) =>
          setSelectedSeats((prev) => prev.filter((id) => id !== seatId))
        }
      />
    </div>
  );
}
