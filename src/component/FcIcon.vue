<script setup>
defineProps({ src: { type: String, required: true } })
</script>

<template>
    <span class="fc-icon" :style="{ '--fc-icon-url': `url(${src})` }" aria-hidden="true"></span>
</template>
