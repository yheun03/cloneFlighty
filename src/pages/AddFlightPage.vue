<template>
    <section class="frame-page add-flight-page">
        <RouterLink class="frame-page__close" :to="{
            name: 'home',
            query: { from: route.query.from, to: route.query.to },
        }" aria-label="Close Add Flight">
            ×
        </RouterLink>
        <template v-if="mode === 'search'">
            <FcAddFlightSearch v-model="query" v-bind="pageData.search" @select="selectResult" />
            <h2 class="frame-page__label">MORE</h2>
            <FcListRow v-for="item in pageData.more" :key="item.name" v-bind="item" @click="openPage(item.name)" />
            <div class="add-flight-page__report">
                <span>Something missing?</span>
                <button type="button" class="frame-page__link" @click="message = pageData.reportMessage">
                    Send Report
                </button>
            </div>
            <p v-if="message" class="frame-page__note" role="status">
                {{ message }}
            </p>
        </template>
        <template v-else>
            <h1 class="frame-page__title">Add Flight</h1>
            <p class="frame-page__lead add-flight-page__hint">
                Enter airline, airport, or flight
            </p>
            <form v-if="mode === 'route'" class="add-flight-page__route" @submit.prevent="showFlights(date)">
                <label for="flight-from">From</label>
                <BaseInput id="flight-from" v-model="from" class="frame-page__input" placeholder="SFO" maxlength="3"
                    required />
                <label for="flight-to">To</label>
                <BaseInput id="flight-to" v-model="to" class="frame-page__input" placeholder="ICN" maxlength="3"
                    required />
                <button type="submit" class="frame-page__primary">
                    Find Flights
                </button>
            </form>
            <template v-else>
                <div class="add-flight-page__fields" :class="{
                    'add-flight-page__fields--number': mode === 'number',
                }">
                    <BaseInput v-if="mode === 'number'" v-model="airline" class="frame-page__input"
                        aria-label="Airline code" maxlength="3" />
                    <BaseInput v-if="mode === 'number'" v-model="flight" class="frame-page__input"
                        aria-label="Flight number" inputmode="numeric" maxlength="4" />
                    <BaseInput v-model="date" placeholder="10/5 or Friday" calendar
                        :calendar-options="pageData.calendar" aria-label="Flight date"
                        @keydown.enter.prevent="showFlights(date)" />
                </div>
                <div v-if="mode === 'number'" class="add-flight-page__dates">
                    <FcListRow v-for="item in pageData.dates" :key="item.date" v-bind="item" avatar="✈"
                        @click="showFlights(item.date)" />
                    <FcListRow title="Pick from Calendar" avatar="✈" @click="openPage('add-flight-calendar')" />
                </div>
                <template v-else>
                    <FcCalendarPicker v-model="calendarDate" v-bind="pageData.calendar" />
                    <button type="button" class="frame-page__link" @click="showFlights(calendarDate)">
                        Show flights on {{ selectedDateLabel }}
                    </button>
                </template>
            </template>
        </template>
    </section>
</template>

<script setup>
import { computed, ref } from "vue";

import { useRoute, useRouter } from "vue-router";

import BaseInput from "../component/base/BaseInput.vue";
import FcAddFlightSearch from "../component/fc/FcAddFlightSearch.vue";
import FcCalendarPicker from "../component/fc/FcCalendarPicker.vue";
import FcListRow from "../component/fc/FcListRow.vue";

import airports from "../common/airports.js";
import airlines from "../common/airlines.js";

import "../assets/scss/component/fc/FcIcon.scss";
import "../assets/scss/component/fc/FcCalendarPicker.scss";
import "../assets/scss/component/fc/FcListRow.scss";
import "../assets/scss/component/fc/FcAddFlightSearch.scss";
import "../assets/scss/pages/AddFlightPage.scss";

// 이 페이지에서 사용하는 샘플 데이터입니다.
// prettier-ignore
const pageData = {
    "query": "",
    "airline": airlines.KE.iata,
    "flight": "9999",
    "date": "",
    "calendarDate": "2026-01-17",
    "from": "SFO",
    "to": "ICN",
    "search": {
        "placeholder": "10/5 or Friday",
        "sectionLabel": "FREQUENTLY USED",
        "items": [
            {
                "title": airlines.KE.name,
                "subtitle": `${airlines.KE.iata}  ·  ${airlines.KE.icao}`,
                "avatar": airlines.KE.logo,
                "type": "airline",
                "code": airlines.KE.iata
            },
            {
                "title": airports.JFK.fullName,
                "subtitle": `${airports.JFK.iata}  ·  ${airports.JFK.icao}  ·  ${airports.JFK.city}`,
                "avatar": "plane",
                "type": "airport",
                "code": airports.JFK.iata
            },
            {
                "title": airports.EWR.fullName,
                "subtitle": `${airports.EWR.iata}  ·  ${airports.EWR.icao}  ·  ${airports.EWR.city}`,
                "avatar": "plane",
                "type": "airport",
                "code": airports.EWR.iata
            },
            {
                "title": airports.BLR.fullName,
                "subtitle": `${airports.BLR.iata}  ·  ${airports.BLR.icao}  ·  ${airports.BLR.city}`,
                "avatar": "plane",
                "type": "airport",
                "code": airports.BLR.iata
            }
        ]
    },
    "more": [
        {
            "title": "Find by Route",
            "avatar": "✈",
            "name": "add-flight-route"
        },
        {
            "title": "Find by Flight Number",
            "avatar": "✈",
            "name": "add-flight-number"
        },
        {
            "title": "Sync from Calendar",
            "subtitle": "Fast, secure, and no setup",
            "avatar": "✈",
            "name": "calendar-sync"
        },
        {
            "title": "Random Flight",
            "subtitle": "Try Pro features for free",
            "avatar": "✈",
            "name": "flight-detail"
        }
    ],
    "dates": [
        {
            "title": "Today",
            "subtitle": "Wed, 7 Jan",
            "date": "2026-01-07"
        },
        {
            "title": "Tomorrow",
            "subtitle": "Thu, 8 Jan",
            "date": "2026-01-08"
        }
    ],
    "calendar": {
        "year": 2026,
        "month": 1,
        "marked": [16],
        "outlined": [6]
    },
    "reportMessage": "Report preview opened."
};

const route = useRoute();
const router = useRouter();
const query = ref(pageData.query);
const airline = ref(pageData.airline);
const flight = ref(pageData.flight);
const date = ref(pageData.date);
const calendarDate = ref(pageData.calendarDate);
const from = ref(pageData.from);
const to = ref(pageData.to);
const message = ref("");
const mode = computed(() => route.meta.searchMode || "search");
const selectedDateLabel = computed(() =>
    new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(
        new Date(`${calendarDate.value}T00:00:00`),
    ),
);

function openPage(name, extra = {}) {
    router.push({
        name,
        params: name === "flight-detail" ? { id: "random" } : {},
        query: {
            ...route.query,
            airline: airline.value,
            flight: flight.value,
            from: from.value,
            to: to.value,
            ...extra,
        },
    });
}

function selectResult(item) {
    if (item.type === "airline") {
        airline.value = item.code;
    } else {
        from.value = item.code;
    }
    openPage("add-flight-number");
}

function showFlights(selectedDate) {
    openPage("flight-results", {
        date: selectedDate,
        from: from.value,
        to: to.value,
    });
}
</script>
