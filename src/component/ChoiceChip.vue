<script setup>
defineProps({
  label: { type: String, required: true },
  icon: { type: String, default: '' },
  active: { type: Boolean, default: false },
  filled: { type: Boolean, default: false }
})
defineEmits(['click'])
</script>

<template>
  <button type="button" class="fc-chip" :class="{ 'is-active': active, 'is-filled': filled }" @click="$emit('click')">
    <span v-if="icon" class="fc-chip__icon" aria-hidden="true">{{ icon }}</span>{{ label }}
  </button>
</template>
