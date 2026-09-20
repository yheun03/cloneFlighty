<script setup>
import shareIcon from '../assets/icons/lucide/share-2.svg'
import BaseButton from './BaseButton.vue'
defineProps({ tail: { type: String, default: 'HL-8078' }, flights: { type: Number, default: 2 }, model: { type: String, default: 'A359' } })
</script>

<template>
    <div class="fc-frequent-tails">
        <div class="fc-stat-head">
            <h2>Most Frequent Tails</h2>
            <BaseButton label="Share" :icon="shareIcon" variant="outline" />
        </div><strong>{{ tail }}</strong>
        <p>{{ flights }} flights</p><small>OZ · {{ model }}</small><span>🇰🇷</span>
    </div>
</template>
