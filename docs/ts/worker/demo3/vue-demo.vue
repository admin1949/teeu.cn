<script lang="ts" setup>
import { useTemplateRef, ref, onScopeDispose, onMounted } from "vue";
import demo2Url from "./worker/index?worker&url";
import { Fns } from "./worker/worker-type";
import { WorkerClient } from "./worker/utils/client";
import { ElButton } from "element-plus";
import { useCanvasSize, getRandomColor } from "./util";

const worker = new WorkerClient<Fns>(demo2Url, {
  type: "module",
  name: "demo3-react-worker",
  pool: 3,
});
const container = useTemplateRef("canvas");
const loading = ref(false);

const { size } = useCanvasSize({
  width: 400,
  height: 100,
});

const refresh = async () => {
  const count = 4;
  const instance = worker;
  const ctx = container.value?.getContext("2d");
  loading.value = true;
  if (!ctx || !instance) {
    return;
  }
  const gridSize = size.value.width / count;
  ctx.clearRect(0, 0, size.value.width, size.value.height);
  await Promise.all(
    Array.from({ length: count }, async (_, idx) => {
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
    })
  );
  loading.value = false;
};

onMounted(refresh);
onScopeDispose(() => {
  worker.dispose();
});
</script>

<template>
  <canvas
    ref="canvas"
    :width="size.width"
    :height="size.height"
    style="height: 100px; width: 400px"
  ></canvas>
  <div style="padding-top: 12px">
    <ElButton :loading="loading" @click="refresh"> 刷新 </ElButton>
  </div>
</template>
