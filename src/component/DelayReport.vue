<script setup>
defineProps({ delayed: { type: Number, default: 8 }, total: { type: Number, default: 20 }, lostMinutes: { type: Number, default: 180 } })
</script>

<template>
    <div class="fc-delay-report">
        <div class="fc-delay-report__brand">■ Flighty <strong>All-Time Delay Report</strong></div>
        <strong class="fc-delay-report__percent">{{ Math.round(delayed / total * 100) }}%</strong>
        <h2>My flights delayed</h2>
        <p>{{ delayed }} of my {{ total }} flights arrived later than scheduled</p>
        <div class="fc-delay-report__stripe"></div>
        <h3>Lost to Delays</h3>
        <p>Delayed flights averaged 20m late</p><strong class="fc-delay-report__big">{{ Math.floor(lostMinutes / 60) }}h
            {{
                lostMinutes % 60 }}m</strong>
        <h3>Worst Delay</h3>
        <div class="fc-delay-report__stripe"></div>
        <h3>Worst Airline</h3>
        <p>Korean Air · 1h late in total</p>
    </div>
</template>
