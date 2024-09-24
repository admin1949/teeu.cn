<template>
  <button class="hamburger" :class="{ open }" type="button">
    <div class="container">
      <div class="top"></div>
      <div class="middle"></div>
      <div class="bottom"></div>
    </div>
  </button>
</template>

<script setup lang="ts">
const { open = false } = defineProps<{
  open?: boolean;
}>();
</script>

<style lang="scss" scoped>
.hamburger {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: var(--nav-height);
  padding: 0;
  font-family: inherit;
  background-color: transparent;
  background-image: none;
  border: 0;
  line-height: inherit;
  color: inherit;
  .container {
    width: 16px;
    height: 14px;
    overflow: hidden;
    position: relative;

    .top,
    .middle,
    .bottom {
      position: absolute;
      background-color: rgba(60, 60, 67);
      width: 16px;
      height: 2px;
      top: 0;
      left: 0;
      transition: background-color 0.5s, transform 0.25s;
    }

    .middle {
      transform: translate(8px, 6px);
    }

    .bottom {
      transform: translate(4px, 12px);
    }
  }

  &.open {
    .middle {
      transform: translate(16px, 6px);
    }
    .top {
      transform: translate(0, 6px) rotate(225deg);
    }
    .bottom {
      transform: translate(0, 6px) rotate(135deg);
    }
  }
}
</style>
