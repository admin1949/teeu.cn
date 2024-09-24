<template>
  <div class="exter-box">
    <button class="extra">
      <span class="mask-icon more"></span>
    </button>
    <div class="menu">
      <div class="menu-group">
        <div class="group-item">
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
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.exter-box {
  position: relative;
  .extra {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 44px;
    height: var(--nav-height);
    padding: 0;
    font-family: inherit;
    background-color: transparent;
    background-image: none;
    border: 0;
    line-height: inherit;
    color: inherit;
    cursor: pointer;
    .more {
      --icon: url("@/assets/more.svg");
    }
  }
  .menu {
    opacity: 0;
    visibility: hidden;
    transform: translate(0, 0);
    position: absolute;
    z-index: 2;
    top: calc(var(--nav-height) / 2 + 20px);
    right: 0;
    transition: opacity 0.25s, visibility 0.25s, transform 0.25s;
    .menu-group {
      border-radius: 12px;
      padding: 12px;
      min-width: 128px;
      border: 1px solid var(--c-divider);
      background-color: var(--c-bg);
      box-shadow: var(--shadow-3);
      transition: background-color 0.5s;
      max-height: calc(100vh - var(--nav-height));
      overflow-y: auto;
      .group-item {
        padding: 11px 12px 12px;
        display: flex;
        gap: 12px;
        .link {
          color: inherit;
        }
        & + .group-item {
          border-top: 1px solid var(--c-divider);
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
  &:hover {
    .menu {
      opacity: 1;
      visibility: visible;
    }
  }
}
</style>
