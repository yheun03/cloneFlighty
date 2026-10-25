<script setup>
import BaseIcon from "./BaseIcon.vue";
import { t } from "../../common/preferences.js";

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
        default: "radio",
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

function moveSelection(event) {
    if (!["tab", "radio"].includes(props.type)) return;

    const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
    if (!keys.includes(event.key)) return;

    event.preventDefault();
    const buttons = [...event.currentTarget.parentElement.querySelectorAll(".fc-tab-item")];
    const currentIndex = buttons.indexOf(event.currentTarget);
    const lastIndex = buttons.length - 1;
    let nextIndex = currentIndex;

    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = lastIndex;
    if (["ArrowLeft", "ArrowUp"].includes(event.key)) {
        nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
    }
    if (["ArrowRight", "ArrowDown"].includes(event.key)) {
        nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
    }

    buttons[nextIndex]?.focus();
    selectItem(props.items[nextIndex]);
}

function itemAria(item) {
    if (props.type === "sort") {
        return {
            "aria-pressed": isSelected(item),
            "aria-label": `${t(item)}${isSelected(item) ? `: ${t(order.value === "desc" ? "Descending" : "Ascending")}` : ""}`,
        };
    }
    return props.type === "tab"
        ? { "aria-selected": isSelected(item) }
        : { "aria-checked": isSelected(item) };
}

function itemTabindex(item, index) {
    if (!["tab", "radio"].includes(props.type)) return 0;
    return isSelected(item) || (!selected.value && index === 0) ? 0 : -1;
}
</script>

<template>
    <div class="fc-tab-items" :class="{ 'fc-tab-items--segment': variant === 'segment' }" :role="groupRole[type]"
        :aria-label="$t(label)">
        <button v-for="(item, index) in items" :key="item" type="button" class="fc-tab-item" :class="[
            `fc-tab-item--${size}`,
            `fc-tab-item--${variant}`,
            { 'is-active': isSelected(item) },
        ]" :role="type === 'sort' ? undefined : type" :tabindex="itemTabindex(item, index)" v-bind="itemAria(item)"
            @click="selectItem(item)" @keydown="moveSelection">
            <BaseIcon v-if="icon" :src="icon" />
            {{ $t(item) }}
            <BaseIcon v-if="type === 'sort' && isSelected(item) && order" src="chevron-right"
                class="fc-tab-item__sort-icon" :class="`fc-tab-item__sort-icon--${order}`" />
        </button>
    </div>
</template>
