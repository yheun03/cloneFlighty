<script setup>
import FcIcon from "./FcIcon.vue";
import brandIcon from "../../assets/icons/lucide/square.svg";
defineProps({
    delayed: { type: Number, default: 8 },
    total: { type: Number, default: 20 },
    lostMinutes: { type: Number, default: 180 },
});
</script>

<template>
    <div class="fc-delay-report">
        <div class="fc-delay-report__brand">
            <FcIcon :src="brandIcon" /> Flighty
            <strong>All-Time Delay Report</strong>
        </div>
        <strong class="fc-delay-report__percent"
            >{{ total ? Math.round((delayed / total) * 100) : 0 }}%</strong
        >
        <h2>My flights delayed</h2>
        <p>
            {{ delayed }} of my {{ total }} flights arrived later than scheduled
        </p>
        <div class="fc-delay-report__stripe"></div>
        <h3>Lost to Delays</h3>
        <p>
            Delayed flights averaged
            {{ delayed ? Math.round(lostMinutes / delayed) : 0 }}m late
        </p>
        <strong class="fc-delay-report__big"
            >{{ Math.floor(lostMinutes / 60) }}h {{ lostMinutes % 60 }}m</strong
        >
        <h3>Worst Delay</h3>
        <p>KE 24 · 1h 05m late</p>
        <div class="fc-delay-report__stripe"></div>
        <h3>Worst Airline</h3>
        <p>Korean Air · 2h 10m late in total</p>
    </div>
</template>
