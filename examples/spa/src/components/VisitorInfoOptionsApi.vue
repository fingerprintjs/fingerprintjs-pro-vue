<script lang="ts">
import { defineComponent } from 'vue';
import type { VisitorData as Data } from '@fingerprintjs/fingerprintjs-pro-spa';
import VisitorInfoSection from './VisitorInfoSection.vue';

export default defineComponent({
  components: { VisitorInfoSection },
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
        console.log('Fetched data using Options API', currentData);
      }
    },
  },
  methods: {
    async getData() {
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
  <visitor-info-section
    button-text="Get visitor data using Options API"
    :is-loading="isLoading"
    :error="error"
    :data="visitorData"
    @btn-click="getData"
  />
</template>
