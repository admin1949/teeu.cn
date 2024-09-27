<script setup lang="ts">
import Header from "@/widgets/Header.vue";
import Home from "@/widgets/Home.vue";
import About from "@/widgets/About.vue";
import Project from "@/widgets/Project.vue";
import Me from "@/widgets/Me.vue";
import { useBodyScroll } from "@/hooks/useBodyScroll";
import type { ScrollbarInstance } from "element-plus";

const { setInstance, onScroll } = useBodyScroll();
const scrollBarRef = useTemplateRef<ScrollbarInstance>("scrollBar");
onMounted(() => {
  setInstance(scrollBarRef.value);
});
onUnmounted(() => {
  setInstance(null);
});
</script>

<template>
  <Header />
  <ElScrollbar ref="scrollBar" @scroll="onScroll" height="100vh">
    <div class="body">
      <Home />
      <About />
      <Project />
      <Me />
    </div>
  </ElScrollbar>
</template>

<style lang="scss" scoped>
.body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: var(--nav-height);
  width: 100vw;
}
</style>
