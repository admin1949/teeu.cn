<template>
  <header class="header">
    <div class="wrapper">
      <div class="container">
        <div class="title">
          <img src="@/assets/logo.svg" class="logo" alt="" />
          <div>MJ</div>
        </div>
        <div class="content">
          <div class="nav-list" ref="nav-list" :style="sizeStyle">
            <div
              class="nav-item"
              :class="{ active: idx === activeIndex }"
              v-for="(i, idx) in achorList"
              :key="i.query"
              @click="handleActiveIdx(idx)"
            >
              {{ i.name }}
            </div>
          </div>
          <Extra class="not-phone"></Extra>
          <Hamburger
            class="only-phone"
            @click="handleChangeOpen"
            :open
          ></Hamburger>
        </div>
      </div>
    </div>

    <div class="divider">
      <div class="divider-line"></div>
    </div>

    <Transition name="fade">
      <div v-show="open" class="nav-screen">
        <div class="container">
          <div class="list">
            <div class="menu-list">
              <a
                v-for="i in achorList"
                :key="i.query"
                @click.stop="handleScrollTo(i.query, true)"
                class="list-item"
                >{{ i.name }}</a
              >
            </div>
            <div class="link-list">
              <a
                class="link"
                href="https://github.com/admin1949/teeu.cn"
                aria-label="github"
                target="_blank"
                rel="noopener"
              >
                <span class="mask-icon social-github"></span>
              </a>

              <a
                class="link"
                href="https://teeu.cn/blog"
                aria-label="teeu-blog"
                target="_blank"
                rel="noopener"
              >
                <span class="social-blog"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>
<script setup lang="ts">
import Hamburger from "@/components/Hamburger.vue";
import { ref } from "vue";
import { useNavList } from "@/hooks/useNavList.ts";
import Extra from "@/components/Extra.vue";

const open = ref(false);
const handleChangeOpen = () => {
  open.value = !open.value;
};

const achorList = [
  { name: "首页", query: "#home" },
  { name: "关于", query: "#about" },
  { name: "项目", query: "#project" },
  { name: "联系", query: "#me" },
];
const { handleActiveIdx, sizeStyle, activeIndex } = useNavList(achorList);

const handleScrollTo = (query: string, hide = false) => {
  const element = document.querySelector(query);
  if (hide) {
    open.value = false;
  }

  if (!element) {
    return;
  }

  const top = element.clientTop - 20;
  window.scrollTo({
    top,
    behavior: "smooth",
  });
};
</script>
<style lang="scss" scoped>
@use "@/mixins.scss";

.header {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: var(--c-bg);
  z-index: 2;
  box-shadow: var(--shadow-2);
  .wrapper {
    padding: 0 8px 0 24px;
    .container {
      display: flex;
      .title {
        display: flex;
        align-items: center;
        gap: 12px;
        height: var(--nav-height);
        font-weight: 700;
        .logo {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }
      }

      .content {
        flex: 1 1 0%;
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        align-items: center;
        .nav-list {
          display: flex;
          font-size: 20px;
          position: relative;

          @include mixins.screen(phone) {
            display: none;
          }

          .nav-item {
            padding: 6px 20px;
            transition: color 0.3s;
            cursor: pointer;
            &:hover {
              color: #61dafb;
            }
            &.active {
              color: rgba(255, 255, 255, 0.87);
            }
          }

          &::after {
            content: "";
            display: block;
            position: absolute;
            width: var(--width, 0);
            height: var(--height, 0);
            top: 0;
            left: 0;
            background-color: #3b3b3b;
            border-radius: 8px;
            position: absolute;
            left: 0;
            bottom: 0;
            z-index: -1;
            transition: transform ease 0.4s;
            transform: translate(var(--left, 0), var(--top, 0));
          }
        }
      }
    }
  }
  .divider-line {
    height: 1px;
    width: 100%;
    transform: scaleY(50%);
    background-color: var(--c-divider);
  }

  .nav-screen {
    display: none;
    position: relative;
    z-index: 2;
    @include mixins.screen(phone) {
      display: block;
    }
    .container {
      position: absolute;
      background-color: #fff;
      align-items: center;
      top: 0;
      left: 0;
      width: 100%;
      height: calc(100vh - var(--nav-height) - 1px);
      box-sizing: border-box;
      padding: 0 32px;
      .list {
        padding: 24px 0 96px;
        max-width: 228px;
        margin: 0 auto;
        .list-item {
          display: block;
          border-bottom: 1px solid var(--c-divider);
          padding: 12px 0 11px;
          line-height: 24px;
          font-size: 14px;
          font-weight: 500;
          color: rgba(60, 60, 67);
          transition: border-color 0.25s, color 0.25s;
          cursor: pointer;
          text-decoration: none;
        }
        .link-list {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 16px;
          gap: 12px;
          .link {
            color: inherit;
          }
          .social-github {
            --icon: url("@/assets/github.svg");
          }

          .social-blog {
            width: 20px;
            height: 20px;
            fill: currentColor;
            background: url("@/assets/vitepress.svg") no-repeat;
            background-size: contain;
            display: block;
          }
        }
      }
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    .container {
      transition: transform 0.25s ease;
    }
  }

  .fade-enter-from,
  .fade-leave-to {
    .container {
      transform: translateY(-8px);
    }
  }
}

.only-phone {
  display: none;
  @include mixins.screen(phone) {
    display: flex;
  }
}
.not-phone {
  display: flex;
  @include mixins.screen(phone) {
    display: none !important;
  }
}
</style>
