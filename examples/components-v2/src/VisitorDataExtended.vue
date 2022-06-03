<script lang="ts">
import Vue from 'vue';
import { fpjsGetVisitorDataExtendedMixin } from '@fingerprintjs/fingerprintjs-pro-vue-v2';
import VisitorData from './VisitorDataSection.vue';

export default Vue.extend({
  components: { VisitorData },
  mixins: [fpjsGetVisitorDataExtendedMixin],
});
</script>

<template>
  <visitor-data
    label="Get extended user data"
    :is-loading="$data.$visitorDataExtended.isLoading"
    :error="$data.$visitorDataExtended.error"
    :data="$data.$visitorDataExtended.data"
    @get-data="$getVisitorDataExtended"
  />
</template>
