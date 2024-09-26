<template>
  <div id="about">
    <img class="workspace" src="@/assets/images/workspace.webp" />
    <div class="info">
      <div class="avatar">
        <img src="@/assets/images/avatar.png" alt="" srcset="" />
      </div>
      <div class="info-text">
        👋🏼 嘿，我叫 田明建，我是一名前端开发人员 👨🏻‍💻， 🏠住在成都。
        大多数情况下，我正在处理一些网站 🕸️ 移动端 📱 小程序 📲。
        目前正在找工作。业余爱好宅在家里，也喜欢折腾服务器相关的东西。努力成为一个终身学习者。
      </div>
      <SpecialButton>了解更多👇</SpecialButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import SpecialButton from "@/components/SpecialButton.vue";
</script>

<style lang="scss" scoped>
#about {
  display: flex;
  flex-direction: column;
  padding-top: 60px;
  .workspace {
    width: 100%;
    height: 360px;
    object-fit: contain;
  }
  .info {
    padding: 40px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: url("@/assets/images/bgspot.svg");
    .avatar {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 auto;
      img {
        object-fit: contain;
        width: 100%;
        height: 100%;
      }
    }
    .info-text {
      padding: 20px 40px;
      text-indent: 2em;
    }
  }
}
</style>
