<script setup>
defineProps({
    type: { type: String, default: "text" },
    placeholder: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
});

const value = defineModel({ type: String, default: "" });
</script>

<template>
    <input
        v-model="value"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
    />
</template>
