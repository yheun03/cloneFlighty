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

import { useRoute, useRouter } from "vue-router";

import airports from "../common/airports.js";
import { flights, getFlight } from "../common/flights.js";
import { t, locale } from "../common/preferences.js";

import "../assets/scss/layout/MapLayout.scss";
import "../assets/scss/layout/_frame.scss";

const MAPLIBRE_CSS_URL =
    "https://unpkg.com/maplibre-gl@6.10.0/dist/maplibre-gl.css";

const defaultFrom = "SFO";
const defaultTo = "ICN";
const route = useRoute();
const router = useRouter();
const { theme } = inject("appearance");
const pageKey = computed(() => route.matched[1]?.name || route.name);
const backTarget = computed(() => {
    if (!route.meta.backName) return null;

    const needsId = ["flight-detail", "connection"].includes(
        route.meta.backName,
    );
    return {
        name: route.meta.backName,
        params: needsId ? { id: route.params.id } : {},
        query: route.query,
    };
});
const backTitle = computed(() =>
    backTarget.value
        ? router.resolve(backTarget.value).meta.panelTitle || "Back"
        : "",
);
const mapStyle = computed(
    () =>
        `https://tiles.openfreemap.org/styles/${theme.value === "light" ? "bright" : "dark"}`,
);
const routeColor = computed(() =>
    theme.value === "light" ? "#1570ef" : "#70acff",
);
const normalizeAirportCode = (value) => value.trim().toUpperCase().slice(0, 3);
const routeFlight = computed(() => getFlight(String(route.params.id || "")));
const from = computed(
    () =>
        routeFlight.value?.from ||
        (typeof route.query.from === "string"
            ? normalizeAirportCode(route.query.from)
            : defaultFrom),
);
const to = computed(
    () =>
        routeFlight.value?.to ||
        (typeof route.query.to === "string"
            ? normalizeAirportCode(route.query.to)
            : defaultTo),
);
const pageFlights = ref({ name: "", items: [] });
const mapFlights = computed(() => {
    if (pageFlights.value.name === route.name) return pageFlights.value.items;
    if (routeFlight.value) return [routeFlight.value];
    if (
        ["home", "friend-flights", "flight-results", "passport"].includes(
            route.name,
        )
    ) {
        return [];
    }
    if (route.meta.section === "passport") {
        return flights.value.filter(
            (flight) =>
                flight.isCompleted &&
                !flight.friend &&
                (!route.query.period ||
                    route.query.period === "ALL-TIME" ||
                    flight.year === route.query.period),
        );
    }
    if (route.params.id && route.meta.section === "flights") return [];
    return [{ id: "preview", from: from.value, to: to.value }];
});
const mapRoutes = computed(() => {
    const routes = new Map();
    for (const flight of mapFlights.value) {
        if (!airports[flight.from] || !airports[flight.to]) continue;
        // 같은 공항 쌍은 방향·탑승 횟수가 달라도 지도에 한 번만 그립니다.
        const key = [flight.from, flight.to].sort().join("-");
        if (!routes.has(key)) {
            routes.set(key, {
                id: key,
                from: flight.from,
                to: flight.to,
                flightIds: [],
            });
        }
        routes.get(key).flightIds.push(flight.id);
    }
    return [...routes.values()];
});
const routeLabel = computed(() => {
    if (!mapRoutes.value.length) return t("No flights to display.");
    if (mapRoutes.value.length === 1) {
        const item = mapRoutes.value[0];
        return `${item.from} → ${item.to}`;
    }
    return t("{count} routes · {flights} flights", {
        count: mapRoutes.value.length,
        flights: mapFlights.value.length,
    });
});
const sidebar = ref(null);
const content = ref(null);
const sidebarOpen = ref(true);
const isGlobe = ref(false);
const ready = ref(false);
const mapError = ref("");
const mapStatus = ref("Loading map…");
const routeSummary = computed(() =>
    mapRoutes.value.length
        ? mapRoutes.value
            .map((item) =>
                t("{from} to {to} route", {
                    from: airports[item.from].name,
                    to: airports[item.to].name,
                }),
            )
            .join(" · ")
        : t("No journeys in the current list."),
);
let map;
let maplibregl;
let routeBounds = null;
let resizeFrame = null;
let disposed = false;
let fitAfterStyleLoad = true;

function setPageFlights(items) {
    pageFlights.value = { name: route.name, items };
}

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
    const routeFeatures = [];
    const airportFeatures = new Map();
    if (!mapRoutes.value.length) {
        routeBounds = null;
        map.getSource("route").setData({
            type: "FeatureCollection",
            features: [],
        });
        map.getSource("airports").setData({
            type: "FeatureCollection",
            features: [],
        });
        mapError.value = mapFlights.value.length
            ? "유효한 출발지와 도착지 공항 코드를 확인해 주세요."
            : "";
        mapStatus.value = "No journeys in the current list.";
        return;
    }
    mapError.value = "";
    routeBounds = new maplibregl.LngLatBounds();
    const referenceLongitude = airports[mapRoutes.value[0].to].lng;
    for (const item of mapRoutes.value) {
        const points = routeCoordinates(airports[item.from], airports[item.to]);
        // 날짜 변경선을 지나는 항로도 같은 지구 복사본에 맞춥니다.
        const middleLongitude = points[Math.floor(points.length / 2)][0];
        const offset =
            Math.round((referenceLongitude - middleLongitude) / 360) * 360;
        const coordinates = points.map(([lng, lat]) => [lng + offset, lat]);
        coordinates.forEach((point) => routeBounds.extend(point));
        routeFeatures.push({
            type: "Feature",
            id: item.id,
            geometry: { type: "LineString", coordinates },
            properties: {
                from: item.from,
                to: item.to,
                flightIds: item.flightIds,
            },
        });
        for (const [code, point] of [
            [item.from, coordinates[0]],
            [item.to, coordinates.at(-1)],
        ]) {
            if (!airportFeatures.has(code)) {
                airportFeatures.set(code, {
                    type: "Feature",
                    geometry: { type: "Point", coordinates: point },
                    properties: { code, name: airports[code].fullName },
                });
            }
        }
    }
    map.getSource("route").setData({
        type: "FeatureCollection",
        features: routeFeatures,
    });
    map.getSource("airports").setData({
        type: "FeatureCollection",
        features: [...airportFeatures.values()],
    });
    if (shouldFit) fitRoute();
    mapStatus.value = t(
        "Showing {flights} flights on {routes} routes. {summary}",
        {
            flights: mapFlights.value.length,
            routes: mapRoutes.value.length,
            summary: routeSummary.value,
        },
    );
}

function toggleProjection() {
    if (!ready.value) return;
    isGlobe.value = !isGlobe.value;
    map.setProjection({ type: isGlobe.value ? "globe" : "mercator" });
    fitRoute();
    mapStatus.value = t(
        isGlobe.value ? "Switched to globe view." : "Switched to flat view.",
    );
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
            center: [airports.ICN.lng, airports.ICN.lat],
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
                type: "FeatureCollection",
                features: [],
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
watch(mapRoutes, () => {
    if (!ready.value) fitAfterStyleLoad = true;
    updateRoute();
});
watch(locale, () => {
    if (map && ready.value) updateRoute();
});
watch(theme, () => {
    if (!map) return;
    ready.value = false;
    mapError.value = "";
    mapStatus.value = "Changing map theme…";
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
    <section class="flight-map" :class="{ 'is-sidebar-closed': !sidebarOpen }" :aria-label="$t('비행 경로 지도')">
        <div id="flight-map-canvas" role="region" :aria-label="`${routeSummary} ${$t('비행 경로 지도')}`"
            aria-describedby="flight-map-route-summary flight-map-status"></div>
        <p id="flight-map-status" class="flight-map__status sr-only" role="status" aria-live="polite">
            {{ $t(mapStatus) }}
        </p>
        <p v-if="mapError" class="flight-map__error" role="alert" aria-live="assertive">
            {{ $t(mapError) }}
        </p>
        <main id="main-content" ref="sidebar" class="flight-map__sidebar" :class="{
            'is-closed': !sidebarOpen,
            'flight-map__sidebar--wide': route.meta.widePanel,
        }" tabindex="-1" aria-labelledby="flight-map-title">
            <header class="flight-map__heading">
                <div class="flight-map__heading-copy">
                    <h1 id="flight-map-title">
                        {{ $t(route.meta.panelTitle) }}
                    </h1>
                    <p id="flight-map-route-summary" class="flight-map__route-summary">
                        <strong>{{ $t(routeLabel) }}</strong>
                        <span :title="$t(routeSummary)">
                            {{ $t(routeSummary) }}
                            {{ `· ${$t("Temporary data")}` }}
                        </span>
                    </p>
                </div>
                <button type="button" class="flight-map__collapse" :aria-label="$t(sidebarOpen ? '본문 접기' : '본문 펼치기')"
                    :aria-expanded="sidebarOpen" aria-controls="flight-map-content" @click="toggleSidebar">
                    {{ $t(sidebarOpen ? "−" : "+") }}
                </button>
            </header>
            <nav v-show="sidebarOpen" class="flight-map__nav" :aria-label="$t('주요 메뉴')">
                <RouterLink :to="{ name: 'home', query: route.query }"
                    :class="{ 'is-active': route.meta.section === 'flights' }" :aria-current="route.meta.section === 'flights' ? 'page' : undefined
                        ">
                    {{ $t("Flights") }}
                </RouterLink>
                <RouterLink :to="{ name: 'passport', query: route.query }"
                    :class="{ 'is-active': route.meta.section === 'passport' }" :aria-current="route.meta.section === 'passport' ? 'page' : undefined
                        ">
                    {{ $t("Passport") }}
                </RouterLink>
                <RouterLink :to="{ name: 'friends', query: route.query }"
                    :class="{ 'is-active': route.meta.section === 'friends' }" :aria-current="route.meta.section === 'friends' ? 'page' : undefined
                        ">
                    {{ $t("Friends") }}
                </RouterLink>
                <RouterLink :to="{ name: 'settings', query: route.query }"
                    :class="{ 'is-active': route.meta.section === 'settings' }" :aria-current="route.meta.section === 'settings' ? 'page' : undefined
                        ">
                    {{ $t("Settings") }}
                </RouterLink>
                <RouterLink class="flight-map__nav-action" :to="{ name: 'add-flight', query: route.query }"
                    :aria-label="$t('Add Flight')">
                    ＋ {{ $t("Add Flight") }}
                </RouterLink>
                <RouterLink :to="{ name: 'component', query: route.query }"
                    :class="{ 'is-active': route.meta.section === 'ui' }" :aria-current="route.meta.section === 'ui' ? 'page' : undefined
                        ">
                    {{ $t("UI") }}
                </RouterLink>
            </nav>
            <div v-if="
                sidebarOpen &&
                (route.meta.backName ||
                    route.name === 'home' ||
                    route.name === 'friend-flights')
            " class="flight-map__page-nav">
                <RouterLink v-if="backTarget" class="flight-map__back" :to="backTarget">
                    <span aria-hidden="true">‹</span>
                    {{ $t(backTitle) }}
                </RouterLink>
                <template v-if="
                    route.name === 'home' || route.name === 'friend-flights'
                ">
                    <RouterLink :to="{ name: 'home', query: route.query }"
                        :class="{ 'is-active': route.name === 'home' }" :aria-current="route.name === 'home' ? 'page' : undefined
                            ">
                        {{ $t("My Flights") }}
                    </RouterLink>
                    <RouterLink :to="{ name: 'friend-flights', query: route.query }" :class="{
                        'is-active': route.name === 'friend-flights',
                    }" :aria-current="route.name === 'friend-flights'
                        ? 'page'
                        : undefined
                        ">
                        {{ $t("Friends’ Flights") }}
                    </RouterLink>
                </template>
            </div>
            <div v-show="sidebarOpen" id="flight-map-content" ref="content" class="flight-map__content" :class="{
                'flight-map__content--gallery': route.meta.widePanel,
            }">
                <RouterView v-slot="{ Component }">
                    <Transition name="flight-map-page" mode="out-in">
                        <component :is="Component" :key="pageKey" @map-flights="setPageFlights" />
                    </Transition>
                </RouterView>
            </div>
        </main>
        <div class="flight-map__controls" role="group" :aria-label="$t('지도 조작')">
            <button type="button" :aria-label="$t('지도 확대')" :disabled="!ready" @click="map?.zoomIn()">
                +
            </button>
            <button type="button" :aria-label="$t('지도 축소')" :disabled="!ready" @click="map?.zoomOut()">
                −
            </button>
            <button type="button" :disabled="!ready" :aria-pressed="isGlobe" :aria-label="$t(isGlobe ? '평면 보기로 전환' : '지구본 보기로 전환')
                " @click="toggleProjection">
                {{ $t(isGlobe ? "평면" : "지구본") }}
            </button>
        </div>
    </section>
</template>
