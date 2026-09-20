<script setup>
import { ref } from 'vue'
import ToggleSwitch from './ToggleSwitch.vue'

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
                <ToggleSwitch v-model="importEnabled" label="Import Flights" />
            </div><button type="button">▣ &nbsp;Choose Calendars <span>Select&nbsp; ›</span></button>
        </div>
        <div class="fc-calendar-sync__item">
            <div>
                <h3>Export Flights</h3>
                <ToggleSwitch v-model="exportEnabled" label="Export Flights" />
            </div><button type="button">▣ &nbsp;Choose Calendar <span>Select&nbsp; ›</span></button>
        </div>
        <div class="fc-calendar-sync__notice">⬡ &nbsp;<span><strong>Flighty receives minimal data</strong><br />Calendar
                processing is on device, and only events identified for flight import are sent to Flighty.</span></div>
    </div>
</template>
