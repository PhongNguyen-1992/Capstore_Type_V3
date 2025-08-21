import { Tag, Typography } from "antd";

const { Text } = Typography;

interface SelectedSeatsProps {
  selectedSeats: string[];
  onRemove: (seatId: string) => void;
}

export default function SelectedSeats({
  selectedSeats,
  onRemove,
}: SelectedSeatsProps) {
  return (
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
                onClose={() => onRemove(seat)}
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
  );
}
