<script setup>
import BaseIcon from "./BaseIcon.vue";

const props = defineProps({
    label: { type: String, default: "탭 선택" },
    items: { type: Array, required: true },
    icon: { type: String, default: "" },
    size: {
        type: String,
        default: "md",
        validator: (value) => ["md", "sm"].includes(value),
    },
    variant: {
        type: String,
        default: "fill",
        validator: (value) => ["fill", "stroke", "segment"].includes(value),
    },
    type: {
        type: String,
        default: "tab",
        validator: (value) => ["tab", "checkbox", "radio"].includes(value),
    },
});

const selected = defineModel({ default: "" });

const groupRole = {
    tab: "tablist",
    checkbox: "group",
    radio: "radiogroup",
};

function isSelected(item) {
    return props.type === "checkbox"
        ? Array.isArray(selected.value) && selected.value.includes(item)
        : selected.value === item;
}

function selectItem(item) {
    if (props.type !== "checkbox") {
        selected.value = item;
        return;
    }

    const values = Array.isArray(selected.value) ? selected.value : [];
    selected.value = values.includes(item)
        ? values.filter((value) => value !== item)
        : [...values, item];
}

function itemAria(item) {
    return props.type === "tab"
        ? { "aria-selected": isSelected(item) }
        : { "aria-checked": isSelected(item) };
}
</script>

<template>
    <div
        class="fc-tab-items"
        :class="{ 'fc-tab-items--segment': variant === 'segment' }"
        :role="groupRole[type]"
        :aria-label="label"
    >
        <button
            v-for="item in items"
            :key="item"
            type="button"
            class="fc-tab-item"
            :class="[
                `fc-tab-item--${size}`,
                `fc-tab-item--${variant}`,
                { 'is-active': isSelected(item) },
            ]"
            :role="type"
            v-bind="itemAria(item)"
            @click="selectItem(item)"
        >
            <BaseIcon
                v-if="icon"
                :src="icon"
            />
            {{ item }}
        </button>
    </div>
</template>
