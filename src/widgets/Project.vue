<template>
  <div id="project">
    <img
      src="@/assets/images/cartoon-rocket.webp"
      class="cartoon-rocket"
      alt=""
    />
    <a
      href="weixin://dl/business/?appid=wxc4451c3701ddfd0d&path=%2Fpages%2Ffind-job%2Ffind-job.html&env_version=release"
      >立即跳转</a
    >
    <div class="projcet-info">项目介绍</div>
    <div class="project-list">
      <div class="project-item"></div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
#project {
  display: flex;
  flex-direction: column;
  padding-top: 40px;
  align-items: center;
  .cartoon-rocket {
    width: 100%;
    height: auto;
  }
  .projcet-info {
    font-size: 40px;
    color: #4e5064;
    position: relative;
    line-height: 68px;
    font-weight: 500;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      transparent 54%,
      #bae8e8 54%,
      #bae8e8 100%
    );
    &::after {
      content: "";
      display: block;
      position: absolute;
      bottom: 0;
      left: 2%;
      width: 90%;
      height: 8px;
      background: linear-gradient(
        to right,
        #eb9a04 0%,
        #eb9a04 25%,
        #bae8e8 25%,
        #bae8e8 35%,
        #eb9a04 35%,
        #eb9a04 100%
      );
    }
  }
}
</style>
