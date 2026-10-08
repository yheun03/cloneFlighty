<script setup>
import {
    computed,
    inject,
    nextTick,
    onMounted,
    onUnmounted,
    ref,
    watch,
} from "vue";

import { useRoute } from "vue-router";

import layoutData from "./data/MapLayout.json";

import "../assets/scss/layout/MapLayout.scss";
import "../assets/scss/pages/FramePages.scss";

const MAPLIBRE_CSS_URL =
    "https://unpkg.com/maplibre-gl@6.10.0/dist/maplibre-gl.css";

const airports = layoutData.airports;
const route = useRoute();
const { theme } = inject("appearance");
const mapStyle = computed(
    () =>
        `https://tiles.openfreemap.org/styles/${theme.value === "light" ? "bright" : "dark"}`,
);
const routeColor = computed(() =>
    theme.value === "light" ? "#1570ef" : "#70acff",
);
const normalizeAirportCode = (value) => value.trim().toUpperCase().slice(0, 3);
const from = computed(() =>
    typeof route.query.from === "string"
        ? normalizeAirportCode(route.query.from)
        : layoutData.from,
);
const to = computed(() =>
    typeof route.query.to === "string"
        ? normalizeAirportCode(route.query.to)
        : layoutData.to,
);
const sidebar = ref(null);
const content = ref(null);
const sidebarOpen = ref(true);
const isGlobe = ref(false);
const ready = ref(false);
const mapError = ref("");
const mapStatus = ref("지도를 불러오는 중입니다.");
const routeSummary = computed(
    () =>
        `${airports[from.value]?.name || from.value}에서 ${airports[to.value]?.name || to.value}까지`,
);
let map;
let maplibregl;
let routeBounds = null;
let resizeFrame = null;
let disposed = false;
let fitAfterStyleLoad = true;

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
    if (disposed || !ready.value || !routeBounds || route.meta.widePanel)
        return;
    const mobile = window.innerWidth < 768;
    const panelBounds = sidebar.value?.getBoundingClientRect();
    map.fitBounds(routeBounds, {
        padding: {
            top: 40,
            right: 40,
            bottom: mobile ? (panelBounds?.height || 0) + 20 : 40,
            left: !mobile ? (panelBounds?.width || 0) + 40 : 40,
        },
        maxZoom: isGlobe.value ? 1.5 : 5,
        duration: 0,
    });
}

function updateRoute(shouldFit = true) {
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
    if (shouldFit) fitRoute();
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
            style: mapStyle.value,
            center: [126.4407, 37.4602],
            zoom: 2,
        });
    } catch {
        if (disposed) return;
        mapError.value = "이 기기에서는 지도를 표시할 수 없습니다.";
        mapStatus.value = "";
        return;
    }
    // 테마로 지도 스타일을 교체하면 항공편 레이어도 다시 추가합니다.
    map.on("style.load", () => {
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
            paint: { "line-color": routeColor.value, "line-width": 3 },
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
                "circle-color": routeColor.value,
                "circle-stroke-color": "#fff",
                "circle-stroke-width": 1,
            },
        });
        ready.value = true;
        if (isGlobe.value) map.setProjection({ type: "globe" });
        updateRoute(fitAfterStyleLoad);
        fitAfterStyleLoad = false;
    });
    map.on("error", () => {
        if (!ready.value) {
            mapError.value = "지도 데이터를 불러오지 못했습니다.";
            mapStatus.value = "";
        }
    });
    window.addEventListener("resize", resizeMap);
});
watch([from, to], () => {
    if (!ready.value) fitAfterStyleLoad = true;
    updateRoute();
});
watch(theme, () => {
    if (!map) return;
    ready.value = false;
    mapError.value = "";
    mapStatus.value = "지도 색상 모드를 변경하는 중입니다.";
    map.setStyle(mapStyle.value, { diff: false });
});
watch(sidebarOpen, async () => {
    await nextTick();
    fitRoute();
});
watch(
    () => route.name,
    async (name, previousName) => {
        sidebarOpen.value = true;
        await nextTick();
        if (name !== "flight-booking" && previousName !== "flight-booking") {
            content.value?.scrollTo({ top: 0 });
        }
        fitRoute();
    },
);
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
        aria-label="비행 경로 지도"
    >
        <div
            id="flight-map-canvas"
            role="region"
            :aria-label="`${routeSummary} 항공편 지도`"
            aria-describedby="flight-map-route-summary flight-map-status"
        ></div>
        <p
            id="flight-map-status"
            class="flight-map__status sr-only"
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
        <main
            id="main-content"
            ref="sidebar"
            class="flight-map__sidebar"
            :class="{
                'is-closed': !sidebarOpen,
                'flight-map__sidebar--wide': route.meta.widePanel,
            }"
            tabindex="-1"
            aria-labelledby="flight-map-title"
        >
            <header class="flight-map__heading">
                <div class="flight-map__heading-copy">
                    <h1 id="flight-map-title">{{ route.meta.panelTitle }}</h1>
                    <p
                        id="flight-map-route-summary"
                        class="flight-map__route-summary"
                    >
                        <strong>{{ from }} → {{ to }}</strong>
                        <span>{{ routeSummary }} · 샘플 데이터</span>
                    </p>
                </div>
                <button
                    type="button"
                    class="flight-map__collapse"
                    :aria-label="sidebarOpen ? '본문 접기' : '본문 펼치기'"
                    :aria-expanded="sidebarOpen"
                    aria-controls="flight-map-content"
                    @click="toggleSidebar"
                >
                    {{ sidebarOpen ? "−" : "+" }}
                </button>
            </header>
            <nav
                v-show="sidebarOpen"
                class="flight-map__nav"
                aria-label="주요 메뉴"
            >
                <RouterLink
                    :to="{ name: 'home', query: route.query }"
                    :class="{ 'is-active': route.meta.section === 'flights' }"
                >
                    Flights
                </RouterLink>
                <RouterLink
                    :to="{ name: 'passport', query: route.query }"
                    :class="{ 'is-active': route.meta.section === 'passport' }"
                >
                    Passport
                </RouterLink>
                <RouterLink
                    :to="{ name: 'friends', query: route.query }"
                    :class="{ 'is-active': route.meta.section === 'friends' }"
                >
                    Friends
                </RouterLink>
                <RouterLink
                    :to="{ name: 'settings', query: route.query }"
                    :class="{ 'is-active': route.meta.section === 'settings' }"
                >
                    Settings
                </RouterLink>
                <RouterLink
                    :to="{ name: 'add-flight', query: route.query }"
                    aria-label="Add Flight"
                >
                    ＋
                </RouterLink>
                <RouterLink :to="{ name: 'component', query: route.query }">
                    UI
                </RouterLink>
            </nav>
            <div
                v-if="
                    sidebarOpen &&
                    (route.meta.backName ||
                        route.name === 'home' ||
                        route.name === 'friend-flights')
                "
                class="flight-map__page-nav"
            >
                <RouterLink
                    v-if="route.meta.backName"
                    :to="{
                        name: route.meta.backName,
                        params:
                            route.meta.backName === 'flight-detail' ||
                            route.meta.backName === 'connection'
                                ? { id: route.params.id }
                                : {},
                        query: route.query,
                    }"
                >
                    ‹ Back
                </RouterLink>
                <template
                    v-if="
                        route.name === 'home' || route.name === 'friend-flights'
                    "
                >
                    <RouterLink :to="{ name: 'home', query: route.query }">
                        My Flights
                    </RouterLink>
                    <RouterLink
                        :to="{ name: 'friend-flights', query: route.query }"
                    >
                        Friends’ Flights
                    </RouterLink>
                </template>
            </div>
            <div
                v-show="sidebarOpen"
                id="flight-map-content"
                ref="content"
                class="flight-map__content"
                :class="{
                    'flight-map__content--gallery': route.meta.widePanel,
                }"
            >
                <RouterView />
            </div>
        </main>
        <div
            class="flight-map__controls"
            role="group"
            aria-label="지도 조작"
        >
            <button
                type="button"
                aria-label="지도 확대"
                :disabled="!ready"
                @click="map?.zoomIn()"
            >
                +
            </button>
            <button
                type="button"
                aria-label="지도 축소"
                :disabled="!ready"
                @click="map?.zoomOut()"
            >
                −
            </button>
            <button
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
