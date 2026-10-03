<script setup>
defineProps({ items: { type: Array, default: () => ['ALL-TIME', '2025', '2024', '2023', '2017'] } })
const selected = defineModel({ type: String, default: 'ALL-TIME' })
</script>

<template>
    <div class="fc-periods" role="group" aria-label="조회 기간">
        <button v-for="item in items" :key="item" type="button" :class="{ 'is-active': selected === item }"
            :aria-pressed="selected === item" @click="selected = item">{{ item }}</button>
    </div>
</template>
