<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import VisitorInfoCompositionApi from './VisitorInfoCompositionApi.vue';
import VisitorInfoOptionsApi from './VisitorInfoOptionsApi.vue';
</script>

<template>
  <div class="visitor-data-root">
    <visitor-info-options-api />
    <visitor-info-composition-api />
  </div>
</template>

<style>
.visitor-data-root {
  display: flex;
}

.visitor-data-root section {
  width: 50%;
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>
