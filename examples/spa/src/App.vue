<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import VisitorInfoCompositionApi from './components/VisitorInfoCompositionApi.vue';
import VisitorInfoOptionsApi from './components/VisitorInfoOptionsApi.vue';
</script>

<template>
  <main>
    <visitor-info-options-api />
    <visitor-info-composition-api />
  </main>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

main {
  display: flex;
}

main section {
  width: 50%;
}
</style>
