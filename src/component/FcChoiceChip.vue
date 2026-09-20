<script setup>
import FcIcon from './FcIcon.vue'
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
        <FcIcon v-if="icon" :src="icon" />{{ label }}
    </button>
</template>
