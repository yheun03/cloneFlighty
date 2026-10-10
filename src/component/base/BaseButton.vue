<script setup>
import FcIcon from "../fc/FcIcon.vue";

defineProps({
    label: { type: String, default: "Show More" },
    size: {
        type: String,
        default: "md",
        validator: (value) => ["sm", "md", "lg"].includes(value),
    },
    variant: {
        type: String,
        default: "fill",
        validator: (value) => ["fill", "text"].includes(value),
    },
    tone: {
        type: String,
        default: "default",
        validator: (value) =>
            ["default", "red", "gray", "primary"].includes(value),
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
    <button :type="type" class="fc-button"
        :class="[`fc-button--${size}`, `fc-button--${variant}`, `fc-button--${tone}`]" :disabled="disabled"
        @click="$emit('click', $event)">
        <FcIcon v-if="icon" :src="icon" />{{ label }}
    </button>
</template>
