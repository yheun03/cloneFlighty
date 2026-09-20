<script setup>
import FcIcon from './FcIcon.vue'
import flightIcon from '../assets/icons/lucide/plane.svg'
import friendIcon from '../assets/icons/lucide/users.svg'
import calendarIcon from '../assets/icons/lucide/calendar-days.svg'
import appearanceIcon from '../assets/icons/lucide/settings.svg'
import nextIcon from '../assets/icons/lucide/chevron-right.svg'
const groups = [
    { label: 'ALERTS', items: [{ icon: flightIcon, title: 'My Flights' }, { icon: friendIcon, title: 'Friends’ Flights' }] },
    { label: 'AUTOMATIONS', items: [{ icon: calendarIcon, title: 'Calendar Sync' }] },
    { label: 'CUSTOMIZE', items: [{ icon: appearanceIcon, title: 'App Appearance' }] }
]
defineEmits(['select'])
</script>

<template>
    <div class="fc-settings">
        <h2>Settings</h2>
        <button class="fc-settings__pro" type="button" @click="$emit('select', 'pro')"><b>PRO</b><span><strong>Flighty
                    Pro</strong><small>Member</small></span>
            <FcIcon :src="nextIcon" />
        </button>
        <div v-for="group in groups" :key="group.label" class="fc-settings__group">
            <h3>{{ group.label }}</h3><button v-for="item in group.items" :key="item.title" type="button"
                @click="$emit('select', item.title)"><span>
                    <FcIcon :src="item.icon" />
                </span>{{ item.title }}<b>
                    <FcIcon :src="nextIcon" />
                </b></button>
        </div>
    </div>
</template>
