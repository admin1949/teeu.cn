<script setup lang="ts">
import LottieAnimation from "./components/LottieAnimation.vue";
import animationSrc from "./assets/animation.json?url";
import TypedJsBox from "./components/TypedJsBox.vue";

const strings = ["写写代码。", "吹吹牛。", "看看文档。"];
</script>

<template>
  <nav></nav>
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
  <div class="footer">
    <a href="https://beian.miit.gov.cn/" target="_blank">蜀ICP备2024098546号</a>
  </div>
</template>

<style scoped>
.title-box {
  font-family: Heavy, Helvetica, Arial, sans-serif;
  font-size: 32px;
  font-weight: 600;
  padding: 0 20px;
}
.title-box .code {
  color: #61dafb;
  transition: text-decoration 0.3s;
}

.title-box .code:hover {
  text-decoration: underline;
}

.body {
  height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

.footer {
  background-color: #ececec;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}
.footer a {
  text-decoration: none;
  font-size: 14px;
  color: #666;
}
.footer a:hover {
  color: #ff6a00;
}
</style>
