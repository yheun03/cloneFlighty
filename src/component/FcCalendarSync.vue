<script setup>
import FcIcon from './FcIcon.vue'
import calendarIcon from '../assets/icons/lucide/calendar-days.svg'
import nextIcon from '../assets/icons/lucide/chevron-right.svg'
import noticeIcon from '../assets/icons/lucide/shield-check.svg'
import { ref } from 'vue'
import FcToggleSwitch from './FcToggleSwitch.vue'

const importEnabled = ref(true)
const exportEnabled = ref(true)
</script>

<template>
    <div class="fc-calendar-sync">
        <strong>Keep your calendar accurate and flights in sync.</strong>
        <p>Import flights in your calendar for tracking, plus past flights. Export flights with reservation details and
            live
            updating to keep your calendar accurate.</p>
        <div class="fc-calendar-sync__item">
            <div>
                <h3>Import Flights</h3>
                <FcToggleSwitch v-model="importEnabled" label="Import Flights" />
            </div><button type="button">
                <FcIcon :src="calendarIcon" /> &nbsp;Choose Calendars <span>Select&nbsp;
                    <FcIcon :src="nextIcon" />
                </span>
            </button>
        </div>
        <div class="fc-calendar-sync__item">
            <div>
                <h3>Export Flights</h3>
                <FcToggleSwitch v-model="exportEnabled" label="Export Flights" />
            </div><button type="button">
                <FcIcon :src="calendarIcon" /> &nbsp;Choose Calendar <span>Select&nbsp;
                    <FcIcon :src="nextIcon" />
                </span>
            </button>
        </div>
        <div class="fc-calendar-sync__notice">
            <FcIcon :src="noticeIcon" /> &nbsp;<span><strong>Flighty receives minimal
                    data</strong><br />Calendar
                processing is on device, and only events identified for flight import are sent to Flighty.</span>
        </div>
    </div>
</template>
