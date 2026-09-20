<script setup>
import { computed, ref } from 'vue'

const query = defineModel({ type: String, default: '' })
const items = [
  { title: 'Korean Air', subtitle: 'KE  ·  KAL', avatar: '◉' },
  { title: 'John F Kennedy Intl.', subtitle: 'JFK  ·  KJFK  ·  New York', avatar: '✈' },
  { title: 'Newark Liberty Intl.', subtitle: 'EWR  ·  KEWR  ·  Newark', avatar: '✈' },
  { title: 'Kempegowda Intl.', subtitle: 'BLR  ·  VOBL  ·  Bengaluru', avatar: '✈' }
]
const selected = ref('')
const filtered = computed(() => items.filter((item) => `${item.title} ${item.subtitle}`.toLowerCase().includes(query.value.toLowerCase())))
</script>

<template>
  <div class="fc-search">
    <h2>Add Flight</h2>
    <p>Enter airline, airport, or flight</p>
    <input v-model="query" placeholder="Korean Air, ICN, or KE123" />
    <button v-for="item in filtered" :key="item.title" type="button" class="fc-search__result"
      @click="selected = item.title">
      <span class="fc-search__avatar">{{ item.avatar }}</span><span><strong>{{ item.title }}</strong><small>{{
        item.subtitle }}</small></span><span>→</span>
    </button>
    <small v-if="selected" class="fc-search__selected">{{ selected }} 선택됨</small>
  </div>
</template>
