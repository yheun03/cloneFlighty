<script setup>
import shareIcon from '../assets/icons/lucide/share-2.svg'
import { ref } from 'vue'
import BaseButton from './BaseButton.vue'

const expanded = ref(false)
const countries = [{ flag: '🇰🇷', name: 'South Korea', count: 16 }, { flag: '🇳🇱', name: 'Netherlands', count: 16 }, { flag: '🇺🇸', name: 'United States', count: 16 }, { flag: '🇯🇵', name: 'Japan', count: 7 }, { flag: '🇸🇬', name: 'Singapore', count: 5 }]
const regions = ['Asia', 'Europe', 'N. America', 'Africa', 'C. America', 'Caribbean', 'Middle East', 'Oceania', 'S. America']
</script>

<template>
    <div class="fc-countries">
        <div class="fc-stat-head">
            <h2>Countries &amp; Territories</h2>
            <BaseButton label="Share" :icon="shareIcon" variant="outline" />
        </div>
        <div class="fc-stat-number"><strong>11</strong><span>total</span></div>
        <div v-for="country in (expanded ? countries : countries.slice(0, 3))" :key="country.name"
            class="fc-countries__row"><span>{{ country.flag }}</span><strong>{{ country.name }}</strong><small>{{
                country.count }} flights</small></div>
        <button type="button" class="fc-stat-more" @click="expanded = !expanded">{{ expanded ? 'Show Less' : 'Show More'
            }}</button>
        <div class="fc-countries__regions">
            <div v-for="region in regions" :key="region"><strong>{{ region }}</strong><span>5 <small>14%</small></span>
            </div>
        </div>
    </div>
</template>
