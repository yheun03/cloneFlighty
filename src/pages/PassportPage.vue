<script setup>
import { ref } from "vue";

import { useRoute } from "vue-router";

import FcPeriodTabs from "../component/fc/FcPeriodTabs.vue";
import FcPassportOverview from "../component/fc/FcPassportOverview.vue";
import FcFlightListItem from "../component/fc/FcFlightListItem.vue";
import FcIcon from "../component/fc/FcIcon.vue";

import planeIcon from "../assets/icons/lucide/plane.svg";

import pageData from "./data/PassportPage.json";

const route = useRoute();
const period = ref(pageData.period);
const group = ref(pageData.group);
</script>

<template>
    <section class="frame-page passport-page">
        <FcPeriodTabs
            v-model="period"
            :items="pageData.periods"
        />
        <div class="passport-page__card passport-page__card--passport">
            <FcPassportOverview
                v-bind="pageData.overview"
                :show-period="false"
                :show-map="false"
                :show-history="false"
            />
            <RouterLink
                class="passport-page__stats-link"
                :to="{
                    name: 'flight-stats',
                    query: { ...route.query, period },
                }"
            >
                All Flight Stats
                <span>›</span>
            </RouterLink>
        </div>
        <div class="passport-page__card passport-page__card--delays">
            <strong class="passport-page__large">
                {{ pageData.delays.hours }}
            </strong>
            <h2>hours lost from delays</h2>
            <p>Delayed flights averaged {{ pageData.delays.average }} late</p>
            <RouterLink
                class="passport-page__stats-link"
                :to="{ name: 'delay-stats', query: { ...route.query, period } }"
            >
                All Flight Stats
                <span>›</span>
            </RouterLink>
        </div>
        <div class="passport-page__card passport-page__card--aircraft">
            <h2>Most flown aircraft</h2>
            <strong class="passport-page__large">
                {{ pageData.aircraft.model }}
            </strong>
            <p>{{ pageData.aircraft.summary }}</p>
            <div class="passport-page__plane"><FcIcon :src="planeIcon" /></div>
            <RouterLink
                class="passport-page__stats-link"
                :to="{
                    name: 'aircraft-stats',
                    query: { ...route.query, period },
                }"
            >
                All Flight Stats
                <span>›</span>
            </RouterLink>
        </div>
        <h2 class="passport-page__past-title">Past Flights</h2>
        <FcPeriodTabs
            v-model="group"
            :items="pageData.groups"
            label="Group past flights"
        />
        <div
            v-for="history in pageData.historyGroups"
            :key="history.id"
            class="passport-page__history"
        >
            <h3>
                {{ history.labels[group] }}
                <small>{{ history.count }}</small>
            </h3>
            <RouterLink
                v-for="flight in history.flights"
                :key="flight.id"
                :to="{
                    name: 'flight-detail',
                    params: { id: flight.id },
                    query: { ...route.query, from: flight.from, to: flight.to },
                }"
            >
                <FcFlightListItem
                    v-bind="flight"
                    variant="history"
                />
            </RouterLink>
        </div>
    </section>
</template>
