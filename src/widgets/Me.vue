<template>
  <div id="me">
    <div class="content">
      <div class="row-item left">
        <div class="top-contetn">
          <LottieAnimation
            class="lottie-box"
            :src="animation2"
          ></LottieAnimation>
          <div class="stack-box">
            <div>当前页面技术栈</div>
            <div class="stack-list">
              <ElTooltip content="Vite" placement="top">
                <img
                  class="stack-icon"
                  src="@/assets/images/logo/vite.svg"
                  alt=""
                />
              </ElTooltip>
              <ElTooltip content="Vue" placement="top">
                <img
                  class="stack-icon"
                  src="@/assets/images/logo/vue.svg"
                  alt=""
                />
              </ElTooltip>
              <ElTooltip content="VueUse" placement="top">
                <img
                  class="stack-icon"
                  src="@/assets/images/logo/vueuse.svg"
                  alt=""
                />
              </ElTooltip>
              <ElTooltip content="TypeScript" placement="top">
                <img
                  class="stack-icon"
                  src="@/assets/images/logo/ts-logo-128.svg"
                  alt=""
                />
              </ElTooltip>
              <ElTooltip content="Sass" placement="top">
                <img
                  class="stack-icon"
                  src="@/assets/images/logo/sass.svg"
                  alt=""
                />
              </ElTooltip>
              <ElTooltip content="Pnpm" placement="top">
                <img
                  class="stack-icon"
                  src="@/assets/images/logo/pnpm.svg"
                  alt=""
                />
              </ElTooltip>
              <ElTooltip content="ElementPlus" placement="top">
                <img
                  class="stack-icon"
                  src="@/assets/images/logo/element-plus-logo.svg"
                  alt=""
                />
              </ElTooltip>
            </div>
          </div>
        </div>
        <div>
          <a
            v-if="!isPhone"
            href="https://beian.miit.gov.cn/"
            class="link"
            target="_blank"
            >蜀ICP备2024098546号</a
          >
        </div>
      </div>
      <div class="row-item right">
        <div class="connection">
          <a
            href="https://github.com/admin1949"
            target="_blank"
            class="connection-item"
          >
            <img src="@/assets/github.svg" alt="github" srcset="" />
          </a>
          <a
            href="https://juejin.cn/user/3315782800639342"
            target="_blank"
            class="connection-item"
          >
            <img src="@/assets/juejin.svg" alt="juejin" srcset="" />
          </a>
          <a
            href="https://teeu.cn/blog/"
            target="_blank"
            class="connection-item"
          >
            <img src="@/assets/vitepress.svg" alt="juejin" srcset="" />
          </a>

          <a
            href="mailto:tianmj999@gmail.com?subject=你好&body=欢迎~"
            class="connection-item"
          >
            <img src="@/assets/gmail.svg" alt="gmail" srcset="" />
          </a>
        </div>
        <div v-if="isPhone" style="padding-top: 16px">
          <a href="https://beian.miit.gov.cn/" class="link" target="_blank"
            >蜀ICP备2024098546号</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LottieAnimation from "@/components/LottieAnimation.vue";
import animation2 from "@/assets/animation2.json?url";
import { useMediaQuery } from "@vueuse/core";
import { ElTooltip } from "element-plus";

const isPhone = useMediaQuery("(max-width: 768px)");
</script>

<style lang="scss" scoped>
@use "@/mixins.scss";

#me {
  width: 100%;
  padding: 0 16px 16px;
  box-sizing: border-box;
  .content {
    background-color: rgba(217, 217, 217, 0.3);
    border-radius: 12px;
    display: flex;
    flex-wrap: wrap;
    .row-item {
      width: 50%;
      box-sizing: border-box;
      @media (max-width: 768px) {
        width: 100%;
        &.left {
          padding-left: 0;
          .top-contetn {
            padding: 0 16px;
            align-items: center;
          }
        }
      }
    }
    .left {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      padding-left: 12%;
      padding-bottom: 16px;
      .top-contetn {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
      .stack-box {
        display: flex;
        align-items: flex-start;
        line-height: 24px;
        min-height: 80px;
        font-size: 14px;
        color: #252525;
        @include mixins.system-theme(dark) {
          color: #eaeaea;
        }
        width: 100%;
        gap: 12px;
        .stack-list {
          width: 0;
          flex: 1;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          .stack-icon {
            width: auto;
            height: 24px;
          }
        }
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: 16px;
      .connection {
        height: 0;
        flex: 1;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        flex-wrap: wrap;
        padding: 0 16px;
        gap: 12px;
        .connection-item {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          & > img {
            width: 24px;
            height: 24px;
            object-fit: contain;
          }
        }
      }
    }

    .lottie-box {
      width: 120px;
      height: 120px;
    }
    .link {
      text-decoration: none;
      font-size: 14px;
      color: #666;
      @include mixins.system-theme(dark) {
        color: #999;
      }
      &:hover {
        color: #ff6a00;
      }
    }
  }
}
</style>
