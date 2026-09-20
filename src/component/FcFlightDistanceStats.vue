<script setup>
import FcIcon from './FcIcon.vue'
import { ref } from 'vue'
import BaseButton from './BaseButton.vue'

defineProps({
    title: { type: String, required: true },
    shareLabel: { type: String, required: true },
    shareIcon: { type: String, required: true },
    distance: { type: String, required: true },
    distanceUnit: { type: String, required: true },
    miles: { type: String, required: true },
    milesUnit: { type: String, required: true },
    breakdown: { type: Array, required: true },
    averageLabel: { type: String, required: true },
    comparisons: { type: Array, required: true },
    summaryLabel: { type: String, required: true },
    breakdownLabel: { type: String, required: true },
    shortestFlight: { type: Object, required: true },
    longestFlight: { type: Object, required: true }
})
const expanded = ref(false)
</script>

<template>
    <div class="fc-distance">
        <div class="fc-stat-head">
            <h2>{{ title }}</h2>
            <BaseButton :label="shareLabel" :icon="shareIcon" variant="outline" />
        </div>
        <div class="fc-stat-number"><strong>{{ distance }}</strong><span>{{ distanceUnit }}</span></div>
        <p>{{ miles }} {{ milesUnit }}</p>
        <div v-if="expanded" class="fc-distance__breakdown">
            <div v-for="item in breakdown" :key="item.label"><span>{{ item.label }}</span><strong>{{ item.value
            }}</strong>
            </div>
        </div>
        <div v-else class="fc-distance__comparisons"><strong>{{ averageLabel }}</strong>
            <span v-for="item in comparisons" :key="item.text">
                <FcIcon :src="item.icon" /> <b>{{ item.text }}</b>
            </span>
        </div>
        <button type="button" class="fc-stat-more" @click="expanded = !expanded">{{ expanded ? summaryLabel :
            breakdownLabel }}</button>
        <div class="fc-distance__flight">
            <h3>{{ shortestFlight.title }}</h3><strong>{{ shortestFlight.route }} <span>{{ shortestFlight.distance
            }}</span></strong><small>{{ shortestFlight.detail }}</small>
        </div>
        <div class="fc-distance__flight">
            <h3>{{ longestFlight.title }}</h3><strong>{{ longestFlight.route }} <span>{{ longestFlight.distance
            }}</span></strong><small>{{ longestFlight.detail }}</small>
        </div>
    </div>
</template>
