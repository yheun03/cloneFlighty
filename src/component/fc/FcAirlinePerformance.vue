<script setup>
import { computed, ref } from "vue";

import FcIcon from "./FcIcon.vue";
import BaseButton from "../base/BaseButton.vue";

import {
    defaultAirlineLogo,
    getAirline,
} from "../../common/airlines.js";
import shareIcon from "../../assets/icons/lucide/share-2.svg";

const props = defineProps({
    section: {
        type: String,
        default: "all",
        validator: (value) =>
            ["all", "airline", "airport", "mine", "delays"].includes(value),
    },
    report: { type: Object, required: true },
});

const showAll = ref(false);
const showDelays = ref(false);

const isAirport = computed(() => props.section === "airport");
const performanceTitle = computed(() =>
    isAirport.value ? "Airport Performance" : "Airline Performance",
);
const performanceHeadline = computed(() =>
    isAirport.value
        ? props.report.airportHeadline
        : props.report.airlineHeadline,
);
const visiblePerformance = computed(() => {
    const items = isAirport.value
        ? props.report.airports
        : props.report.airlines;
    return showAll.value ? items : items.slice(0, 5);
});
const visibleDelays = computed(() =>
    showDelays.value ? props.report.delays : props.report.delays.slice(0, 4),
);

function airlineLogo(value) {
    return getAirline(value)?.logo || defaultAirlineLogo;
}
</script>

<template>
    <div class="fc-performance">
        <template v-if="['all', 'airline', 'airport'].includes(section)">
            <div class="fc-stat-head">
                <h2>{{ performanceTitle }}</h2>
                <BaseButton label="Share" :icon="shareIcon" size="sm" variant="fill" tone="default" />
            </div>
            <div class="fc-performance__headline">
                <strong>{{ performanceHeadline }}</strong>
                <span>
                    {{ isAirport ? "late departures" : "late arrivals" }}
                </span>
            </div>
            <div v-for="item in visiblePerformance" :key="item.name" class="fc-performance__bar">
                <div>
                    <span>
                        <FcIcon :src="airlineLogo(item.name)" />
                        &nbsp;{{ item.name }}
                    </span>
                    <span>{{ item.percent }}% &nbsp;({{ item.count }})</span>
                </div>
                <i><b :style="{ width: `${item.percent}%` }"></b></i>
            </div>
            <button type="button" class="fc-stat-more" :aria-expanded="showAll" @click="showAll = !showAll">
                {{ showAll ? "Show Less" : "Show More" }}
            </button>
        </template>
        <template v-if="['all', 'mine'].includes(section)">
            <div class="fc-stat-head">
                <h2>My Performance</h2>
                <BaseButton label="Share" :icon="shareIcon" size="sm" variant="fill" tone="default" />
            </div>
            <div class="fc-performance__headline">
                <strong>{{ report.cumulative }}</strong>
                <span>late</span>
            </div>
            <p>cumulative arrival performance</p>
            <div v-for="item in report.performance" :key="item.label" class="fc-performance__meter">
                <span>{{ item.label }}</span>
                <i>
                    <b :style="{
                        width: `${item.value}%`,
                        background: item.color,
                    }"></b>
                </i>
                <strong>{{ item.value }}%</strong>
            </div>
        </template>
        <template v-if="['all', 'delays'].includes(section)">
            <div class="fc-stat-head">
                <h2>Arrival Delays</h2>
                <BaseButton label="Share" :icon="shareIcon" size="sm" variant="fill" tone="default" />
            </div>
            <div class="fc-stat-number">
                <strong>{{ report.delayTotal }}</strong>
                <span>total</span>
            </div>
            <div v-for="flight in visibleDelays" :key="flight.flight" class="fc-performance__delay">
                <span>
                    <FcIcon :src="airlineLogo(flight.flight)" />
                    {{ flight.flight }}
                </span>
                <b>{{ flight.duration }}</b>
                <span>{{ flight.route }}</span>
                <small>{{ flight.date }}</small>
            </div>
            <button type="button" class="fc-stat-more" :aria-expanded="showDelays" @click="showDelays = !showDelays">
                {{ showDelays ? "Show Less" : "Show More" }}
            </button>
        </template>
    </div>
</template>
