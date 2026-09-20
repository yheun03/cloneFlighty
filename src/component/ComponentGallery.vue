<script setup>
import { ref } from 'vue'
import ActionButton from './ActionButton.vue'
import ToggleSwitch from './ToggleSwitch.vue'
import ChoiceChip from './ChoiceChip.vue'
import PeriodTabs from './PeriodTabs.vue'
import CountBadge from './CountBadge.vue'
import CalendarPicker from './CalendarPicker.vue'
import ListRow from './ListRow.vue'
import PasteField from './PasteField.vue'
import ConnectionStatus from './ConnectionStatus.vue'
import TerminalTimeline from './TerminalTimeline.vue'
import FlightListItem from './FlightListItem.vue'
import AddFlightSearch from './AddFlightSearch.vue'
import FlightDetails from './FlightDetails.vue'
import PassportOverview from './PassportOverview.vue'
import DelayReport from './DelayReport.vue'
import AircraftStats from './AircraftStats.vue'
import AlertSettings from './AlertSettings.vue'
import CalendarSync from './CalendarSync.vue'
import SettingsMenu from './SettingsMenu.vue'
import AirlinePerformance from './AirlinePerformance.vue'
import SeatStats from './SeatStats.vue'
import FrequentTails from './FrequentTails.vue'
import CountriesStats from './CountriesStats.vue'
import TopAirlines from './TopAirlines.vue'
import FlightDistanceStats from './FlightDistanceStats.vue'

const enabled = ref(true)
const seat = ref('Aisle')
const period = ref('2024')
const day = ref(20)
const reason = ref('')
const completed = ref(false)
const myAlertOptions = [
    { icon: '▣', title: 'Basics', desc: 'The most critical alerts like gate changes, delays, & Cancellations.', color: '#1685ff', enabled: true },
    { icon: '✓', title: 'Above & Beyond', desc: 'Get alerts on inbound aircraft status, connection assistance, and aircraft changes', color: '#00ae70', enabled: false },
    { icon: '◫', title: 'Flight Plans', desc: 'Get a map of the flight path when the pilot files it with authorities.', color: '#ffca2d', enabled: false },
    { icon: '⌁', title: 'Arrival Information', desc: 'Get alerts for landing, gate arrival, and baggage claim.', color: '#ff9d20', enabled: false }
]
const friendAlertOptions = [
    { icon: '♧', title: 'None', desc: 'No alerts please. I’ll just view their flights in the app.', color: '#ff5049' },
    { icon: '⌁', title: 'Just Landed', desc: 'Only notify me when they land.', color: '#00ae70' },
    { icon: '♧', title: 'Basics', desc: 'Add alerts for major disruptions, takeoff, 1h until arrival, and on morning of travel.', color: '#1685ff' },
    { icon: '♧', title: 'Everything', desc: 'Every alert. Check-in, gate change, disruptions, landing, baggage, etc', color: '#ff9d20' }
]
const distanceBreakdown = [
    { label: 'Days', value: '4.6' },
    { label: 'Weeks', value: '4.6' },
    { label: 'Months', value: '4.6' },
    { label: 'Years', value: '4.6' },
    { label: 'Avg. Flight Time', value: '5h 28m' },
    { label: 'In Air', value: '4.6' }
]
const distanceComparisons = [
    { icon: '🌎', text: '1.8x Around Earth' },
    { icon: '🌕', text: '0.2x To the Moon' },
    { icon: '☀️', text: '0.02x Around the Sun' }
]
const shortestFlight = { title: 'Shortest flight', route: 'Jeju → Seoul', distance: '451 km', detail: 'KE 1238 · 2 Jun 2017' }
const longestFlight = { title: 'Longest flight', route: 'Seoul → Los Angeles', distance: '9,647 km', detail: 'OZ 202 · 2 Jun 2017' }
</script>

<template>
    <div class="fc-gallery">
        <h1>Components</h1>
        <div class="fc-gallery__group">
            <h2>Actions</h2>
            <div class="fc-gallery__row">
                <ActionButton label="Share" icon="↥" variant="outline" />
                <ActionButton />
                <ActionButton variant="soft" />
            </div>
        </div>
        <div class="fc-gallery__group">
            <h2>Switch &amp; chips</h2>
            <div class="fc-gallery__row">
                <ToggleSwitch v-model="enabled" label="알림" />
                <ToggleSwitch :model-value="false" label="비활성 상태" />
                <ChoiceChip label="Middle" icon="■" />
                <ChoiceChip label="Middle" icon="■" active filled />
            </div>
        </div>
        <div class="fc-gallery__group">
            <h2>Period &amp; count</h2>
            <PeriodTabs v-model="period" />
            <div class="fc-gallery__row">
                <CountBadge />
                <CountBadge variant="filled" />
                <CountBadge variant="outline" />
            </div>
        </div>
        <div class="fc-gallery__group">
            <h2>Calendar</h2>
            <CalendarPicker v-model="day" />
        </div>
        <div class="fc-gallery__group">
            <h2>People &amp; reason</h2>
            <ListRow title="Kimhj" />
            <ListRow title="Invite a Friend" accent />
            <PasteField v-model="reason" />
            <div class="fc-gallery__row">
                <ChoiceChip v-for="item in ['Aisle', 'Middle', 'Window', 'Pilot', 'Captain', 'Jumpseat']" :key="item"
                    :label="item" icon="■" :active="seat === item" @click="seat = item" />
            </div>
        </div>
        <div class="fc-gallery__group">
            <h2>Connection</h2>
            <ConnectionStatus />
            <TerminalTimeline />
        </div>
        <div class="fc-gallery__group">
            <h2>Flights</h2>
            <FlightListItem />
            <FlightListItem variant="history" />
            <FlightListItem variant="header" />
        </div>
        <div class="fc-gallery__group">
            <AddFlightSearch />
        </div>
        <div class="fc-gallery__group">
            <h2>Flight details &amp; schedule</h2>
            <div class="fc-gallery__row">비행 종료
                <ToggleSwitch v-model="completed" label="비행 종료" />
            </div>
            <FlightDetails :completed="completed" />
        </div>
        <div class="fc-gallery__group">
            <h2>Passport</h2>
            <PassportOverview />
        </div>
        <div class="fc-gallery__group">
            <h2>Delay report</h2>
            <DelayReport />
        </div>
        <div class="fc-gallery__group">
            <h2>Aircraft</h2>
            <AircraftStats />
            <FrequentTails />
        </div>
        <div class="fc-gallery__group">
            <h2>Alerts</h2>
            <AlertSettings title="My Flight Alerts" desc="Pick the notification types you receive for your flights."
                :options="myAlertOptions" />
            <AlertSettings mode="friend" title="Customize Alerts" desc="Customize this per friend in Flighty Friends."
                :options="friendAlertOptions" />
        </div>
        <div class="fc-gallery__group">
            <h2>Calendar &amp; settings</h2>
            <CalendarSync />
            <SettingsMenu />
        </div>
        <div class="fc-gallery__group">
            <h2>Performance</h2>
            <AirlinePerformance />
        </div>
        <div class="fc-gallery__group">
            <h2>Seats</h2>
            <SeatStats />
            <SeatStats mode="class" />
        </div>
        <div class="fc-gallery__group">
            <h2>Travel statistics</h2>
            <CountriesStats />
            <TopAirlines />
            <FlightDistanceStats title="Flight Distance" share-label="Share" share-icon="↥" distance="73,650"
                distance-unit="km" miles="45,764" miles-unit="mi" :breakdown="distanceBreakdown"
                average-label="Average distance: 3,682 km" :comparisons="distanceComparisons"
                summary-label="Show Summary" breakdown-label="Show Breakdown" :shortest-flight="shortestFlight"
                :longest-flight="longestFlight" />
        </div>
    </div>
</template>
