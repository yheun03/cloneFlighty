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
      <AlertSettings />
      <AlertSettings mode="friend" />
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
      <FlightDistanceStats />
    </div>
  </div>
</template>
