<script setup lang="ts">
import Header from "@/widgets/Header.vue";
import Footer from "./widgets/Footer.vue";
import Home from "@/widgets/Home.vue";
import About from "@/widgets/About.vue";
import Project from "@/widgets/Project.vue";
</script>

<template>
  <Header />
  <div class="body">
    <Home />
    <About />
    <Project />
  </div>
  <Footer />
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
