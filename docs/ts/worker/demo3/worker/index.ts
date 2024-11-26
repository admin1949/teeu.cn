import { WorkerServices } from "./utils/server";
import { createTransferRes } from "./utils/transfer-res";
import { Fns } from "./worker-type";

const sleep = (time = 1000) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, time);
  });

export default new WorkerServices<Fns>({
  async draw(width, height, color, scale = 2) {
    await sleep();
    const canvas = new OffscreenCanvas(width * scale, height * scale);
    let ctx = canvas.getContext("2d")!;
    if (ctx) {
      ctx.beginPath();
      ctx.scale(scale, scale);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 0;
      const radius = Math.min(width, height) / 2 - 4;
      ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
    const bitmap = canvas.transferToImageBitmap();
    return createTransferRes(bitmap, [bitmap]);
  },
});
