<script setup lang="ts">
import LottieAnimation from "./components/LottieAnimation.vue";
import animationSrc from "./assets/animation.json?url";
import TypedJsBox from "./components/TypedJsBox.vue";
import Header from "@/widgets/Header.vue";
import Footer from "./widgets/Footer.vue";

const strings = ["写写代码。", "吹吹牛。", "看看书。"];
</script>

<template>
  <Header />
  <div class="body">
    <TypedJsBox class="title-box" tag="span" :strings :type-speed="90">
      <div>我是Mingjian</div>
      <div>一个前端工程师</div>
      <div>写 <span class="code">Typescript/Vue</span> 的。</div>
      <div>喜欢简约设计 🪐，</div>
      <span>偶尔</span>
    </TypedJsBox>
    <LottieAnimation style="width: 300px; height: 300px" :src="animationSrc" />
  </div>
  <Footer />
</template>

<style lang="scss" scoped>
.body {
  height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  .title-box {
    font-family: Heavy, Helvetica, Arial, sans-serif;
    font-size: 32px;
    font-weight: 600;
    padding: 0 20px;
    .code {
      color: #61dafb;
      transition: text-decoration 0.3s;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
