import React, { useEffect, useRef, FC, useState } from "react";
import { Button } from "antd";
import demo2Url from "./worker/index?worker&url";
import { Fns } from "./worker/worker-type";
import { WorkerClient } from "./worker/utils/client";

const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0")}`
}
interface Size {
  width: number,
  height: number,
}

const useCanvasSize = (originSize: Size) => {
  const updatePixelRatio = (size: Size): Size => {
    return {
      width: Math.floor(size.width * self.devicePixelRatio),
      height: Math.floor(size.height * self.devicePixelRatio),
    };
  };
  
  const [size, setSize] = useState(updatePixelRatio(originSize));

  useEffect(() => {
    const update = () => {
      setSize(updatePixelRatio(originSize));
    }
    
    let mqString = `(resolution: ${window.devicePixelRatio}dppx)`;
    const matcher = matchMedia(mqString);
    matcher.addEventListener("change", update);
    return () => {
      matcher.removeEventListener("change", update);
    }
  }, [])
  
  return {
    size,
  }
}

const App: FC = () => {
  const worker = useRef<WorkerClient<Fns> | null>(null);
  const container = useRef<HTMLCanvasElement | null>(null);
  const [loading, setLoading] = useState(false);
  const { size } = useCanvasSize({
    width: 400,
    height: 100,
  });
  
  const refresh = async () => {
    const count = 4;
    const instance = worker.current;
    const ctx = container.current?.getContext("2d");
    setLoading(true);
    if (!ctx || !instance) {
      return;
    }
    const gridSize = size.width / count;
    ctx.clearRect(0, 0, size.width, size.height);
    await Promise.all(Array.from({ length: count }, async (_, idx) => {
       const bg = await instance.callRemote("draw", [
         gridSize,
         ctx.canvas.height,
         getRandomColor(),
         self.devicePixelRatio,
       ]);
       ctx.drawImage(
         bg,
         0,
         0,
         bg.width,
         bg.height,
         gridSize * idx,
         0,
         gridSize,
         ctx.canvas.height
       );
    }));
    setLoading(false);
  };
  
  useEffect(() => {
    const instance = new WorkerClient<Fns>(demo2Url, {
      type: "module",
      name: "demo3-react-worker",
      pool: 3,
    });

    worker.current = instance;
    refresh();
    
    return () => {
      instance.dispose();
    };
  }, []);

  return (
    <>
      <canvas
        ref={container}
        width={size.width}
        height={size.height}
        style={{ height: "100px", width: "400px" }}
      ></canvas>
      <div style={{paddingTop: "12px"}}>
        <Button loading={loading} onClick={refresh}>
          刷新
        </Button>
      </div>
    </>
  );
};

export default App;
