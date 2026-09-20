<script setup>
import FcIcon from './FcIcon.vue'
import shareIcon from '../assets/icons/lucide/share-2.svg'
import airlineIcon from '../assets/icons/lucide/circle.svg'
import { ref } from 'vue'
import BaseButton from './BaseButton.vue'

const metric = ref('Flights')
const expanded = ref(false)
const items = [{ name: 'Korean Air', flights: 13, distance: 48600 }, { name: 'Asiana', flights: 3, distance: 12000 }, { name: 'KLM', flights: 2, distance: 7800 }, { name: 'Finnair', flights: 2, distance: 5250 }]
</script>

<template>
    <div class="fc-top-airlines">
        <div class="fc-stat-head">
            <h2>Top Airlines</h2>
            <BaseButton label="Share" :icon="shareIcon" variant="outline" />
        </div>
        <div class="fc-stat-number"><strong>9</strong><span>total airlines</span></div>
        <div class="fc-top-airlines__tabs"><button v-for="item in ['Flights', 'Distance']" :key="item" type="button"
                :class="{ 'is-active': metric === item }" @click="metric = item">{{ item }}</button></div>
        <div v-for="item in (expanded ? items : items.slice(0, 3))" :key="item.name" class="fc-top-airlines__bar">
            <span>
                <FcIcon :src="airlineIcon" />
            </span><i><b
                    :style="{ width: `${(metric === 'Flights' ? item.flights / 13 : item.distance / 48600) * 100}%` }"></b></i><small>{{
                        metric === 'Flights' ? item.flights : `${Math.round(item.distance / 1000)}k km` }}</small>
        </div>
        <button type="button" class="fc-stat-more" @click="expanded = !expanded">{{ expanded ? 'Show Less' : 'Show More'
        }}</button>
    </div>
</template>
