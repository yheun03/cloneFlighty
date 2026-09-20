<script setup>
import basicsIcon from '../assets/icons/lucide/bell.svg'
import checkIcon from '../assets/icons/lucide/badge-check.svg'
import flightPlanIcon from '../assets/icons/lucide/route.svg'
import arrivalIcon from '../assets/icons/lucide/plane-landing.svg'
import friendIcon from '../assets/icons/lucide/users.svg'
import earthIcon from '../assets/icons/lucide/earth.svg'
import moonIcon from '../assets/icons/lucide/moon.svg'
import sunIcon from '../assets/icons/lucide/sun.svg'
import shareIcon from '../assets/icons/lucide/share-2.svg'
import chipIcon from '../assets/icons/lucide/square.svg'
import { ref } from 'vue'
import BaseButton from './BaseButton.vue'
import FcToggleSwitch from './FcToggleSwitch.vue'
import FcChoiceChip from './FcChoiceChip.vue'
import FcPeriodTabs from './FcPeriodTabs.vue'
import FcCountBadge from './FcCountBadge.vue'
import FcCalendarPicker from './FcCalendarPicker.vue'
import FcListRow from './FcListRow.vue'
import FcPasteField from './FcPasteField.vue'
import FcConnectionStatus from './FcConnectionStatus.vue'
import FcTerminalTimeline from './FcTerminalTimeline.vue'
import FcFlightListItem from './FcFlightListItem.vue'
import FcAddFlightSearch from './FcAddFlightSearch.vue'
import FcFlightDetails from './FcFlightDetails.vue'
import FcPassportOverview from './FcPassportOverview.vue'
import FcDelayReport from './FcDelayReport.vue'
import FcAircraftStats from './FcAircraftStats.vue'
import FcAlertSettings from './FcAlertSettings.vue'
import FcCalendarSync from './FcCalendarSync.vue'
import FcSettingsMenu from './FcSettingsMenu.vue'
import FcAirlinePerformance from './FcAirlinePerformance.vue'
import FcSeatStats from './FcSeatStats.vue'
import FcFrequentTails from './FcFrequentTails.vue'
import FcCountriesStats from './FcCountriesStats.vue'
import FcTopAirlines from './FcTopAirlines.vue'
import FcFlightDistanceStats from './FcFlightDistanceStats.vue'

const enabled = ref(true)
const seat = ref('Aisle')
const period = ref('2024')
const day = ref(20)
const reason = ref('')
const completed = ref(false)
const myAlertOptions = [
    { icon: basicsIcon, title: 'Basics', desc: 'The most critical alerts like gate changes, delays, & Cancellations.', color: '#1685ff', enabled: true },
    { icon: checkIcon, title: 'Above & Beyond', desc: 'Get alerts on inbound aircraft status, connection assistance, and aircraft changes', color: '#00ae70', enabled: false },
    { icon: flightPlanIcon, title: 'Flight Plans', desc: 'Get a map of the flight path when the pilot files it with authorities.', color: '#ffca2d', enabled: false },
    { icon: arrivalIcon, title: 'Arrival Information', desc: 'Get alerts for landing, gate arrival, and baggage claim.', color: '#ff9d20', enabled: false }
]
const friendAlertOptions = [
    { icon: friendIcon, title: 'None', desc: 'No alerts please. I’ll just view their flights in the app.', color: '#ff5049' },
    { icon: arrivalIcon, title: 'Just Landed', desc: 'Only notify me when they land.', color: '#00ae70' },
    { icon: friendIcon, title: 'Basics', desc: 'Add alerts for major disruptions, takeoff, 1h until arrival, and on morning of travel.', color: '#1685ff' },
    { icon: friendIcon, title: 'Everything', desc: 'Every alert. Check-in, gate change, disruptions, landing, baggage, etc', color: '#ff9d20' }
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
    { icon: earthIcon, text: '1.8x Around Earth' },
    { icon: moonIcon, text: '0.2x To the Moon' },
    { icon: sunIcon, text: '0.02x Around the Sun' }
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
                <BaseButton label="Share" :icon="shareIcon" variant="outline" />
                <BaseButton />
                <BaseButton variant="soft" />
            </div>
        </div>
        <div class="fc-gallery__group">
            <h2>Switch &amp; chips</h2>
            <div class="fc-gallery__row">
                <FcToggleSwitch v-model="enabled" label="알림" />
                <FcToggleSwitch :model-value="false" label="비활성 상태" />
                <FcChoiceChip label="Middle" :icon="chipIcon" />
                <FcChoiceChip label="Middle" :icon="chipIcon" active filled />
            </div>
        </div>
        <div class="fc-gallery__group">
            <h2>Period &amp; count</h2>
            <FcPeriodTabs v-model="period" />
            <div class="fc-gallery__row">
                <FcCountBadge />
                <FcCountBadge variant="filled" />
                <FcCountBadge variant="outline" />
            </div>
        </div>
        <div class="fc-gallery__group">
            <h2>Calendar</h2>
            <FcCalendarPicker v-model="day" />
        </div>
        <div class="fc-gallery__group">
            <h2>People &amp; reason</h2>
            <FcListRow title="Kimhj" />
            <FcListRow title="Invite a Friend" accent />
            <FcPasteField v-model="reason" />
            <div class="fc-gallery__row">
                <FcChoiceChip v-for="item in ['Aisle', 'Middle', 'Window', 'Pilot', 'Captain', 'Jumpseat']" :key="item"
                    :label="item" :icon="chipIcon" :active="seat === item" @click="seat = item" />
            </div>
        </div>
        <div class="fc-gallery__group">
            <h2>Connection</h2>
            <FcConnectionStatus />
            <FcTerminalTimeline />
        </div>
        <div class="fc-gallery__group">
            <h2>Flights</h2>
            <FcFlightListItem />
            <FcFlightListItem variant="history" />
            <FcFlightListItem variant="header" />
        </div>
        <div class="fc-gallery__group">
            <FcAddFlightSearch />
        </div>
        <div class="fc-gallery__group">
            <h2>Flight details &amp; schedule</h2>
            <div class="fc-gallery__row">비행 종료
                <FcToggleSwitch v-model="completed" label="비행 종료" />
            </div>
            <FcFlightDetails :completed="completed" />
        </div>
        <div class="fc-gallery__group">
            <h2>Passport</h2>
            <FcPassportOverview />
        </div>
        <div class="fc-gallery__group">
            <h2>Delay report</h2>
            <FcDelayReport />
        </div>
        <div class="fc-gallery__group">
            <h2>Aircraft</h2>
            <FcAircraftStats />
            <FcFrequentTails />
        </div>
        <div class="fc-gallery__group">
            <h2>Alerts</h2>
            <FcAlertSettings title="My Flight Alerts" desc="Pick the notification types you receive for your flights."
                :options="myAlertOptions" />
            <FcAlertSettings mode="friend" title="Customize Alerts" desc="Customize this per friend in Flighty Friends."
                :options="friendAlertOptions" />
        </div>
        <div class="fc-gallery__group">
            <h2>Calendar &amp; settings</h2>
            <FcCalendarSync />
            <FcSettingsMenu />
        </div>
        <div class="fc-gallery__group">
            <h2>Performance</h2>
            <FcAirlinePerformance />
        </div>
        <div class="fc-gallery__group">
            <h2>Seats</h2>
            <FcSeatStats />
            <FcSeatStats mode="class" />
        </div>
        <div class="fc-gallery__group">
            <h2>Travel statistics</h2>
            <FcCountriesStats />
            <FcTopAirlines />
            <FcFlightDistanceStats title="Flight Distance" share-label="Share" :share-icon="shareIcon"
                distance="73,650" distance-unit="km" miles="45,764" miles-unit="mi" :breakdown="distanceBreakdown"
                average-label="Average distance: 3,682 km" :comparisons="distanceComparisons"
                summary-label="Show Summary" breakdown-label="Show Breakdown" :shortest-flight="shortestFlight"
                :longest-flight="longestFlight" />
        </div>
    </div>
</template>
