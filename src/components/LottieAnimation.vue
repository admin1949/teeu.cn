<template>
  <div ref="lottie-container"></div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef, onUnmounted, watchEffect } from "vue";
import lottie from "lottie-web";
import type { AnimationItem } from "lottie-web";

const { src } = defineProps<{
  src: string;
}>();

const container = useTemplateRef<HTMLDivElement>("lottie-container");
let instance: AnimationItem | null;
onMounted(() => {
  const c = container.value;
  if (!c) {
    return;
  }

  instance = lottie.loadAnimation({
    container: c,
    path: src,
    renderer: "svg",
    loop: true,
    autoplay: true,
  });
});

watchEffect(() => {
  const path = src;
  if (instance && instance.assetsPath !== path) {
    instance.assetsPath = path;
  }
});
onUnmounted(() => {
  if (instance) {
    instance.destroy();
    instance = null;
  }
});
</script>

<style lang="css" scoped></style>
