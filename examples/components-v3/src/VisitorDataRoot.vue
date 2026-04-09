<script setup lang="ts">
import VisitorInfoCompositionApi from './VisitorInfoCompositionApi.vue'
import VisitorInfoOptionsApi from './VisitorInfoOptionsApi.vue'
</script>

<template>
  <div class="visitor-data-root">
    <VisitorInfoOptionsApi />
    <VisitorInfoCompositionApi />
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
