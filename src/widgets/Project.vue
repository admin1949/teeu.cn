<template>
  <div id="project">
    <img
      src="@/assets/images/cartoon-rocket.webp"
      class="cartoon-rocket"
      alt=""
    />
    <div class="projcet-info">项目介绍</div>
    <div class="project-list">
      <div class="project-item" v-for="i in projects" :key="i.title">
        <div class="project-avater-container">
          <img
            class="project-avater"
            :src="i.avatar"
            :alt="i.title"
            srcset=""
          />
        </div>
        <div class="project-info">
          <div class="name">{{ i.title }}</div>
          <div class="skill-tags" v-if="i.tags.length">
            {{ i.tags.join(" & ") }}
          </div>
          <div class="desc">
            {{ i.desc }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import zxpIcon from "@/assets/images/project/zxp.webp";
import zxpQrcode from "@/assets/images/project/zxp-qrcode.png";

const projects = [
  {
    title: "舟小聘",
    avatar: zxpIcon,
    tags: ["Mobile", "微信小程序"],
    skillTags: ["微信小程序", "Typescript", "@vue/reactivity", "TDesign"],
    desc: "为企业和灵活用工人员打造的在线求职零工平台，企业可在平台发布零工岗位需求，灵活用工人员能通过平台发布自己意向工作和报名零工岗位。",
    pics: [zxpIcon, zxpQrcode],
  },
];
</script>

<style lang="scss" scoped>
@use "@/mixins.scss";

#project {
  display: flex;
  flex-direction: column;
  padding-top: 40px;
  align-items: center;
  .cartoon-rocket {
    width: 100%;
    height: 360px;
    object-fit: contain;
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
  .project-list {
    width: 100%;
    box-sizing: border-box;
    padding: 24px 16px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 32px;

    @include mixins.screen(tv) {
      max-width: 1000px;
      padding: 24px 0;
    }

    @media (max-width: 768px) {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }

    .project-item {
      padding: 12px;
      transition: box-shadow ease 0.25s;
      border-radius: 12px;
      &:hover {
        box-shadow: var(--shadow-3);
        .project-avater-container {
          box-shadow: none;
        }
      }

      .project-avater-container {
        height: 226px;
        border-radius: 8px;
        box-shadow: var(--shadow-3);
        border: 1px solid rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
        overflow: hidden;
        transition: all ease 0.25s;
        .project-avater {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .project-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        padding-top: 8px;
        .name {
          font-weight: 700;
          font-size: 18px;
        }
        .skill-tags {
          background-color: #bae8e8;
          padding: 2px 8px;
          border-radius: 4px;
          color: #fff;
        }
        .desc {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
