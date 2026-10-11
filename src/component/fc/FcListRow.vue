<script setup>
import { computed } from "vue";

import FcIcon from "./FcIcon.vue";

import nextIcon from "../../assets/icons/lucide/chevron-right.svg";

const props = defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    avatar: { type: String, default: "" },
    icon: { type: String, default: "" },
    shape: {
        type: String,
        default: "",
        validator: (value) => ["", "single", "double"].includes(value),
    },
    type: {
        type: String,
        default: "icon",
        validator: (value) => ["icon", "profile"].includes(value),
    },
    accent: { type: Boolean, default: false },
});

defineEmits(["click"]);

const rowShape = computed(
    () => props.shape || (props.subtitle ? "double" : "single"),
);
</script>

<template>
    <button type="button" class="fc-list-row" :class="[`fc-list-row--${rowShape}`, `fc-list-row--${type}`]"
        @click="$emit('click')">
        <span class="fc-list-row__visual" aria-hidden="true">
            <FcIcon v-if="type === 'icon' && icon" :src="icon" />
            <span v-else-if="avatar">{{ avatar }}</span>
        </span>
        <span class="fc-list-row__wrap">
            <span class="fc-list-row__text">
                <strong :class="{ 'is-accent': accent }">{{ title }}</strong>
                <small v-if="rowShape === 'double' && subtitle">{{ subtitle }}</small>
            </span>
            <span class="fc-list-row__arrow" aria-hidden="true">
                <FcIcon :src="nextIcon" />
            </span>
        </span>
    </button>
</template>
