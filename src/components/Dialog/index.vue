<template>
  <Teleport to="body">
    <div v-show="visible" class="dialog-conainer" :style="dialogStyle">
      <Transition name="fade">
        <div class="mask" v-show="show"></div>
      </Transition>

      <Transition
        v-bind="transitionProps"
        @before-enter="onEnter"
        @after-leave="setVisible(false)"
      >
        <div v-show="show" ref="dialog" class="dialog">
          <div class="dialog-header">
            <slot name="header">
              <div class="title">{{ title }}</div>
            </slot>
            <button @click="closeDialog" class="close">
              <div class="container">
                <span class="close-line x-1"></span>
                <span class="close-line x-2"></span>
              </div>
            </button>
          </div>
          <div class="dialog-body">
            <slot></slot>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { offset } from "@/utils/style";
import { addUnit } from "element-plus/es/utils/dom/style";
import type { CSSProperties } from "vue";
import { useTransition } from "./useAnimation";

const { width = "600px", clickPoint } = defineProps<{
  width?: string | number;
  title?: string;
  clickPoint?: [x: number, y: number];
}>();

const visible = defineModel<boolean>({
  default: false,
});

const show = ref(false);
watch(visible, (val) => {
  show.value = val;
});

const setVisible = (v: boolean) => {
  visible.value = v;
};

const transitionProps = useTransition("zoom-fade");

const dialogRef = useTemplateRef("dialog");
const transformOrigin = ref("");
const onEnter = () => {
  nextTick(() => {
    const el = dialogRef.value;
    if (!el) {
      return;
    }

    const off = offset(el);
    transformOrigin.value = clickPoint
      ? `${clickPoint[0] - off.left}px ${clickPoint[1] - off.top}px`
      : "";
  });
};

const dialogStyle = computed((): CSSProperties => {
  return {
    "--width": addUnit(width),
    "--transform-origin": transformOrigin.value,
  };
});

const closeDialog = () => {
  show.value = false;
};
</script>

<style lang="scss" scoped>
@use "./animation.scss";
.dialog-conainer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.45);
  }

  .dialog {
    position: relative;
    width: var(--width, 600px);
    // max-height: 70%;
    max-width: calc(100vw - 32px);
    margin: 0 auto;
    top: 120px;
    border-radius: 8px;
    overflow: hidden;
    background-color: #fff;
    box-shadow: var(--shadow-3);
    transform-origin: var(--transform-origin);
    box-sizing: border-box;
    padding: 20px 24px;
    .dialog-header {
      height: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .close {
        width: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        border: none;
        color: rgb(140, 140, 140);
        background-color: transparent;
        cursor: pointer;
        border-radius: 4px;
        transition: all ease 0.25s;
        padding: 0;
        &:hover {
          background-color: rgba(0, 0, 0, 0.06);
          color: rgb(51, 51, 51);
          .container {
            .x-1 {
              transform: rotateZ(0deg);
            }
            .x-2 {
              transform: rotateZ(0deg);
            }
          }
        }
        .container {
          position: relative;
          width: 24px;
          height: 2px;
          .close-line {
            height: 100%;
            width: 100%;
            background-color: currentColor;
            position: absolute;
            top: 0;
            left: 0;
            transition: all ease 0.25s;
          }
          .x-1 {
            transform: rotateZ(45deg);
          }
          .x-2 {
            transform: rotateZ(-45deg);
          }
        }
      }
    }
  }
}
</style>
