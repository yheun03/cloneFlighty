<script setup>
import FcIcon from './FcIcon.vue'
import airlineIcon from '../assets/icons/lucide/circle.svg'
import airportIcon from '../assets/icons/lucide/plane.svg'
import nextIcon from '../assets/icons/lucide/arrow-right.svg'
import { computed, ref } from 'vue'
import BaseInput from './BaseInput.vue'

const query = defineModel({ type: String, default: '' })
const items = [
    { title: 'Korean Air', subtitle: 'KE  ·  KAL', avatar: airlineIcon },
    { title: 'John F Kennedy Intl.', subtitle: 'JFK  ·  KJFK  ·  New York', avatar: airportIcon },
    { title: 'Newark Liberty Intl.', subtitle: 'EWR  ·  KEWR  ·  Newark', avatar: airportIcon },
    { title: 'Kempegowda Intl.', subtitle: 'BLR  ·  VOBL  ·  Bengaluru', avatar: airportIcon }
]
const selected = ref('')
const filtered = computed(() => items.filter((item) => `${item.title} ${item.subtitle}`.toLowerCase().includes(query.value.toLowerCase())))
</script>

<template>
    <div class="fc-search">
        <h2>Add Flight</h2>
        <p>Enter airline, airport, or flight</p>
        <BaseInput v-model="query" placeholder="Korean Air, ICN, or KE123" />
        <button v-for="item in filtered" :key="item.title" type="button" class="fc-search__result"
            @click="selected = item.title">
            <span class="fc-search__avatar">
                <FcIcon :src="item.avatar" />
            </span><span><strong>{{ item.title }}</strong><small>{{
                item.subtitle }}</small></span><span>
                <FcIcon :src="nextIcon" />
            </span>
        </button>
        <small v-if="selected" class="fc-search__selected">{{ selected }} 선택됨</small>
    </div>
</template>
