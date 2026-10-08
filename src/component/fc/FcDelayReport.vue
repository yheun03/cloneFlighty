<script setup>
import { computed } from "vue";

import FcIcon from "./FcIcon.vue";

import brandIcon from "../../assets/icons/lucide/square.svg";

const props = defineProps({
    delayed: { type: Number, required: true },
    total: { type: Number, required: true },
    worstDelay: { type: String, required: true },
    worstAirline: { type: String, required: true },
    lostMinutes: { type: Number, required: true },
});

const delayedPercent = computed(() =>
    props.total ? Math.round((props.delayed / props.total) * 100) : 0,
);
const averageDelay = computed(() =>
    props.delayed ? Math.round(props.lostMinutes / props.delayed) : 0,
);
const lostTime = computed(
    () => `${Math.floor(props.lostMinutes / 60)}h ${props.lostMinutes % 60}m`,
);
</script>

<template>
    <div class="fc-delay-report">
        <div class="fc-delay-report__brand">
            <FcIcon :src="brandIcon" />
            Flighty
            <strong>All-Time Delay Report</strong>
        </div>
        <strong class="fc-delay-report__percent">{{ delayedPercent }}%</strong>
        <h2>My flights delayed</h2>
        <p>
            {{ delayed }} of my {{ total }} flights arrived later than scheduled
        </p>
        <div class="fc-delay-report__stripe"></div>
        <h3>Lost to Delays</h3>
        <p>
            Delayed flights averaged
            {{ averageDelay }}m late
        </p>
        <strong class="fc-delay-report__big">{{ lostTime }}</strong>
        <h3>Worst Delay</h3>
        <p>{{ worstDelay }}</p>
        <div class="fc-delay-report__stripe"></div>
        <h3>Worst Airline</h3>
        <p>{{ worstAirline }}</p>
    </div>
</template>
