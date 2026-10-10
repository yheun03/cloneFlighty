<script setup>
import { computed } from "vue";

const props = defineProps({
    label: { type: String, default: "Toggle" },
    disabled: { type: Boolean, default: false },
    type: {
        type: String,
        default: "button",
        validator: (value) => ["button", "checkbox", "radio"].includes(value),
    },
    value: { type: [String, Number, Boolean], default: true },
});

const model = defineModel({ default: false });
const checked = computed(() => {
    if (props.type === "radio") return model.value === props.value;
    if (props.type === "checkbox" && Array.isArray(model.value)) {
        return model.value.includes(props.value);
    }
    return Boolean(model.value);
});

function toggle() {
    if (props.type === "radio") {
        model.value = props.value;
        return;
    }

    if (props.type === "checkbox" && Array.isArray(model.value)) {
        model.value = checked.value
            ? model.value.filter((value) => value !== props.value)
            : [...model.value, props.value];
        return;
    }

    model.value = !checked.value;
}
</script>

<template>
    <button type="button" class="fc-switch" :class="{ 'is-on': checked }" :role="type === 'button' ? 'switch' : type"
        :aria-label="label" :aria-checked="checked" :disabled="disabled" @click="toggle">
        <span></span>
    </button>
</template>
