<script setup>
import { computed, ref } from "vue";

import BaseIcon from "../base/BaseIcon.vue";
import BaseButton from "../base/BaseButton.vue";
import BaseTabItem from "../base/BaseTabItem.vue";

import { defaultAirlineLogo, getAirline } from "../../common/airlines.js";
import shareIcon from "../../assets/figma/share.svg";

const props = defineProps({
    type: {
        type: String,
        default: "airline",
        validator: (value) =>
            ["airline", "airport", "route", "aircraft"].includes(value),
    },
    title: { type: String, default: "Top Airlines" },
    total: { type: [Number, String], default: 0 },
    unit: { type: String, default: "total airlines" },
    showTabs: { type: Boolean, default: undefined },
    color: { type: String, default: "var(--fc-chart-purple)" },
    limit: { type: Number, default: 3 },
    // 차트 항목: { name, flights, distance }. distance의 단위는 km입니다.
    items: { type: Array, required: true },
});

const metrics = ["Flights", "Distance"];
const metric = ref(metrics[0]);
const expanded = ref(false);

const hasTabs = computed(
    () => props.showTabs ?? ["airline", "route"].includes(props.type),
);
const metricKey = computed(() =>
    metric.value === "Flights" ? "flights" : "distance",
);
const maximum = computed(() =>
    Math.max(1, ...props.items.map((item) => item[metricKey.value])),
);
const chartItems = computed(() => {
    const sorted = [...props.items].sort(
        (a, b) =>
            b[metricKey.value] - a[metricKey.value] ||
            a.name.localeCompare(b.name),
    );
    const items = expanded.value ? sorted : sorted.slice(0, props.limit);
    return items.map((item) => ({
        ...item,
        logo: getAirline(item.iata || item.name)?.logo || defaultAirlineLogo,
        width: `${(item[metricKey.value] / maximum.value) * 100}%`,
        label:
            metric.value === "Flights"
                ? item.flights
                : `${item.distance.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 1 })} km`,
    }));
});
</script>

<template>
    <div class="fc-top-airlines">
        <div class="fc-stat-head">
            <h2>{{ title }}</h2>
            <BaseButton
                label="Share"
                :icon="shareIcon"
                size="md"
                variant="fill"
                tone="gray"
            />
        </div>
        <div class="fc-stat-number">
            <strong>{{ total }}</strong>
            <span>{{ unit }}</span>
        </div>
        <BaseTabItem
            v-if="hasTabs"
            v-model="metric"
            class="fc-top-airlines__tabs"
            :items="metrics"
            :label="`${title} 통계 기준`"
            size="sm"
            type="radio"
        />
        <div
            v-for="item in chartItems"
            :key="item.name"
            class="fc-top-airlines__bar"
        >
            <span :title="item.name">
                <template v-if="type !== 'airline' || !item.logo">
                    {{
                        type === "airline" ? item.iata || item.name : item.name
                    }}
                </template>
                <BaseIcon
                    v-else
                    :src="item.logo"
                />
                <span
                    v-if="type === 'airline' && item.logo"
                    class="sr-only"
                >
                    {{ item.name }}
                </span>
            </span>
            <i>
                <b
                    :style="{
                        width: item.width,
                        background: color,
                    }"
                ></b>
            </i>
            <small>{{ item.label }}</small>
        </div>
        <button
            type="button"
            class="fc-stat-more"
            :aria-expanded="expanded"
            @click="expanded = !expanded"
        >
            {{ expanded ? "Show Less" : "Show More" }}
        </button>
    </div>
</template>
