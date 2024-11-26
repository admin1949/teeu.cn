<script lang="ts" setup>
import { onScopeDispose, ref, watchEffect } from "vue";
import { ElInput, ElForm, ElFormItem } from "element-plus";
import demo1Url from "./worker?worker&url";

const first = ref(1);
const second = ref(1);
const result = ref("");

const worker = new Worker(demo1Url, {
  type: "module",
  name: "demo1-vue-worker",
});

worker.addEventListener("message", (e) => {
  result.value = e.data;
  console.log("Message received from worker");
});

watchEffect(() => {
  const val1 = first.value;
  const val2 = second.value;
  worker.postMessage([val1, val2]);
});

onScopeDispose(() => {
  worker.terminate();
});
</script>

<template>
  <ElForm>
    <ElFormItem label="Multiply number 1:">
      <ElInput v-model="first" />
    </ElFormItem>
    <ElFormItem label="Multiply number 2:">
      <ElInput v-model="second" />
    </ElFormItem>
    <ElFormItem>
      {{ result }}
    </ElFormItem>
  </ElForm>
</template>
