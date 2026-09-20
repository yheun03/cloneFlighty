<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const airports = JSON.parse(document.querySelector('#airports').textContent)
const route = useRoute()
const router = useRouter()
const from = computed(() => typeof route.query.from === 'string' ? route.query.from.trim().toUpperCase() : 'ICN')
const to = computed(() => typeof route.query.to === 'string' ? route.query.to.trim().toUpperCase() : 'SFO')
const mode = ref('mine')
const search = ref('')
const sidebarOpen = ref(true)
const isGlobe = ref(false)
const ready = ref(false)
const mapError = ref('')
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
let maplibregl

function routeCoordinates(start, end) {
    const rad = Math.PI / 180
    const a = [Math.cos(start.lat * rad) * Math.cos(start.lng * rad), Math.cos(start.lat * rad) * Math.sin(start.lng * rad), Math.sin(start.lat * rad)]
    const b = [Math.cos(end.lat * rad) * Math.cos(end.lng * rad), Math.cos(end.lat * rad) * Math.sin(end.lng * rad), Math.sin(end.lat * rad)]
    const angle = Math.acos(Math.max(-1, Math.min(1, a.reduce((sum, value, index) => sum + value * b[index], 0))))
    if (angle < 0.000001) return [[start.lng, start.lat], [end.lng, end.lat]]
    const coordinates = []
    let previous = start.lng

    for (let i = 0; i <= 64; i++) {
        const t = i / 64
        const first = Math.sin((1 - t) * angle) / Math.sin(angle)
        const second = Math.sin(t * angle) / Math.sin(angle)
        const [x, y, z] = a.map((value, index) => value * first + b[index] * second)
        let lng = Math.atan2(y, x) / rad
        while (lng - previous > 180) lng -= 360
        while (lng - previous < -180) lng += 360
        coordinates.push([lng, Math.atan2(z, Math.hypot(x, y)) / rad])
        previous = lng
    }
    return coordinates
}

function drawRoute() {
    if (!ready.value) return
    const start = airports[from.value]
    const end = airports[to.value]
    if (!start || !end) return
    const coordinates = routeCoordinates(start, end)
    map.getSource('route').setData({ type: 'Feature', geometry: { type: 'LineString', coordinates }, properties: {} })
    map.getSource('airports').setData({
        type: 'FeatureCollection',
        features: [coordinates[0], coordinates.at(-1)].map((point) => ({ type: 'Feature', geometry: { type: 'Point', coordinates: point }, properties: {} }))
    })
    const mobile = window.innerWidth < 768
    const bounds = coordinates.reduce((result, point) => result.extend(point), new maplibregl.LngLatBounds(coordinates[0], coordinates[0]))
    map.fitBounds(bounds, {
        padding: {
            top: 40,
            right: 40,
            bottom: mobile && sidebarOpen.value ? Math.min(window.innerHeight * 0.44, 370) + 20 : 40,
            left: !mobile && sidebarOpen.value ? 330 : 40
        },
        maxZoom: isGlobe.value ? 1.5 : 5,
        duration: 0
    })
}

function toggleProjection() {
    if (!ready.value) return
    isGlobe.value = !isGlobe.value
    map.setProjection({ type: isGlobe.value ? 'globe' : 'mercator' })
    drawRoute()
}

function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
    drawRoute()
}

function selectFlight(flight) {
    router.push({ name: 'map', query: { from: flight.from, to: flight.to } })
}

function resizeMap() {
    map?.resize()
    drawRoute()
}

onMounted(async () => {
    try {
        maplibregl = await import(/* @vite-ignore */ 'https://unpkg.com/maplibre-gl@6.10.0/dist/maplibre-gl.mjs')
        map = new maplibregl.Map({
            container: 'map',
            style: 'https://tiles.openfreemap.org/styles/dark',
            center: [126.4407, 37.4602],
            zoom: 2
        })
    } catch {
        mapError.value = '이 기기에서는 지도를 표시할 수 없습니다.'
        return
    }
    map.on('load', () => {
        mapError.value = ''
        map.addSource('route', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] }, properties: {} } })
        map.addLayer({ id: 'flight-route', type: 'line', source: 'route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#70acff', 'line-width': 3 } })
        map.addSource('airports', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
        map.addLayer({ id: 'flight-airports', type: 'circle', source: 'airports', paint: { 'circle-radius': 5, 'circle-color': '#70acff', 'circle-stroke-color': '#fff', 'circle-stroke-width': 1 } })
        ready.value = true
        drawRoute()
    })
    map.on('error', () => {
        if (!ready.value) mapError.value = '지도 데이터를 불러오지 못했습니다.'
    })
    window.addEventListener('resize', resizeMap)
})
watch([from, to], drawRoute)
onUnmounted(() => {
    window.removeEventListener('resize', resizeMap)
    map?.remove()
})
</script>

<template>
    <section class="flight-map" :class="{ 'is-sidebar-closed': !sidebarOpen }">
        <div id="map"></div>
        <p v-if="mapError" class="flight-map__error">{{ mapError }}</p>
        <aside class="flight-map__sidebar" :class="{ 'is-closed': !sidebarOpen }">
            <div class="flight-map__heading">
                <button type="button" class="flight-map__title" @click="mode = mode === 'mine' ? 'friends' : 'mine'">{{
                    mode === 'mine' ? 'My Flights' : 'Friends’ Flights' }} <span>⌄</span></button>
                <button type="button" class="flight-map__collapse" :aria-label="sidebarOpen ? '목록 접기' : '목록 펼치기'"
                    @click="toggleSidebar">{{ sidebarOpen ? '−' : '+' }}</button>
            </div>
            <div v-if="sidebarOpen" class="flight-map__body">
                <input v-model="search" type="search" placeholder="Search to add flights" aria-label="항공편 검색" />
                <div class="flight-map__filters"><button type="button" :class="{ active: mode === 'mine' }"
                        @click="mode = 'mine'">내 항공편</button><button type="button"
                        :class="{ active: mode === 'friends' }" @click="mode = 'friends'">친구 항공편</button></div>
                <div class="flight-map__flights">
                    <button v-for="flight in flights" :key="`${flight.flight}-${flight.from}-${flight.to}`"
                        type="button" class="flight-map__flight"
                        :class="{ active: from === flight.from && to === flight.to }" @click="selectFlight(flight)">
                        <span class="flight-map__days"><strong>{{ flight.days }}</strong><small>DAYS</small></span>
                        <span class="flight-map__flight-info"><span><small>{{ flight.flight }}</small><small>{{
                            flight.date }}</small></span><strong>{{ airports[flight.from]?.name }} → {{
                                        airports[flight.to]?.name }}</strong><small>{{ flight.from }} 09:25 &nbsp; · &nbsp; {{
                                    flight.to }} 10:50</small></span>
                    </button>
                    <p v-if="!flights.length" class="flight-map__empty">검색 결과가 없습니다.</p>
                </div>
                <RouterLink class="flight-map__add" :to="{ name: 'home', query: { from, to } }">+ 항공편 추가</RouterLink>
            </div>
        </aside>
        <button type="button" class="flight-map__show" v-if="!sidebarOpen" @click="toggleSidebar">항공편 목록</button>
        <div class="flight-map__controls"><button type="button" aria-label="지도 확대" :disabled="!ready"
                @click="map?.zoomIn()">+</button><button type="button" aria-label="지도 축소" :disabled="!ready"
                @click="map?.zoomOut()">−</button><button type="button" :disabled="!ready" :aria-pressed="isGlobe"
                @click="toggleProjection">{{ isGlobe ? '평면' : '지구본' }}</button></div>
    </section>
</template>
