<script setup>
defineProps({
    label: { type: String, default: "조회 기간" },
    items: {
        type: Array,
        required: true,
    },
});
const selected = defineModel({ type: String, default: "ALL-TIME" });
</script>

<template>
    <div class="fc-periods" role="group" :aria-label="label">
        <button
            v-for="item in items"
            :key="item"
            type="button"
            :class="{ 'is-active': selected === item }"
            :aria-pressed="selected === item"
            @click="selected = item"
        >
            {{ item }}
        </button>
    </div>
</template>
