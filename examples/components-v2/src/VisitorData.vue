<script lang="ts">
import type { VisitorData as Data } from '@fingerprintjs/fingerprintjs-pro-vue-v2';
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      isLoading: false,
      visitorData: null,
      error: null,
    } as {
      isLoading: boolean;
      visitorData: Data<true> | null;
      error: Error | null;
    };
  },
  watch: {
    visitorData(currentData) {
      if (currentData) {
        console.log('Fetched data:', currentData);
      }
    },
  },
  methods: {
    async getData() {
      if (!this.$fpjs) {
        return;
      }

      try {
        this.isLoading = true;

        this.visitorData = await this.$fpjs.getVisitorData({
          extendedResult: true,
        });
      } catch (error) {
        this.error = error as Error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
</script>

<template>
  <section>
    <button :disabled="isLoading" @click="getData">Get visitor data</button>
    <p v-if="error" class="error">
      {{ error.message }}
    </p>
    <div v-if="visitorData" class="output-holder">
      <div class="output">
        <pre>
          {{ JSON.stringify(visitorData, null, 4) }}
        </pre>
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  text-align: center;
}

a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}

.error {
  color: red;
}

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
