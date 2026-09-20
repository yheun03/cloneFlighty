<script setup>
import FcIcon from './FcIcon.vue'
defineProps({
    label: { type: String, default: 'Show More' },
    variant: { type: String, default: 'link' },
    icon: { type: String, default: '' }
})
</script>

<template>
    <button type="button" class="fc-button" :class="`fc-button--${variant}`">
        <FcIcon v-if="icon" :src="icon" />{{ label }}
    </button>
</template>
