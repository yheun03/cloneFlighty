<script setup>
defineProps({
    label: { type: String, default: 'Show More' },
    variant: { type: String, default: 'link' },
    icon: { type: String, default: '' }
})
</script>

<template>
    <button type="button" class="fc-button" :class="`fc-button--${variant}`">
        <span v-if="icon" aria-hidden="true">{{ icon }}</span>{{ label }}
    </button>
</template>
