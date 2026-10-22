<script setup>
import { computed, ref } from "vue";

import BaseIcon from "../base/BaseIcon.vue";
import BaseButton from "../base/BaseButton.vue";
import BaseTabItem from "../base/BaseTabItem.vue";

import { defaultAirlineLogo, getAirline } from "../../common/airlines.js";
import airports from "../../common/airports.js";
import shareIcon from "../../assets/figma/share.svg";
import { formatDistance, locale } from "../../common/preferences.js";

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
            a.name.localeCompare(b.name, locale.value),
    );
    const items = expanded.value ? sorted : sorted.slice(0, props.limit);
    return items.map((item) => ({
        ...item,
        logo:
            props.type === "airline"
                ? getAirline(item.iata || item.name)?.logo || defaultAirlineLogo
                : props.type === "airport"
                  ? airports[item.iata || item.name]?.flagIcon
                  : "",
        width: `${(item[metricKey.value] / maximum.value) * 100}%`,
        label:
            metric.value === "Flights"
                ? item.flights
                : formatDistance(item.distance, { compact: true }),
    }));
});
</script>

<template>
    <div class="fc-top-airlines">
        <div class="fc-stat-head">
            <h2>{{ $t(title) }}</h2>
            <BaseButton
                :label="$t('Share')"
                :icon="shareIcon"
                size="md"
                variant="fill"
                tone="gray"
            />
        </div>
        <div class="fc-stat-number">
            <strong>{{ $t(total) }}</strong>
            <span>{{ $t(unit) }}</span>
        </div>
        <BaseTabItem
            v-if="hasTabs"
            v-model="metric"
            class="fc-top-airlines__tabs"
            :items="metrics"
            :label="$t('{title} statistics metric', { title: $t(title) })"
            size="sm"
            type="radio"
        />
        <div
            v-for="item in chartItems"
            :key="item.name"
            class="fc-top-airlines__bar"
        >
            <span
                class="fc-top-airlines__label"
                :title="$t(item.name)"
            >
                <BaseIcon
                    v-if="item.logo"
                    :src="item.logo"
                    variant="image"
                />
                <template v-if="type !== 'airline' || !item.logo">
                    {{
                        type === "airline"
                            ? item.iata || $t(item.name)
                            : $t(item.name)
                    }}
                </template>
                <span
                    v-if="type === 'airline' && item.logo"
                    class="sr-only"
                >
                    {{ $t(item.name) }}
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
            <small>{{ $t(item.label) }}</small>
        </div>
        <button
            type="button"
            class="fc-stat-more"
            :aria-expanded="expanded"
            @click="expanded = !expanded"
        >
            {{ $t(expanded ? "Show Less" : "Show More") }}
        </button>
    </div>
</template>
