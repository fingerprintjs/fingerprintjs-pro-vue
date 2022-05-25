<script setup lang="ts">
import type { VisitorData } from '@fingerprintjs/fingerprintjs-pro-vue-v3';

const props = defineProps<{
  visitorData: VisitorData;
}>();
</script>

<template>
  <div class="output-holder">
    <div class="output">
      <pre>
        {{ JSON.stringify(props.visitorData, null, 4) }}
      </pre>
    </div>
  </div>
</template>

<style scoped>
pre {
  text-align: left;
}

.output-holder {
  margin-top: 1rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.output {
  width: 90%;
  height: auto;
  box-sizing: border-box;
  background: #282c34;
  box-shadow: 0 0 1.25em rgba(0, 0, 0, 0.2);
  border-radius: 0.7em;
  padding: 1em 1.25em;
  color: #e1e5ea;
  overflow: auto;
  text-align: center;
}
</style>
