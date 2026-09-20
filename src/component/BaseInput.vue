<script setup>
const value = defineModel({ type: String, default: '' })
</script>

<template>
    <input v-model="value" />
</template>
