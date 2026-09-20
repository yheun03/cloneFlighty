<script setup>
const props = defineProps({ mode: { type: String, default: 'seat' } })
const rows = props.mode === 'class'
  ? [{ name: 'Economy', count: 20, percent: 100, color: '#a6b3e8' }, { name: 'Premium Economy', count: 0, percent: 0, color: '#6276c4' }, { name: 'Business', count: 0, percent: 0, color: '#495ba8' }, { name: 'First Class', count: 0, percent: 0, color: '#344486' }]
  : [{ name: 'Aisle', count: 0, percent: 0, color: '#00ae70' }, { name: 'Middle', count: 2, percent: 10, color: '#ff9d20' }, { name: 'Window', count: 18, percent: 90, color: '#087bfa' }]
</script>

<template>
  <div class="fc-seat-stats">
    <div class="fc-stat-head">
      <h2>{{ mode === 'class' ? 'Class and Seat' : 'Favorite Seat' }}</h2>
    </div>
    <div class="fc-seat-stats__ring">
      <div><small>{{ mode === 'class' ? 'Top Class' : 'Top Seat' }}</small><strong>{{ mode === 'class' ? 'Economy' :
          '32K' }}</strong></div>
    </div>
    <div class="fc-seat-stats__list">
      <div v-for="row in rows" :key="row.name"><i :style="{ background: row.color }"></i><strong>{{ row.name
          }}</strong><b>{{ row.count }}</b><span>{{ row.percent }}%</span></div>
    </div>
  </div>
</template>
