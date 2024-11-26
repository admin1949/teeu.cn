<script lang="ts" setup>
import { onScopeDispose, ref, watchEffect } from "vue";
import { ElInput, ElForm, ElFormItem, ElSwitch } from "element-plus";
import demo2Url from "./worker/index?worker&url";
import { Fns } from "./worker/worker-type";
import { WorkerClient } from "./worker/utils/client"

const first = ref("1");
const second = ref("1");
const isAdd = ref(false);
const result = ref("Result: 1");

const worker = new WorkerClient<Fns>(demo2Url, {
  type: "module",
  name: "demo2-vue-worker",
});

watchEffect(() => {
  if (isAdd.value) {
    worker.callRemote("add", [first.value, second.value]).then((val) => {
      result.value = val;
    });
  } else {
    worker.callRemote("multiplication", [first.value, second.value]).then((val) => {
      result.value = val;
    });
  }
});

onScopeDispose(() => {
  worker.dispose();
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
    <ElFormItem label="Model:">
      <ElSwitch v-model="isAdd" activeText="加法" inactive-text="乘法"></ElSwitch>
    </ElFormItem>
    <ElFormItem>
      {{ result }}
    </ElFormItem>
  </ElForm>
</template>
