<script setup>
import FcIcon from "../fc/FcIcon.vue";

defineProps({
    label: { type: String, default: "Show More" },
    variant: {
        type: String,
        default: "link",
        validator: (value) => ["link", "outline", "soft"].includes(value),
    },
    icon: { type: String, default: "" },
    type: {
        type: String,
        default: "button",
        validator: (value) => ["button", "submit", "reset"].includes(value),
    },
    disabled: { type: Boolean, default: false },
});

defineEmits(["click"]);
</script>

<template>
    <!-- prettier-ignore -->
    <button :type="type" class="fc-button" :class="`fc-button--${variant}`" :disabled="disabled"
        @click="$emit('click', $event)">
        <FcIcon v-if="icon" :src="icon" />{{ label }}
    </button>
</template>
