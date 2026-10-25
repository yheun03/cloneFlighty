<script setup>
import { computed, ref } from "vue";

import BaseIcon from "../base/BaseIcon.vue";
import BaseTabItem from "../base/BaseTabItem.vue";
import { getCountryFlag } from "../../common/countries.js";
import airportData from "../../common/airports.js";

import planeIcon from "../../assets/icons/lucide/plane.svg";
import worldMap from "../../assets/figma/world-map-robinson.svg";

const props = defineProps({
    flights: { type: Number, required: true },
    distance: { type: String, required: true },
    flightTime: { type: String, required: true },
    airports: { type: Number, required: true },
    airlines: { type: Number, required: true },
    // 최근 항공편: { id, code, route, title, date }
    recent: { type: Array, default: () => [] },
    periods: { type: Array, required: true },
    mapFrom: { type: String, required: true },
    mapTo: { type: String, required: true },
    routes: { type: Array, default: () => [] },
    flags: { type: String, required: true },
    historyTitle: { type: String, required: true },
    historyCount: { type: String, required: true },
    // 표시할 요약 영역입니다.
    showPeriod: { type: Boolean, default: true },
    showMap: { type: Boolean, default: true },
    showHistory: { type: Boolean, default: true },
});

defineEmits(["select"]);

const period = ref(props.periods[0]);
const flagIcons = computed(() => [
    ...new Set(props.flags.split(/\s+/).map(getCountryFlag).filter(Boolean)),
]);
const mapRoutes = computed(() => {
    const routes = props.routes.length
        ? props.routes
        : [{ from: props.mapFrom, to: props.mapTo }];
    const point = (airport) => ({
        x:
            airport.lng *
            Math.cos(((airport.lat * Math.PI) / 180) * 0.45),
        y: -airport.lat * 1.02,
    });
    return routes
        .map((route) => {
            const from = airportData[route.from];
            const to = airportData[route.to];
            if (!from || !to) return null;
            const start = point(from);
            const end = point(to);
            const crossesDateLine = Math.abs(end.x - start.x) > 180;
            const adjustedEnd = crossesDateLine
                ? {
                    ...end,
                    x: end.x + (start.x > end.x ? 360 : -360),
                }
                : end;
            const control = {
                x: (start.x + adjustedEnd.x) / 2,
                y:
                    Math.min(start.y, adjustedEnd.y) -
                    Math.abs(adjustedEnd.x - start.x) * 0.12,
            };
            const path = `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${adjustedEnd.x} ${adjustedEnd.y}`;
            return {
                id: `${route.from}-${route.to}`,
                start,
                end,
                paths: crossesDateLine
                    ? [
                        path,
                        `M ${start.x + (start.x > end.x ? -360 : 360)} ${start.y} Q ${control.x + (start.x > end.x ? -360 : 360)} ${control.y} ${adjustedEnd.x + (start.x > end.x ? -360 : 360)} ${adjustedEnd.y}`,
                    ]
                    : [path],
            };
        })
        .filter(Boolean);
});
</script>

<template>
    <div class="fc-passport">
        <BaseTabItem v-if="showPeriod" v-model="period" :items="periods" />
        <div v-if="showMap" class="fc-passport__map" aria-hidden="true">
            <div class="fc-passport__ticker">
                <span v-for="index in 5" :key="`from-${index}`">✈</span>
                <b>{{ mapFrom }}</b>
                <span v-for="index in 7" :key="`to-${index}`">✈</span>
                <b>{{ mapTo }}</b>
                <span v-for="index in 5" :key="`after-${index}`">✈</span>
            </div>
            <svg viewBox="-180 -91.296 360 182.592">
                <image class="fc-passport__world" :href="worldMap" x="-180" y="-91.296" width="360" height="182.592" />
                <template v-for="route in mapRoutes" :key="route.id">
                    <path v-for="(path, index) in route.paths" :key="`${route.id}-${index}`" class="fc-passport__route"
                        :d="path" />
                </template>
                <g v-for="route in mapRoutes" :key="`${route.id}-points`" class="fc-passport__route-points">
                    <circle :cx="route.start.x" :cy="route.start.y" r="1.6" />
                    <circle :cx="route.end.x" :cy="route.end.y" r="1.6" />
                </g>
            </svg>
            <div class="fc-passport__flags">
                <BaseIcon v-for="flag in flagIcons" :key="flag" :src="flag" variant="image" />
            </div>
        </div>
        <div class="fc-passport__identity">
            <h2>{{ $t("MY FLIGHTY PASSPORT") }}</h2>
            <small>{{ $t("PASSPORT · PASS · PASPORTE") }}</small>
        </div>
        <div class="fc-passport__numbers">
            <div>
                <span>{{ $t("FLIGHTS") }}</span>
                <strong>{{ $t(flights) }}</strong>
            </div>
            <div>
                <span>{{ $t("FLIGHTS DISTANCE") }}</span>
                <strong>{{ $t(distance) }}</strong>
            </div>
            <div>
                <span>{{ $t("FLIGHT TIME") }}</span>
                <strong>{{ $t(flightTime) }}</strong>
            </div>
            <div>
                <span>{{ $t("AIRPORTS") }}</span>
                <strong>{{ $t(airports) }}</strong>
            </div>
            <div>
                <span>{{ $t("AIRLINES") }}</span>
                <strong>{{ $t(airlines) }}</strong>
            </div>
        </div>
        <template v-if="showHistory">
            <h3>
                {{ $t(historyTitle) }}
                <small>{{ $t(historyCount) }}</small>
            </h3>
            <button v-for="flight in recent" :key="flight.id" class="fc-passport__flight" type="button"
                @click="$emit('select', flight)">
                <span>
                    <BaseIcon :src="planeIcon" />
                </span>
                <div>
                    <small>
                        {{ $t(flight.code) }} &nbsp;{{ $t(flight.route) }}
                    </small>
                    <strong>{{ $t(flight.title) }}</strong>
                </div>
                <small>{{ $t(flight.date) }}</small>
            </button>
        </template>
    </div>
</template>
