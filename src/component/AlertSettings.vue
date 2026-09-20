<script setup>
import { reactive, ref } from 'vue'
import ToggleSwitch from './ToggleSwitch.vue'

const props = defineProps({ mode: { type: String, default: 'mine' }, friendName: { type: String, default: '전승민' }, friendEmail: { type: String, default: 'jsm5401@gmail.com' } })
const shared = ref(true)
const selected = ref('Basics')
const options = reactive(props.mode === 'mine'
  ? [
    { icon: '▣', title: 'Basics', text: 'The most critical alerts like gate changes, delays, & Cancellations.', color: '#1685ff', enabled: true },
    { icon: '✓', title: 'Above & Beyond', text: 'Get alerts on inbound aircraft status, connection assistance, and aircraft changes', color: '#00ae70', enabled: false },
    { icon: '◫', title: 'Flight Plans', text: 'Get a map of the flight path when the pilot files it with authorities.', color: '#ffca2d', enabled: false },
    { icon: '⌁', title: 'Arrival Information', text: 'Get alerts for landing, gate arrival, and baggage claim.', color: '#ff9d20', enabled: false }
  ]
  : [
    { icon: '♧', title: 'None', text: 'No alerts please. I’ll just view their flights in the app.', color: '#ff5049' },
    { icon: '⌁', title: 'Just Landed', text: 'Only notify me when they land.', color: '#00ae70' },
    { icon: '♧', title: 'Basics', text: 'Add alerts for major disruptions, takeoff, 1h until arrival, and on morning of travel.', color: '#1685ff' },
    { icon: '♧', title: 'Everything', text: 'Every alert. Check-in, gate change, disruptions, landing, baggage, etc', color: '#ff9d20' }
  ])
</script>

<template>
  <div class="fc-alerts">
    <template v-if="mode === 'friend'">
      <div class="fc-alerts__friend"><span></span>
        <div><strong>{{ friendName }}</strong><small>{{ friendEmail }}</small></div>
      </div>
      <div class="fc-alerts__share">Share My Flights
        <ToggleSwitch v-model="shared" label="Share My Flights" />
      </div>
    </template>
    <h2>{{ mode === 'mine' ? 'My Flight Alerts' : 'Customize Alerts' }}</h2>
    <p>{{ mode === 'mine' ? 'Pick the notification types you receive for your flights.' : 'Customize this per friend in
      Flighty Friends.' }}</p>
    <div v-for="option in options" :key="option.title" class="fc-alerts__option"
      :class="{ 'is-selected': mode === 'friend' && selected === option.title }"
      @click="mode === 'friend' && (selected = option.title)">
      <div><span :style="{ color: option.color }">{{ option.icon }}</span><strong>{{ option.title }}</strong>
        <ToggleSwitch v-if="mode === 'mine'" v-model="option.enabled" :label="option.title" @click.stop />
      </div>
      <p>{{ option.text }}</p>
    </div>
    <button v-if="mode === 'friend'" type="button" class="fc-alerts__remove">Remove Friend</button>
  </div>
</template>
