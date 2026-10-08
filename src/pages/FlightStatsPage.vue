<script setup>
import { computed, ref } from "vue";

import { useRoute } from "vue-router";

import BaseButton from "../component/base/BaseButton.vue";
import FcPeriodTabs from "../component/fc/FcPeriodTabs.vue";
import FcPassportOverview from "../component/fc/FcPassportOverview.vue";
import FcFlightDistanceStats from "../component/fc/FcFlightDistanceStats.vue";
import FcTopAirlines from "../component/fc/FcTopAirlines.vue";
import FcCountriesStats from "../component/fc/FcCountriesStats.vue";

import shareIcon from "../assets/icons/lucide/share-2.svg";

import pageData from "./data/FlightStatsPage.json";

const route = useRoute();
const period = ref(String(route.query.period || pageData.period));
const metric = ref(pageData.metric);
const message = ref("");
const chartPoints = computed(() =>
    pageData.points[metric.value].split(" ").map((point) => {
        const [x, y] = point.split(",");
        return { point, x, y };
    }),
);

function share(event) {
    if (event.target.closest(".fc-button--outline")) {
        message.value = pageData.shareMessage;
    }
}
</script>

<template>
    <section
        class="frame-page stats-page"
        @click="share"
    >
        <FcPeriodTabs
            v-model="period"
            :items="pageData.periods"
        />
        <FcPassportOverview
            v-bind="pageData.overview"
            :show-period="false"
            :show-history="false"
        />
        <section class="stats-page__section">
            <div class="fc-stat-head">
                <h2>Flights</h2>
                <BaseButton
                    label="Share"
                    :icon="shareIcon"
                    variant="outline"
                />
            </div>
            <div class="fc-stat-number">
                <strong>{{ pageData.flights.total }}</strong>
            </div>
            <p class="frame-page__note">
                {{ pageData.flights.domestic }} domestic
                <br />
                {{ pageData.flights.international }} international
                <br />
                {{ pageData.flights.longHaul }} long haul
            </p>
            <div class="stats-page__flight-tabs">
                <span>FLIGHTS PER</span>
                <FcPeriodTabs
                    v-model="metric"
                    :items="pageData.metrics"
                />
            </div>
            <svg
                class="stats-page__line-chart"
                viewBox="0 0 280 170"
                role="img"
                :aria-label="`Flights per ${metric}`"
            >
                <polyline
                    :points="pageData.points[metric]"
                    fill="none"
                    stroke="var(--fc-chart-line)"
                    stroke-width="2"
                />
                <circle
                    v-for="point in chartPoints"
                    :key="point.point"
                    :cx="point.x"
                    :cy="point.y"
                    r="3"
                    fill="var(--fc-chart-line)"
                />
            </svg>
        </section>
        <FcFlightDistanceStats
            v-bind="pageData.distance"
            view="summary"
        />
        <FcFlightDistanceStats
            v-bind="pageData.distance"
            view="breakdown"
        />
        <FcTopAirlines v-bind="pageData.airports" />
        <FcTopAirlines v-bind="pageData.airlines" />
        <FcTopAirlines v-bind="pageData.routes" />
        <FcCountriesStats v-bind="pageData.countries" />
        <p
            v-if="message"
            class="frame-page__feedback"
            role="status"
        >
            {{ message }}
        </p>
    </section>
</template>
