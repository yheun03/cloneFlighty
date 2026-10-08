<script setup>
import { computed, ref } from "vue";

import FcIcon from "./FcIcon.vue";
import BaseButton from "../base/BaseButton.vue";

import shareIcon from "../../assets/icons/lucide/share-2.svg";
import airlineIcon from "../../assets/icons/lucide/circle.svg";

const props = defineProps({
    title: { type: String, default: "Top Airlines" },
    total: { type: [Number, String], default: 0 },
    unit: { type: String, default: "total airlines" },
    showNames: { type: Boolean, default: false },
    showTabs: { type: Boolean, default: true },
    color: { type: String, default: "var(--fc-chart-purple)" },
    limit: { type: Number, default: 3 },
    // 차트 항목: { name, flights, distance }. distance의 단위는 km입니다.
    items: { type: Array, required: true },
});

const metrics = ["Flights", "Distance"];
const metric = ref(metrics[0]);
const expanded = ref(false);

const metricKey = computed(() =>
    metric.value === "Flights" ? "flights" : "distance",
);
const maximum = computed(() =>
    Math.max(1, ...props.items.map((item) => item[metricKey.value])),
);
const chartItems = computed(() => {
    const items = expanded.value
        ? props.items
        : props.items.slice(0, props.limit);
    return items.map((item) => ({
        ...item,
        width: `${(item[metricKey.value] / maximum.value) * 100}%`,
        label:
            metric.value === "Flights"
                ? item.flights
                : `${Math.round(item.distance / 1000)}k km`,
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
                variant="outline"
            />
        </div>
        <div class="fc-stat-number">
            <strong>{{ total }}</strong>
            <span>{{ unit }}</span>
        </div>
        <div
            v-if="showTabs"
            class="fc-top-airlines__tabs"
            role="group"
            aria-label="항공사 통계 기준"
        >
            <button
                v-for="tab in metrics"
                :key="tab"
                type="button"
                :class="{ 'is-active': metric === tab }"
                :aria-pressed="metric === tab"
                @click="metric = tab"
            >
                {{ tab }}
            </button>
        </div>
        <div
            v-for="item in chartItems"
            :key="item.name"
            class="fc-top-airlines__bar"
        >
            <span>
                <template v-if="showNames">{{ item.name }}</template>
                <FcIcon
                    v-else
                    :src="airlineIcon"
                />
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
