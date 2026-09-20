<script setup>
import { ref } from 'vue'
import ActionButton from './ActionButton.vue'

const showAll = ref(false)
const airlines = [
    { name: 'Finnair', percent: 100, count: '1/1' },
    { name: 'KLM', percent: 50, count: '1/2' },
    { name: 'Asiana', percent: 33, count: '1/3' },
    { name: 'Korean Air', percent: 25, count: '1/1' },
    { name: 'Alaska', percent: 10, count: '1/1' }
]
const performance = [
    { label: 'Early', value: 81, color: '#00ae70' },
    { label: 'On Time', value: 80, color: '#53d96c' },
    { label: '15m late', value: 60, color: '#ffca2d' },
    { label: '30m late', value: 40, color: '#ff9d20' },
    { label: '45m+ late', value: 20, color: '#ff5049' }
]
</script>

<template>
    <div class="fc-performance">
        <div class="fc-stat-head">
            <h2>Airline Performance</h2>
            <ActionButton label="Share" icon="↥" variant="outline" />
        </div>
        <div class="fc-performance__headline"><strong>50%</strong><span>late arrivals</span></div>
        <div v-for="item in (showAll ? airlines : airlines.slice(0, 4))" :key="item.name" class="fc-performance__bar">
            <div><span>◉ &nbsp;{{ item.name }}</span><span>{{ item.percent }}% &nbsp;({{ item.count }})</span></div>
            <i><b :style="{ width: `${item.percent}%` }"></b></i>
        </div>
        <button type="button" class="fc-stat-more" @click="showAll = !showAll">{{ showAll ? 'Show Less' : 'Show More'
            }}</button>
        <div class="fc-stat-head">
            <h2>My Performance</h2>
            <ActionButton label="Share" icon="↥" variant="outline" />
        </div>
        <div class="fc-performance__headline"><strong>11m</strong><span>late</span></div>
        <p>cumulative arrival performance</p>
        <div v-for="item in performance" :key="item.label" class="fc-performance__meter"><span>{{ item.label
        }}</span><i><b :style="{ width: `${item.value}%`, background: item.color }"></b></i><strong>{{
                    item.value }}%</strong></div>
        <h2>Arrival Delays</h2>
        <p><strong>8</strong> total</p>
        <div v-for="flight in ['KL 1251', 'KL 6410', 'KL 703', 'AY 911']" :key="flight" class="fc-performance__delay">
            <span>◉ {{ flight }}</span><b>47m</b><span>AMS-HEL</span>
        </div>
    </div>
</template>
