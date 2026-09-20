<script setup>
defineProps({ items: { type: Array, default: () => ['ALL-TIME', '2025', '2024', '2023', '2017'] } })
const selected = defineModel({ type: String, default: 'ALL-TIME' })
</script>

<template>
  <div class="fc-periods">
    <button v-for="item in items" :key="item" type="button" :class="{ 'is-active': selected === item }"
      @click="selected = item">{{ item }}</button>
  </div>
</template>
