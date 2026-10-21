<script setup>
import { computed } from "vue";

import BaseIcon from "./BaseIcon.vue";

import nextIcon from "../../assets/figma/chevron-right.svg";

const props = defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    avatar: { type: String, default: "" },
    image: { type: String, default: "" },
    icon: { type: String, default: "" },
    arrowIcon: { type: String, default: nextIcon },
    variant: {
        type: String,
        default: "default",
        validator: (value) => ["default", "search"].includes(value),
    },
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
    <button
        type="button"
        class="fc-list-row"
        :class="[
            `fc-list-row--${rowShape}`,
            `fc-list-row--${type}`,
            `fc-list-row--${variant}`,
        ]"
        @click="$emit('click')"
    >
        <span
            class="fc-list-row__visual"
            aria-hidden="true"
        >
            <img
                v-if="image"
                :src="image"
                alt=""
            />
            <BaseIcon
                v-else-if="type === 'icon' && icon"
                :src="icon"
            />
            <span v-else-if="avatar">{{ avatar }}</span>
        </span>
        <span class="fc-list-row__wrap">
            <span class="fc-list-row__text">
                <strong :class="{ 'is-accent': accent }">{{ title }}</strong>
                <small v-if="rowShape === 'double' && subtitle">
                    {{ subtitle }}
                </small>
            </span>
            <span
                class="fc-list-row__arrow"
                aria-hidden="true"
            >
                <BaseIcon :src="arrowIcon" />
            </span>
        </span>
    </button>
</template>
