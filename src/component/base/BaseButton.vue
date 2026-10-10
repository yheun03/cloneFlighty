<script setup>
import { computed } from "vue";

import FcIcon from "../fc/FcIcon.vue";

const props = defineProps({
    label: { type: String, default: "" },
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
    iconSize: { type: [String, Number], default: "" },
    type: {
        type: String,
        default: "button",
        validator: (value) => ["button", "submit", "reset"].includes(value),
    },
    disabled: { type: Boolean, default: false },
});

defineEmits(["click"]);
const isIconOnly = computed(() => Boolean(props.icon && !props.label));
const iconStyle = computed(() => {
    if (!props.iconSize) return undefined;

    const size =
        typeof props.iconSize === "number"
            ? `${props.iconSize}px`
            : props.iconSize;
    return { width: size, height: size };
});
</script>

<template>
    <!-- prettier-ignore -->
    <button :type="type" class="fc-button"
        :class="[`fc-button--${size}`, `fc-button--${variant}`, `fc-button--${tone}`, { 'fc-button--icon-only': isIconOnly }]"
        :disabled="disabled" @click="$emit('click', $event)">
        <FcIcon v-if="icon" :src="icon" :style="iconStyle" /><span v-if="label">{{ label }}</span>
    </button>
</template>
