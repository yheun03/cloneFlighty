<script setup>
defineProps({
    label: { type: String, default: "조회 기간" },
    // 탭에 표시할 문자열 목록입니다. v-model도 같은 문자열을 사용합니다.
    items: { type: Array, required: true },
});
const selected = defineModel({ type: String, default: "ALL-TIME" });
</script>

<template>
    <div
        class="fc-periods"
        role="group"
        :aria-label="label"
    >
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
