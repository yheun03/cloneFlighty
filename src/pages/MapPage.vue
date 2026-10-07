<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseInput from "../component/base/BaseInput.vue";
import "../assets/scss/pages/MapPage.scss";

const MAPLIBRE_CSS_URL =
    "https://unpkg.com/maplibre-gl@6.10.0/dist/maplibre-gl.css";

const airports = JSON.parse(document.querySelector("#airports").textContent);
const route = useRoute();
const router = useRouter();
const normalizeAirportCode = (value) => value.trim().toUpperCase().slice(0, 3);
const from = computed(() =>
    typeof route.query.from === "string"
        ? normalizeAirportCode(route.query.from)
        : "ICN",
);
const to = computed(() =>
    typeof route.query.to === "string"
        ? normalizeAirportCode(route.query.to)
        : "SFO",
);
const mode = ref("mine");
const search = ref("");
const sidebarOpen = ref(true);
const isGlobe = ref(false);
const ready = ref(false);
const mapError = ref("");
const mapStatus = ref("지도를 불러오는 중입니다.");
const routeSummary = computed(
    () =>
        `${airports[from.value]?.name || from.value}에서 ${airports[to.value]?.name || to.value}까지`,
);
const ownFlights = computed(() => [
    {
        flight: "KE 24",
        from: from.value,
        to: to.value,
        date: "Sat, 20 Jun",
        days: 21,
    },
    { flight: "KE 703", from: "ICN", to: "NRT", date: "Tue, 10 Mar", days: 62 },
    { flight: "KE 16", from: "NRT", to: "SFO", date: "Sun, 22 Mar", days: 74 },
]);
const friendFlights = [
    { flight: "SK 613", from: "CDG", to: "LHR", date: "Thu, 15 Jan", days: 8 },
    {
        flight: "KL 1268",
        from: "LHR",
        to: "CDG",
        date: "Fri, 24 Apr",
        days: 107,
    },
    { flight: "KE 24", from: "SFO", to: "ICN", date: "Sat, 20 Jun", days: 164 },
];
const flights = computed(() =>
    (mode.value === "mine" ? ownFlights.value : friendFlights).filter(
        (flight) =>
            `${flight.flight} ${flight.from} ${flight.to} ${airports[flight.from]?.name || ""} ${airports[flight.to]?.name || ""}`
                .toLowerCase()
                .includes(search.value.toLowerCase()),
    ),
);
let map;
let maplibregl;
let routeBounds = null;
let resizeFrame = null;
let disposed = false;

function loadMapLibreCss() {
    const existing = document.querySelector(`link[href="${MAPLIBRE_CSS_URL}"]`);
    if (existing?.sheet) return Promise.resolve();

    return new Promise((resolve, reject) => {
        const link = existing || document.createElement("link");
        link.addEventListener("load", resolve, { once: true });
        link.addEventListener(
            "error",
            (error) => {
                link.remove();
                reject(error);
            },
            { once: true },
        );
        if (!existing) {
            link.rel = "stylesheet";
            link.href = MAPLIBRE_CSS_URL;
            document.head.append(link);
        }
    });
}

function routeCoordinates(start, end) {
    const rad = Math.PI / 180;
    const a = [
        Math.cos(start.lat * rad) * Math.cos(start.lng * rad),
        Math.cos(start.lat * rad) * Math.sin(start.lng * rad),
        Math.sin(start.lat * rad),
    ];
    const b = [
        Math.cos(end.lat * rad) * Math.cos(end.lng * rad),
        Math.cos(end.lat * rad) * Math.sin(end.lng * rad),
        Math.sin(end.lat * rad),
    ];
    const angle = Math.acos(
        Math.max(
            -1,
            Math.min(
                1,
                a.reduce((sum, value, index) => sum + value * b[index], 0),
            ),
        ),
    );
    if (angle < 0.000001)
        return [
            [start.lng, start.lat],
            [end.lng, end.lat],
        ];
    const coordinates = [];
    let previous = start.lng;

    for (let i = 0; i <= 64; i++) {
        const t = i / 64;
        const first = Math.sin((1 - t) * angle) / Math.sin(angle);
        const second = Math.sin(t * angle) / Math.sin(angle);
        const [x, y, z] = a.map(
            (value, index) => value * first + b[index] * second,
        );
        let lng = Math.atan2(y, x) / rad;
        while (lng - previous > 180) lng -= 360;
        while (lng - previous < -180) lng += 360;
        coordinates.push([lng, Math.atan2(z, Math.hypot(x, y)) / rad]);
        previous = lng;
    }
    return coordinates;
}

function fitRoute() {
    if (!ready.value || !routeBounds) return;
    const mobile = window.innerWidth < 768;
    map.fitBounds(routeBounds, {
        padding: {
            top: 40,
            right: 40,
            bottom:
                mobile && sidebarOpen.value
                    ? Math.min(window.innerHeight * 0.44, 370) + 20
                    : 40,
            left: !mobile && sidebarOpen.value ? 330 : 40,
        },
        maxZoom: isGlobe.value ? 1.5 : 5,
        duration: 0,
    });
}

function updateRoute() {
    if (!ready.value) return;
    const start = airports[from.value];
    const end = airports[to.value];
    if (!start || !end) {
        routeBounds = null;
        map.getSource("route").setData({
            type: "Feature",
            geometry: { type: "LineString", coordinates: [] },
            properties: {},
        });
        map.getSource("airports").setData({
            type: "FeatureCollection",
            features: [],
        });
        mapError.value = "유효한 출발지와 도착지 공항 코드를 확인해 주세요.";
        mapStatus.value = "";
        return;
    }
    mapError.value = "";
    const routePoints = routeCoordinates(start, end);
    routeBounds = routePoints.reduce(
        (bounds, point) => bounds.extend(point),
        new maplibregl.LngLatBounds(routePoints[0], routePoints[0]),
    );
    map.getSource("route").setData({
        type: "Feature",
        geometry: { type: "LineString", coordinates: routePoints },
        properties: {},
    });
    map.getSource("airports").setData({
        type: "FeatureCollection",
        features: [routePoints[0], routePoints.at(-1)].map((point) => ({
            type: "Feature",
            geometry: { type: "Point", coordinates: point },
            properties: {},
        })),
    });
    fitRoute();
    mapStatus.value = `${routeSummary.value} 경로를 지도에 표시했습니다.`;
}

function toggleProjection() {
    if (!ready.value) return;
    isGlobe.value = !isGlobe.value;
    map.setProjection({ type: isGlobe.value ? "globe" : "mercator" });
    fitRoute();
    mapStatus.value = `${isGlobe.value ? "지구본" : "평면"} 보기로 전환했습니다.`;
}

function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value;
    fitRoute();
}

function selectFlight(flight) {
    router.push({ name: "map", query: { from: flight.from, to: flight.to } });
}

function resizeMap() {
    if (resizeFrame !== null) return;
    resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = null;
        map?.resize();
        fitRoute();
    });
}

onMounted(async () => {
    try {
        const [, mapLibreModule] = await Promise.all([
            loadMapLibreCss(),
            import(
                /* @vite-ignore */ "https://unpkg.com/maplibre-gl@6.10.0/dist/maplibre-gl.mjs"
            ),
        ]);
        if (disposed) return;
        maplibregl = mapLibreModule;
        map = new maplibregl.Map({
            container: "flight-map-canvas",
            style: "https://tiles.openfreemap.org/styles/dark",
            center: [126.4407, 37.4602],
            zoom: 2,
        });
    } catch {
        if (disposed) return;
        mapError.value = "이 기기에서는 지도를 표시할 수 없습니다.";
        mapStatus.value = "";
        return;
    }
    map.on("load", () => {
        mapError.value = "";
        map.addSource("route", {
            type: "geojson",
            data: {
                type: "Feature",
                geometry: { type: "LineString", coordinates: [] },
                properties: {},
            },
        });
        map.addLayer({
            id: "flight-route",
            type: "line",
            source: "route",
            layout: { "line-cap": "round", "line-join": "round" },
            paint: { "line-color": "#70acff", "line-width": 3 },
        });
        map.addSource("airports", {
            type: "geojson",
            data: { type: "FeatureCollection", features: [] },
        });
        map.addLayer({
            id: "flight-airports",
            type: "circle",
            source: "airports",
            paint: {
                "circle-radius": 5,
                "circle-color": "#70acff",
                "circle-stroke-color": "#fff",
                "circle-stroke-width": 1,
            },
        });
        ready.value = true;
        updateRoute();
    });
    map.on("error", () => {
        if (!ready.value) {
            mapError.value = "지도 데이터를 불러오지 못했습니다.";
            mapStatus.value = "";
        }
    });
    window.addEventListener("resize", resizeMap);
});
watch([from, to], updateRoute);
onUnmounted(() => {
    disposed = true;
    window.removeEventListener("resize", resizeMap);
    if (resizeFrame !== null) window.cancelAnimationFrame(resizeFrame);
    map?.remove();
});
</script>

<template>
    <section
        class="flight-map"
        :class="{ 'is-sidebar-closed': !sidebarOpen }"
        aria-labelledby="flight-map-title"
    >
        <div
            id="flight-map-canvas"
            role="region"
            :aria-label="`${routeSummary} 항공편 지도`"
            aria-describedby="flight-map-route-summary flight-map-status"
        ></div>
        <p
            id="flight-map-status"
            class="flight-map__status"
            role="status"
            aria-live="polite"
        >
            {{ mapStatus }}
        </p>
        <p
            v-if="mapError"
            class="flight-map__error"
            role="alert"
            aria-live="assertive"
        >
            {{ mapError }}
        </p>
        <aside
            class="flight-map__sidebar"
            :class="{ 'is-closed': !sidebarOpen }"
            aria-labelledby="flight-map-title"
        >
            <div class="flight-map__heading">
                <div class="flight-map__heading-copy">
                    <h1 id="flight-map-title">항공편 경로</h1>
                    <p
                        id="flight-map-route-summary"
                        class="flight-map__route-summary"
                    >
                        <strong>{{ from }} → {{ to }}</strong
                        ><span>{{ routeSummary }} · 샘플 데이터</span>
                    </p>
                </div>
                <button
                    type="button"
                    class="flight-map__collapse"
                    :aria-label="sidebarOpen ? '목록 접기' : '목록 펼치기'"
                    :aria-expanded="sidebarOpen"
                    aria-controls="flight-map-list"
                    @click="toggleSidebar"
                >
                    {{ sidebarOpen ? "−" : "+" }}
                </button>
            </div>
            <div
                v-show="sidebarOpen"
                id="flight-map-list"
                class="flight-map__body"
            >
                <h2 class="flight-map__title">
                    {{ mode === "mine" ? "내 항공편" : "친구 항공편" }}
                </h2>
                <BaseInput
                    v-model="search"
                    type="search"
                    placeholder="항공편명 또는 공항 검색"
                    aria-label="항공편 검색"
                />
                <div
                    class="flight-map__filters"
                    role="group"
                    aria-label="항공편 목록 필터"
                >
                    <button
                        type="button"
                        :class="{ active: mode === 'mine' }"
                        :aria-pressed="mode === 'mine'"
                        @click="mode = 'mine'"
                    >
                        내 항공편</button
                    ><button
                        type="button"
                        :class="{ active: mode === 'friends' }"
                        :aria-pressed="mode === 'friends'"
                        @click="mode = 'friends'"
                    >
                        친구 항공편
                    </button>
                </div>
                <div class="flight-map__flights">
                    <button
                        v-for="flight in flights"
                        :key="`${flight.flight}-${flight.from}-${flight.to}`"
                        type="button"
                        class="flight-map__flight"
                        :class="{
                            active: from === flight.from && to === flight.to,
                        }"
                        :aria-current="
                            from === flight.from && to === flight.to
                                ? 'true'
                                : undefined
                        "
                        @click="selectFlight(flight)"
                    >
                        <span class="flight-map__days"
                            ><strong>{{ flight.days }}</strong
                            ><small>일 후</small></span
                        >
                        <span class="flight-map__flight-info"
                            ><span
                                ><small>{{ flight.flight }}</small
                                ><small>{{ flight.date }}</small></span
                            ><strong
                                >{{ airports[flight.from]?.name }} →
                                {{ airports[flight.to]?.name }}</strong
                            ><small
                                >{{ flight.from }} 09:25 &nbsp; · &nbsp;
                                {{ flight.to }} 10:50</small
                            ></span
                        >
                    </button>
                    <p
                        v-if="!flights.length"
                        class="flight-map__empty"
                        role="status"
                    >
                        검색 결과가 없습니다.
                    </p>
                </div>
                <RouterLink
                    class="flight-map__add"
                    :to="{ name: 'home', query: { from, to } }"
                    >+ 항공편 추가</RouterLink
                >
            </div>
        </aside>
        <div class="flight-map__controls" role="group" aria-label="지도 조작">
            <button
                type="button"
                aria-label="지도 확대"
                :disabled="!ready"
                @click="map?.zoomIn()"
            >
                +</button
            ><button
                type="button"
                aria-label="지도 축소"
                :disabled="!ready"
                @click="map?.zoomOut()"
            >
                −</button
            ><button
                type="button"
                :disabled="!ready"
                :aria-pressed="isGlobe"
                :aria-label="
                    isGlobe ? '평면 보기로 전환' : '지구본 보기로 전환'
                "
                @click="toggleProjection"
            >
                {{ isGlobe ? "평면" : "지구본" }}
            </button>
        </div>
    </section>
</template>
