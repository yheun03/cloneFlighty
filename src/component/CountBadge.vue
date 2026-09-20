<script setup>
defineProps({ value: { type: [String, Number], default: 1 }, variant: { type: String, default: 'plain' } })
</script>

<template>
    <span class="fc-count" :class="`fc-count--${variant}`">{{ value }}</span>
</template>
