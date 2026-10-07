<script setup>
import shareIcon from "../../assets/icons/lucide/share-2.svg";
import BaseButton from "../base/BaseButton.vue";
defineProps({
    airline: { type: String, required: true },
    flag: { type: String, required: true },
    tail: { type: String, required: true },
    flights: { type: Number, required: true },
    model: { type: String, required: true },
});
</script>

<template>
    <div class="fc-frequent-tails">
        <div class="fc-stat-head">
            <h2>Most Frequent Tails</h2>
            <BaseButton label="Share" :icon="shareIcon" variant="outline" />
        </div>
        <strong>{{ tail }}</strong>
        <p>{{ flights }} flights</p>
        <small>{{ airline }} · {{ model }}</small
        ><span>{{ flag }}</span>
    </div>
</template>
