<template>
  <ElTag :effect :type v-for="i in list">{{ i.name }}</ElTag>
</template>

<script setup lang="ts">
import { useListDic, REMOTE_ENUMS } from "@/enums/useRemoteEnum";
import { ElTag, TagProps } from "element-plus";

const {
  enumKey,
  keys,
  spliter = ",",
} = defineProps<{
  enumKey: REMOTE_ENUMS;
  keys: string;
  spliter?: string;
  effect?: TagProps["effect"];
  type?: TagProps["type"];
}>();

const { t } = useListDic(enumKey);
const list = computed(() => {
  const arr = keys
    .split(spliter)
    .filter(Boolean)
    .map((i) => {
      return {
        name: t(i, "-"),
      };
    })
    .filter((i) => i.name);
  return arr;
});
</script>

<style lang="scss" scoped></style>
