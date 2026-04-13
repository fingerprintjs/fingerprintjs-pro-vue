<script setup lang="ts">
import { ref } from 'vue'
import {
  applyCacheConfig,
  DURATION_OPTIONS,
  loadCacheConfig,
  STORAGE_OPTIONS,
  type CacheDuration,
  type CacheStorage,
} from './cacheConfig'

const applied = loadCacheConfig()
const storage = ref<CacheStorage>(applied?.storage ?? 'sessionStorage')
const duration = ref<CacheDuration>(applied?.duration ?? 'optimize-cost')
const cacheEnabled = ref<boolean>(Boolean(applied))

const apply = () => {
  applyCacheConfig(cacheEnabled.value ? { storage: storage.value, duration: duration.value } : undefined)
}
</script>

<template>
  <fieldset class="cache-options">
    <legend>Cache options</legend>

    <label class="cache-options__toggle">
      <input v-model="cacheEnabled" type="checkbox" />
      Enable cache
    </label>

    <div class="cache-options__row">
      <label>
        Storage
        <select v-model="storage" :disabled="!cacheEnabled">
          <option v-for="value in STORAGE_OPTIONS" :key="value" :value="value">
            {{ value }}
          </option>
        </select>
      </label>

      <label>
        Duration
        <select v-model="duration" :disabled="!cacheEnabled">
          <option v-for="value in DURATION_OPTIONS" :key="value" :value="value">
            {{ value }}
          </option>
        </select>
      </label>

      <button type="button" @click="apply">Apply &amp; reload</button>
    </div>

    <p class="cache-options__status">
      <span v-if="applied">
        Currently applied: <code>{{ applied.storage }}</code> / <code>{{ applied.duration }}</code>
      </span>
      <span v-else> Currently applied: <code>cache disabled</code> </span>
    </p>
  </fieldset>
</template>

<style scoped>
.cache-options {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 1em 1.25em;
  margin: 0 0 1em;
}

.cache-options legend {
  font-weight: bold;
  padding: 0 0.5em;
}

.cache-options__toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  margin-bottom: 0.75em;
}

.cache-options__row {
  display: flex;
  align-items: flex-end;
  gap: 1em;
  flex-wrap: wrap;
}

.cache-options__row label {
  display: flex;
  flex-direction: column;
  font-size: 0.9em;
  font-weight: bold;
}

.cache-options__row select {
  margin-top: 0.25em;
  padding: 0.25em 0.5em;
  font-weight: normal;
}

.cache-options__row button {
  padding: 0.4em 0.9em;
}

.cache-options__status {
  margin: 0.75em 0 0;
  font-size: 0.9em;
}

.cache-options__status code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
}
</style>
