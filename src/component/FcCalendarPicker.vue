<script setup>
import { computed } from 'vue'

const props = defineProps({
    year: { type: Number, default: 2026 },
    month: { type: Number, default: 1 },
    marked: { type: Array, default: () => [11, 13] }
})
const selected = defineModel({ type: Number, default: 20 })
const title = computed(() => new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(props.year, props.month - 1, 1)))
const days = computed(() => {
    const offset = new Date(props.year, props.month - 1, 1).getDay()
    const count = new Date(props.year, props.month, 0).getDate()
    return [...Array(offset).fill(null), ...Array.from({ length: count }, (_, index) => index + 1)]
})
</script>

<template>
    <div class="fc-calendar">
        <h3>{{ title }}</h3>
        <div class="fc-calendar__grid">
            <span v-for="day in ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']" :key="day"
                class="fc-calendar__weekday">{{
                    day }}</span>
            <span v-for="(day, index) in days" :key="index">
                <button v-if="day" type="button"
                    :class="{ 'is-marked': marked.includes(day), 'is-selected': selected === day }"
                    @click="selected = day">{{ day }}</button>
            </span>
        </div>
    </div>
</template>
