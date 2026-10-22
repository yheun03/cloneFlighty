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
        validator: (value) =>
            ["tab", "checkbox", "radio", "sort"].includes(value),
    },
});

const selected = defineModel({ default: "" });
const order = defineModel("order", {
    type: String,
    default: "",
    validator: (value) => ["", "desc", "asc"].includes(value),
});

const groupRole = {
    tab: "tablist",
    checkbox: "group",
    radio: "radiogroup",
    sort: "group",
};

function isSelected(item) {
    return props.type === "checkbox"
        ? Array.isArray(selected.value) && selected.value.includes(item)
        : selected.value === item;
}

function selectItem(item) {
    if (props.type === "sort") {
        if (selected.value !== item || !order.value) {
            selected.value = item;
            order.value = "desc";
        } else if (order.value === "desc") {
            order.value = "asc";
        } else {
            selected.value = "";
            order.value = "";
        }
        return;
    }

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
    if (props.type === "sort") {
        return {
            "aria-pressed": isSelected(item),
            "aria-label": `${item}${isSelected(item) ? `: ${order.value === "desc" ? "내림차순" : "오름차순"}` : ""}`,
        };
    }
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
            :role="type === 'sort' ? undefined : type"
            v-bind="itemAria(item)"
            @click="selectItem(item)"
        >
            <BaseIcon
                v-if="icon"
                :src="icon"
            />
            {{ item }}
            <BaseIcon
                v-if="type === 'sort' && isSelected(item) && order"
                src="chevron-right"
                class="fc-tab-item__sort-icon"
                :class="`fc-tab-item__sort-icon--${order}`"
            />
        </button>
    </div>
</template>
