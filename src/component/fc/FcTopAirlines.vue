<script setup>
import FcIcon from "./FcIcon.vue";
import shareIcon from "../../assets/icons/lucide/share-2.svg";
import airlineIcon from "../../assets/icons/lucide/circle.svg";
import { computed, ref } from "vue";
import BaseButton from "../base/BaseButton.vue";

const metric = ref("Flights");
const expanded = ref(false);
const props = defineProps({
    title: { type: String, default: "Top Airlines" },
    total: { type: [Number, String], default: 0 },
    unit: { type: String, default: "total airlines" },
    showNames: { type: Boolean, default: false },
    showTabs: { type: Boolean, default: true },
    color: { type: String, default: "var(--fc-chart-purple)" },
    limit: { type: Number, default: 3 },
    items: { type: Array, required: true },
});
const maximum = computed(() =>
    Math.max(
        1,
        ...props.items.map((item) =>
            metric.value === "Flights" ? item.flights : item.distance,
        ),
    ),
);
</script>

<template>
    <div class="fc-top-airlines">
        <div class="fc-stat-head">
            <h2>{{ title }}</h2>
            <BaseButton label="Share" :icon="shareIcon" variant="outline" />
        </div>
        <div class="fc-stat-number">
            <strong>{{ total }}</strong
            ><span>{{ unit }}</span>
        </div>
        <div
            v-if="showTabs"
            class="fc-top-airlines__tabs"
            role="group"
            aria-label="항공사 통계 기준"
        >
            <button
                v-for="item in ['Flights', 'Distance']"
                :key="item"
                type="button"
                :class="{ 'is-active': metric === item }"
                :aria-pressed="metric === item"
                @click="metric = item"
            >
                {{ item }}
            </button>
        </div>
        <div
            v-for="item in expanded ? items : items.slice(0, limit)"
            :key="item.name"
            class="fc-top-airlines__bar"
        >
            <span>
                <template v-if="showNames">{{ item.name }}</template>
                <FcIcon v-else :src="airlineIcon" /> </span
            ><i
                ><b
                    :style="{
                        width: `${((metric === 'Flights' ? item.flights : item.distance) / maximum) * 100}%`,
                        background: color,
                    }"
                ></b></i
            ><small>{{
                metric === "Flights"
                    ? item.flights
                    : `${Math.round(item.distance / 1000)}k km`
            }}</small>
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
