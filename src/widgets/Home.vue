<template>
  <div id="home">
    <TypedJsBox class="title-box" tag="span" :strings :type-speed="90">
      <div>我是Mingjian</div>
      <div>一个前端工程师</div>
      <div>写 <span class="code">Typescript/Vue</span> 的。</div>
      <div>喜欢简约设计 🪐，</div>
      <span>偶尔</span>
    </TypedJsBox>
    <div class="lottie-box">
      <LottieAnimation
        style="width: 400px; height: 400px"
        :src="animationSrc"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import LottieAnimation from "@/components/LottieAnimation.vue";
import animationSrc from "@/assets/animation.json?url";
import TypedJsBox from "@/components/TypedJsBox.vue";

const strings = ["写写代码。", "吹吹牛。", "看看书。"];
</script>

<style lang="scss" scoped>
@use "@/mixins.scss";

#home {
  background: url("@/assets/images/home-bg.svg"), var(--c-bg);
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  padding: 20% 80px;
  font-size: 32px;
  height: calc(100vh - var(--nav-height));

  @include mixins.screen(phone) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    font-size: 24px;
    padding: 60px 40px 0;
  }

  .title-box {
    font-family: Heavy, Helvetica, Arial, sans-serif;
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

  .lottie-box {
    display: flex;
    width: 0;
    flex: 1;
    justify-content: center;
    @include mixins.screen(phone) {
      width: 100%;
      height: 0;
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>
