<script setup>
import { ref } from 'vue'
import ActionButton from './ActionButton.vue'

defineProps({ distance: { type: String, default: '73,650' }, miles: { type: String, default: '45,764' } })
const expanded = ref(false)
const breakdown = [{ label: 'Days', value: '4.6' }, { label: 'Weeks', value: '4.6' }, { label: 'Months', value: '4.6' }, { label: 'Years', value: '4.6' }, { label: 'Avg. Flight Time', value: '5h 28m' }, { label: 'In Air', value: '4.6' }]
</script>

<template>
  <div class="fc-distance">
    <div class="fc-stat-head">
      <h2>Flight Distance</h2>
      <ActionButton label="Share" icon="↥" variant="outline" />
    </div>
    <div class="fc-stat-number"><strong>{{ distance }}</strong><span>km</span></div>
    <p>{{ miles }} mi</p>
    <div v-if="expanded" class="fc-distance__breakdown">
      <div v-for="item in breakdown" :key="item.label"><span>{{ item.label }}</span><strong>{{ item.value }}</strong>
      </div>
    </div>
    <div v-else class="fc-distance__comparisons"><strong>Average distance: 3,682 km</strong><span>🌎 <b>1.8x Around
          Earth</b></span><span>🌕 <b>0.2x To the Moon</b></span><span>☀️ <b>0.02x Around the Sun</b></span></div>
    <button type="button" class="fc-stat-more" @click="expanded = !expanded">{{ expanded ? 'Show Summary' : 'Show
      Breakdown' }}</button>
    <div class="fc-distance__flight">
      <h3>Shortest flight</h3><strong>Jeju → Seoul <span>451 km</span></strong><small>KE 1238 · 2 Jun 2017</small>
    </div>
    <div class="fc-distance__flight">
      <h3>Longest flight</h3><strong>Seoul → Los Angeles <span>9,647 km</span></strong><small>OZ 202 · 2 Jun
        2017</small>
    </div>
  </div>
</template>
