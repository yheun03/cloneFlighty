<script setup>
import { computed } from "vue";

const props = defineProps({
    mode: {
        type: String,
        default: "seat",
        validator: (value) => ["seat", "class", "reason"].includes(value),
    },
    showTitle: { type: Boolean, default: true },
    topLabel: { type: String, required: true },
    topValue: { type: String, required: true },
    // 통계 행: { name, count, percent, color }
    rows: { type: Array, required: true },
});

const ringBackground = computed(() => {
    const total = props.rows.reduce((sum, row) => sum + row.count, 0);
    if (!total) return "var(--fc-border)";
    let offset = 0;
    const segments = props.rows
        .filter((row) => row.count > 0)
        .map((row) => {
            const start = offset;
            offset += (row.count / total) * 100;
            return `${row.color} ${start}% ${offset}%`;
        });
    return `conic-gradient(${segments.join(", ")})`;
});
</script>

<template>
    <div
        class="fc-seat-stats"
        :class="`fc-seat-stats--${mode}`"
    >
        <div
            v-if="showTitle"
            class="fc-stat-head"
        >
            <h2>
                {{ $t(mode === "class" ? "Class and Seat" : "Favorite Seat") }}
            </h2>
        </div>
        <div
            class="fc-seat-stats__ring"
            :style="{ background: ringBackground }"
        >
            <div>
                <small>{{ $t(topLabel) }}</small>
                <strong>{{ $t(topValue) }}</strong>
            </div>
        </div>
        <div class="fc-seat-stats__list">
            <div
                v-for="row in rows"
                :key="row.name"
            >
                <i :style="{ background: row.color }"></i>
                <strong>{{ $t(row.name) }}</strong>
                <b>{{ $t(row.count) }}</b>
                <span>{{ $t(row.percent) }}%</span>
            </div>
        </div>
    </div>
</template>
