<script setup>
import { ref } from 'vue'
import PeriodTabs from './PeriodTabs.vue'

defineProps({ total: { type: Number, default: 12 }, mostFlown: { type: String, default: 'A330-300' }, tail: { type: String, default: 'HL-8078' } })
const period = ref('ALL-TIME')
const ages = [{ label: "2000's", value: 25 }, { label: "2010's", value: 19 }, { label: "2020's", value: 6 }]
</script>

<template>
    <div class="fc-aircraft-stats">
        <PeriodTabs v-model="period" />
        <div class="fc-aircraft-stats__numbers">
            <div><span>Total Aircraft</span><strong>{{ total }}</strong><small>55% Airbus</small></div>
            <div><span>Newest Aircraft</span><strong>2 years</strong><small>Embraer 175</small></div>
            <div><span>Oldest Aircraft</span><strong>25 years</strong><small>B737-800</small></div>
        </div>
        <h3>Most flown aircraft</h3>
        <div class="fc-aircraft-stats__featured"><strong>{{ mostFlown }}</strong><span>4 flights · 12 hours</span>
            <div>✈</div>
        </div>
        <h3>Aircraft Age</h3>
        <p>9 years old <small>median age</small></p>
        <div class="fc-aircraft-stats__ages">
            <div v-for="age in ages" :key="age.label"><i :style="{ height: `${age.value * 5}px` }"></i><span>{{
                age.label
                    }}</span></div>
        </div>
        <div class="fc-aircraft-stats__cards">
            <div><strong>Newest Aircraft</strong><b>2 years old</b><span>5/25/2022</span></div>
            <div><strong>Oldest Aircraft</strong><b>25 years old</b><span>11/8/2000</span></div>
        </div>
        <h3>Frequented Tail No.</h3>
        <p>2 flights · {{ tail }}</p>
    </div>
</template>
