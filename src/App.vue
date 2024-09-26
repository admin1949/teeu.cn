<script setup lang="ts">
import Header from "@/widgets/Header.vue";
import Home from "@/widgets/Home.vue";
import About from "@/widgets/About.vue";
import Project from "@/widgets/Project.vue";
import Me from "@/widgets/Me.vue";
</script>

<template>
  <Header />
  <div class="body">
    <Home />
    <About />
    <Project />
    <Me />
  </div>
</template>

<style lang="scss" scoped>
.body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: var(--nav-height);
}
</style>
