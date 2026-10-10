<script setup>
defineProps({
    label: { type: String, default: "Toggle" },
    disabled: { type: Boolean, default: false },
});

const checked = defineModel({ type: Boolean, default: false });
</script>

<template>
    <button type="button" class="fc-switch" :class="{ 'is-on': checked }" role="switch" :aria-label="label"
        :aria-checked="checked" :disabled="disabled" @click="checked = !checked">
        <span></span>
    </button>
</template>
