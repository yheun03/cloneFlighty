<script setup>
import FcIcon from "./FcIcon.vue";
import brandIcon from "../../assets/icons/lucide/square.svg";
defineProps({
    delayed: { type: Number, required: true },
    total: { type: Number, required: true },
    worstDelay: { type: String, required: true },
    worstAirline: { type: String, required: true },
    lostMinutes: { type: Number, required: true },
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
        <p>{{ worstDelay }}</p>
        <div class="fc-delay-report__stripe"></div>
        <h3>Worst Airline</h3>
        <p>{{ worstAirline }}</p>
    </div>
</template>
