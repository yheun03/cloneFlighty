<script setup>
import FcIcon from './FcIcon.vue'
import nextIcon from '../assets/icons/lucide/chevron-right.svg'
defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    avatar: { type: String, default: '' },
    accent: { type: Boolean, default: false }
})
defineEmits(['click'])
</script>

<template>
    <button type="button" class="fc-list-row" @click="$emit('click')">
        <span class="fc-list-row__avatar">{{ avatar }}</span>
        <span class="fc-list-row__text"><strong :class="{ 'is-accent': accent }">{{ title }}</strong><small
                v-if="subtitle">{{ subtitle }}</small></span>
        <span class="fc-list-row__arrow" aria-hidden="true">
            <FcIcon :src="nextIcon" />
        </span>
    </button>
</template>
