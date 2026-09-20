<script setup>
const checked = defineModel({ type: Boolean, default: false })
defineProps({ label: { type: String, default: 'Toggle' } })
</script>

<template>
    <button type="button" class="fc-switch" :class="{ 'is-on': checked }" role="switch" :aria-label="label"
        :aria-checked="checked" @click="checked = !checked">
        <span></span>
    </button>
</template>
