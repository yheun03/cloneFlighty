<script setup>
import ActionButton from './ActionButton.vue'
defineProps({ tail: { type: String, default: 'HL-8078' }, flights: { type: Number, default: 2 }, model: { type: String, default: 'A359' } })
</script>

<template>
  <div class="fc-frequent-tails">
    <div class="fc-stat-head">
      <h2>Most Frequent Tails</h2>
      <ActionButton label="Share" icon="↥" variant="outline" />
    </div><strong>{{ tail }}</strong>
    <p>{{ flights }} flights</p><small>OZ · {{ model }}</small><span>🇰🇷</span>
  </div>
</template>
