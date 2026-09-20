<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const airports = JSON.parse(document.querySelector('#airports').textContent)
const route = useRoute()
const router = useRouter()
const from = computed(() => typeof route.query.from === 'string' ? route.query.from.trim().toUpperCase() : 'ICN')
const to = computed(() => typeof route.query.to === 'string' ? route.query.to.trim().toUpperCase() : 'SFO')
const mode = ref('mine')
const search = ref('')
const sidebarOpen = ref(true)
const ownFlights = computed(() => [
  { flight: 'KE 24', from: from.value, to: to.value, date: 'Sat, 20 Jun', days: 21 },
  { flight: 'KE 703', from: 'ICN', to: 'NRT', date: 'Tue, 10 Mar', days: 62 },
  { flight: 'KE 16', from: 'NRT', to: 'SFO', date: 'Sun, 22 Mar', days: 74 }
])
const friendFlights = [
  { flight: 'SK 613', from: 'CDG', to: 'LHR', date: 'Thu, 15 Jan', days: 8 },
  { flight: 'KL 1268', from: 'LHR', to: 'CDG', date: 'Fri, 24 Apr', days: 107 },
  { flight: 'KE 24', from: 'SFO', to: 'ICN', date: 'Sat, 20 Jun', days: 164 }
]
const flights = computed(() => (mode.value === 'mine' ? ownFlights.value : friendFlights).filter((flight) =>
  `${flight.flight} ${flight.from} ${flight.to} ${airports[flight.from]?.name || ''} ${airports[flight.to]?.name || ''}`.toLowerCase().includes(search.value.toLowerCase())
))
let map
let routeLayer

function drawRoute() {
  const start = airports[from.value]
  const end = airports[to.value]
  if (!start || !end) return

  if (!map) {
    map = L.map('map', { zoomControl: false }).setView([20, 0], 2)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)
  }

  routeLayer?.remove()
  let endLng = end.lng
  if (endLng - start.lng > 180) endLng -= 360
  if (endLng - start.lng < -180) endLng += 360
  const points = [[start.lat, start.lng], [end.lat, endLng]]
  routeLayer = L.layerGroup([
    L.polyline(points, { color: '#70acff', weight: 3 }),
    L.circleMarker(points[0], { radius: 5, color: '#70acff', fillOpacity: 1 }).bindPopup(`${from.value} · ${start.name}`),
    L.circleMarker(points[1], { radius: 5, color: '#70acff', fillOpacity: 1 }).bindPopup(`${to.value} · ${end.name}`)
  ]).addTo(map)
  map.invalidateSize()
  const mobile = window.innerWidth < 768
  map.fitBounds(points, {
    paddingTopLeft: mobile ? [24, 24] : [sidebarOpen.value ? 330 : 40, 40],
    paddingBottomRight: mobile ? [24, sidebarOpen.value ? Math.min(window.innerHeight * 0.44, 370) + 20 : 24] : [40, 40],
    maxZoom: 5
  })
}

function selectFlight(flight) {
  router.push({ name: 'map', query: { from: flight.from, to: flight.to } })
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
  drawRoute()
}

onMounted(() => {
  drawRoute()
  window.addEventListener('resize', drawRoute)
})
watch([from, to], drawRoute)
onUnmounted(() => {
  window.removeEventListener('resize', drawRoute)
  map?.remove()
})
</script>

<template>
  <section class="flight-map">
    <div id="map"></div>
    <aside class="flight-map__sidebar" :class="{ 'is-closed': !sidebarOpen }">
      <div class="flight-map__heading">
        <button type="button" class="flight-map__title" @click="mode = mode === 'mine' ? 'friends' : 'mine'">{{ mode ===
          'mine' ? 'My Flights' : 'Friends’ Flights' }} <span>⌄</span></button>
        <button type="button" class="flight-map__collapse" :aria-label="sidebarOpen ? '목록 접기' : '목록 펼치기'"
          @click="toggleSidebar">{{ sidebarOpen ? '−' : '+' }}</button>
      </div>
      <div v-if="sidebarOpen" class="flight-map__body">
        <input v-model="search" type="search" placeholder="Search to add flights" aria-label="항공편 검색" />
        <div class="flight-map__filters"><button type="button" :class="{ active: mode === 'mine' }"
            @click="mode = 'mine'">내 항공편</button><button type="button" :class="{ active: mode === 'friends' }"
            @click="mode = 'friends'">친구 항공편</button></div>
        <div class="flight-map__flights">
          <button v-for="flight in flights" :key="`${flight.flight}-${flight.from}-${flight.to}`" type="button"
            class="flight-map__flight" :class="{ active: from === flight.from && to === flight.to }"
            @click="selectFlight(flight)">
            <span class="flight-map__days"><strong>{{ flight.days }}</strong><small>DAYS</small></span>
            <span class="flight-map__flight-info"><span><small>{{ flight.flight }}</small><small>{{ flight.date
                  }}</small></span><strong>{{ airports[flight.from]?.name }} → {{ airports[flight.to]?.name
                }}</strong><small>{{ flight.from }} 09:25 &nbsp; · &nbsp; {{ flight.to }} 10:50</small></span>
          </button>
          <p v-if="!flights.length" class="flight-map__empty">검색 결과가 없습니다.</p>
        </div>
        <RouterLink class="flight-map__add" :to="{ name: 'home', query: { from, to } }">+ 항공편 추가</RouterLink>
      </div>
    </aside>
    <button type="button" class="flight-map__show" v-if="!sidebarOpen" @click="toggleSidebar">항공편 목록</button>
    <div class="flight-map__controls"><button type="button" aria-label="지도 확대" @click="map?.zoomIn()">+</button><button
        type="button" aria-label="지도 축소" @click="map?.zoomOut()">−</button></div>
  </section>
</template>
