<script setup>
import BaseIcon from "./BaseIcon.vue";

defineProps({
    label: { type: String, required: true },
    icon: { type: String, default: "" },
    active: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
});

defineEmits(["click"]);
</script>

<template>
    <button
        type="button"
        class="fc-chip"
        :class="{ 'is-active': active }"
        :aria-pressed="active"
        :disabled="disabled"
        @click="$emit('click', $event)"
    >
        <span
            v-if="icon"
            class="fc-chip__icon"
            aria-hidden="true"
        >
            <BaseIcon :src="icon" />
        </span>
        <span>{{ label }}</span>
    </button>
</template>
