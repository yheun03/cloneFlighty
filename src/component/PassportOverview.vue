<script setup>
import PeriodTabs from './PeriodTabs.vue'
import { ref } from 'vue'

defineProps({
    flights: { type: Number, default: 20 },
    distance: { type: String, default: '73,650 km' },
    flightTime: { type: String, default: '4d 13h' },
    airports: { type: Number, default: 16 },
    airlines: { type: Number, default: 5 }
})
const period = ref('ALL-TIME')
const recent = Array.from({ length: 5 }, (_, index) => ({ id: index, code: 'KE 5926', route: 'AMS → ICN', title: 'Amsterdam to Seoul', date: 'Dec 29, 2025' }))
</script>

<template>
    <div class="fc-passport">
        <PeriodTabs v-model="period" />
        <div class="fc-passport__map"><span>ICN</span><span>🌏</span><span>ICN</span></div>
        <div class="fc-passport__flags">🇰🇷 🇲🇾 🇯🇵 🇩🇪 🇨🇳 🇸🇬 🇳🇱 🇫🇮 🇩🇰 🇸🇪 🇲🇳</div>
        <h2>MY FLIGHTY PASSPORT</h2><small>PASSPORT · PASS · PASPORTE</small>
        <div class="fc-passport__numbers">
            <div><span>FLIGHTS</span><strong>{{ flights }}</strong></div>
            <div><span>FLIGHTS DISTANCE</span><strong>{{ distance }}</strong></div>
            <div><span>FLIGHT TIME</span><strong>{{ flightTime }}</strong></div>
            <div><span>AIRPORTS</span><strong>{{ airports }}</strong></div>
            <div><span>AIRLINES</span><strong>{{ airlines }}</strong></div>
        </div>
        <h3>2025 <small>9 FLIGHTS</small></h3>
        <div v-for="flight in recent" :key="flight.id" class="fc-passport__flight"><span>✈</span>
            <div><small>{{ flight.code }} &nbsp;{{ flight.route }}</small><strong>{{ flight.title }}</strong></div>
            <small>{{
                flight.date }}</small>
        </div>
    </div>
</template>
