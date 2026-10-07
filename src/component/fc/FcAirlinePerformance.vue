<script setup>
import FcIcon from "./FcIcon.vue";
import shareIcon from "../../assets/icons/lucide/share-2.svg";
import airlineIcon from "../../assets/icons/lucide/circle.svg";
import { ref } from "vue";
import BaseButton from "../base/BaseButton.vue";

defineProps({
    section: { type: String, default: "all" },
    report: { type: Object, required: true },
});
const showAll = ref(false);
const showDelays = ref(false);
</script>

<template>
    <div class="fc-performance">
        <template v-if="['all', 'airline', 'airport'].includes(section)">
            <div class="fc-stat-head">
                <h2>
                    {{
                        section === "airport"
                            ? "Airport Performance"
                            : "Airline Performance"
                    }}
                </h2>
                <BaseButton label="Share" :icon="shareIcon" variant="outline" />
            </div>
            <div class="fc-performance__headline">
                <strong>{{
                    section === "airport"
                        ? report.airportHeadline
                        : report.airlineHeadline
                }}</strong
                ><span>{{
                    section === "airport" ? "late departures" : "late arrivals"
                }}</span>
            </div>
            <div
                v-for="item in (section === 'airport'
                    ? report.airports
                    : report.airlines
                ).slice(0, showAll ? undefined : 5)"
                :key="item.name"
                class="fc-performance__bar"
            >
                <div>
                    <span>
                        <FcIcon :src="airlineIcon" /> &nbsp;{{
                            item.name
                        }} </span
                    ><span>{{ item.percent }}% &nbsp;({{ item.count }})</span>
                </div>
                <i><b :style="{ width: `${item.percent}%` }"></b></i>
            </div>
            <button
                type="button"
                class="fc-stat-more"
                :aria-expanded="showAll"
                @click="showAll = !showAll"
            >
                {{ showAll ? "Show Less" : "Show More" }}
            </button>
        </template>
        <template v-if="['all', 'mine'].includes(section)">
            <div class="fc-stat-head">
                <h2>My Performance</h2>
                <BaseButton label="Share" :icon="shareIcon" variant="outline" />
            </div>
            <div class="fc-performance__headline">
                <strong>{{ report.cumulative }}</strong
                ><span>late</span>
            </div>
            <p>cumulative arrival performance</p>
            <div
                v-for="item in report.performance"
                :key="item.label"
                class="fc-performance__meter"
            >
                <span>{{ item.label }}</span
                ><i
                    ><b
                        :style="{
                            width: `${item.value}%`,
                            background: item.color,
                        }"
                    ></b></i
                ><strong>{{ item.value }}%</strong>
            </div>
        </template>
        <template v-if="['all', 'delays'].includes(section)">
            <div class="fc-stat-head">
                <h2>Arrival Delays</h2>
                <BaseButton label="Share" :icon="shareIcon" variant="outline" />
            </div>
            <div class="fc-stat-number">
                <strong>{{ report.delayTotal }}</strong
                ><span>total</span>
            </div>
            <div
                v-for="flight in report.delays.slice(
                    0,
                    showDelays ? undefined : 4,
                )"
                :key="flight.flight"
                class="fc-performance__delay"
            >
                <span> <FcIcon :src="airlineIcon" /> {{ flight.flight }} </span
                ><b>{{ flight.duration }}</b
                ><span>{{ flight.route }}</span
                ><small>{{ flight.date }}</small>
            </div>
            <button
                type="button"
                class="fc-stat-more"
                :aria-expanded="showDelays"
                @click="showDelays = !showDelays"
            >
                {{ showDelays ? "Show Less" : "Show More" }}
            </button>
        </template>
    </div>
</template>
