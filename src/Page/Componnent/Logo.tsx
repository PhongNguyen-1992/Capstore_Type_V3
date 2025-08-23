import { useRef, useEffect } from "react";

interface PandaLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const PandaLogo: React.FC<PandaLogoProps> = ({
  width = 500,
  height = 120,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- Clear canvas ---
    ctx.fillStyle = "rgba(26, 26, 46, 0.8)";
    ctx.fillRect(0, 0, width, height);

    const centerY = height / 2;
    const pandaX = 60;

    // Shadow/glow effect cho gấu trúc
    ctx.shadowColor = "rgba(255, 165, 0, 0.3)";
    ctx.shadowBlur = 15;

    // Tai gấu trúc
    const earGradient = ctx.createRadialGradient(
      pandaX - 25,
      centerY - 25,
      0,
      pandaX - 25,
      centerY - 25,
      12
    );
    earGradient.addColorStop(0, "#2a2a2a");
    earGradient.addColorStop(1, "#000000");

    ctx.beginPath();
    ctx.arc(pandaX - 25, centerY - 25, 12, 0, 2 * Math.PI);
    ctx.arc(pandaX + 25, centerY - 25, 12, 0, 2 * Math.PI);
    ctx.fillStyle = earGradient;
    ctx.fill();

    // Mặt gấu trúc
    const faceGradient = ctx.createRadialGradient(pandaX, centerY - 5, 0, pandaX, centerY - 5, 35);
    faceGradient.addColorStop(0, "#ffffff");
    faceGradient.addColorStop(0.7, "#f8f8f8");
    faceGradient.addColorStop(1, "#e0e0e0");

    ctx.beginPath();
    ctx.arc(pandaX, centerY, 35, 0, 2 * Math.PI);
    ctx.fillStyle = faceGradient;
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 165, 0, 0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Reset shadow
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    // Vùng mắt
    const eyePatchGradient = ctx.createRadialGradient(pandaX - 15, centerY - 8, 0, pandaX - 15, centerY - 8, 15);
    eyePatchGradient.addColorStop(0, "#1a1a1a");
    eyePatchGradient.addColorStop(1, "#000000");

    ctx.beginPath();
    ctx.ellipse(pandaX - 15, centerY - 8, 12, 15, 0, 0, 2 * Math.PI);
    ctx.ellipse(pandaX + 15, centerY - 8, 12, 15, 0, 0, 2 * Math.PI);
    ctx.fillStyle = eyePatchGradient;
    ctx.fill();

    // Mắt
    const eyeGradient = ctx.createRadialGradient(pandaX - 15, centerY - 8, 0, pandaX - 15, centerY - 8, 6);
    eyeGradient.addColorStop(0, "#333333");
    eyeGradient.addColorStop(1, "#000000");

    ctx.beginPath();
    ctx.arc(pandaX - 15, centerY - 8, 6, 0, 2 * Math.PI);
    ctx.arc(pandaX + 15, centerY - 8, 6, 0, 2 * Math.PI);
    ctx.fillStyle = eyeGradient;
    ctx.fill();

    // Ánh sáng mắt
    ctx.beginPath();
    ctx.arc(pandaX - 12, centerY - 10, 2, 0, 2 * Math.PI);
    ctx.arc(pandaX + 18, centerY - 10, 2, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // Mũi
    const noseGradient = ctx.createRadialGradient(pandaX, centerY + 5, 0, pandaX, centerY + 5, 4);
    noseGradient.addColorStop(0, "#ff6b6b");
    noseGradient.addColorStop(1, "#ff4757");

    ctx.beginPath();
    ctx.arc(pandaX, centerY + 5, 4, 0, 2 * Math.PI);
    ctx.fillStyle = noseGradient;
    ctx.fill();

    // Miệng
    ctx.beginPath();
    ctx.arc(pandaX, centerY + 12, 8, 0, Math.PI);
    ctx.strokeStyle = "#666666";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Text PANDA CINEMA
    const textX = 140;
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.shadowBlur = 10;

    const textGradient = ctx.createLinearGradient(textX, centerY - 30, textX + 300, centerY + 30);
    textGradient.addColorStop(0, "#ff6b35");
    textGradient.addColorStop(0.3, "#f7931e");
    textGradient.addColorStop(0.6, "#ffd23f");
    textGradient.addColorStop(1, "#ff6b35");

    ctx.font = "bold 42px Arial";
    ctx.fillStyle = textGradient;
    ctx.textBaseline = "middle";
    ctx.fillText("PANDA", textX, centerY - 12);

    ctx.font = "bold 28px Arial";
    const cinemaGradient = ctx.createLinearGradient(textX, centerY + 10, textX + 200, centerY + 25);
    cinemaGradient.addColorStop(0, "#ff4757");
    cinemaGradient.addColorStop(0.5, "#ff6348");
    cinemaGradient.addColorStop(1, "#ff7675");

    ctx.fillStyle = cinemaGradient;
    ctx.fillText("CINEMA", textX + 20, centerY + 20);

    ctx.shadowColor = "transparent";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
  }, [width, height]);

  return (
    <div
      className={className} // <- đây để nhận className từ bên ngoài
      style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <canvas ref={canvasRef} width={width} height={height} style={{ borderRadius: 15 }} />
    </div>
  );
};

export default PandaLogo;
