<script setup>
import { ref } from 'vue'

defineProps({ label: { type: String, default: 'Reason' } })
const value = defineModel({ type: String, default: '' })
const error = ref('')

async function paste() {
  try {
    value.value = await navigator.clipboard.readText()
    error.value = ''
  } catch {
    error.value = '클립보드를 읽을 수 없습니다.'
  }
}
</script>

<template>
  <div class="fc-paste-field">
    <label>{{ label }}</label>
    <div><span aria-hidden="true">■</span><input v-model="value" :aria-label="label" placeholder="PASTE" /><button
        type="button" @click="paste">PASTE</button></div>
    <small v-if="error">{{ error }}</small>
  </div>
</template>
