import { useRef, useEffect } from "react";

function DrawImageFromBE() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Nếu lấy từ BE mà cần gửi cookie hoặc header, có thể set img.crossOrigin
        // img.crossOrigin = "anonymous";

        // Xóa canvas cũ (nếu có)
        ctx.beginPath();
        ctx.moveTo(20, 20);
        ctx.bezierCurveTo(20, 100, 200, 100, 200, 20);
        ctx.stroke();
      }
    }
  }, []);

  return <canvas ref={canvasRef} />;
}

export default DrawImageFromBE;
