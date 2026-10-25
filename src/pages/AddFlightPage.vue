<template>
    <section class="frame-page add-flight-page">
        <RouterLink class="frame-page__close" :to="{
            name: 'home',
            query: { from: route.query.from, to: route.query.to },
        }" :aria-label="$t('Close Add Flight')">
            ×
        </RouterLink>
        <template v-if="mode === 'search'">
            <FcAddFlightSearch v-model="query" v-bind="searchOptions" @select="selectResult" />
            <h2 class="frame-page__label">{{ $t("MORE") }}</h2>
            <BaseListRow v-for="item in pageData.more" :key="item.name" v-bind="item" @click="openPage(item.name)" />
            <div class="add-flight-page__report">
                <span>{{ $t("Something missing?") }}</span>
                <button type="button" class="frame-page__link" @click="message = pageData.reportMessage">
                    {{ $t("Send Report") }}
                </button>
            </div>
            <p v-if="message" class="frame-page__note" role="status">
                {{ $t(message) }}
            </p>
        </template>
        <template v-else>
            <h1 class="frame-page__title">{{ $t("Add Flight") }}</h1>
            <p class="frame-page__lead add-flight-page__hint">
                {{ $t("Enter airline, airport, or flight") }}
            </p>
            <form v-if="mode === 'route'" class="add-flight-page__route" @submit.prevent="showFlights(date)">
                <label for="flight-from">{{ $t("From") }}</label>
                <BaseInput id="flight-from" v-model="from" class="frame-page__input" :placeholder="$t('SFO')"
                    maxlength="3" required />
                <label for="flight-to">{{ $t("To") }}</label>
                <BaseInput id="flight-to" v-model="to" class="frame-page__input" :placeholder="$t('ICN')" maxlength="3"
                    required />
                <button type="submit" class="frame-page__primary">
                    {{ $t("Find Flights") }}
                </button>
            </form>
            <template v-else>
                <div class="add-flight-page__fields" :class="{
                    'add-flight-page__fields--number': mode === 'number',
                }">
                    <BaseInput v-if="mode === 'number'" v-model="airline" class="frame-page__input"
                        :aria-label="$t('Airline code')" maxlength="3" />
                    <BaseInput v-if="mode === 'number'" v-model="flight" class="frame-page__input"
                        :aria-label="$t('Flight number')" inputmode="numeric" maxlength="4" />
                    <BaseInput v-model="date" :placeholder="$t('10/5 or Friday')" type="calendar"
                        :calendar-options="calendarOptions" :aria-label="$t('Flight date')"
                        @keydown.enter.prevent="showFlights(date)" />
                </div>
                <div v-if="mode === 'number'" class="add-flight-page__dates">
                    <BaseListRow v-for="item in dateOptions" :key="item.date" v-bind="item"
                        :image="airlines[airline]?.logo || ''" @click="showFlights(item.date)" />
                    <BaseListRow :title="$t('Pick from Calendar')" :image="airlines[airline]?.logo || ''"
                        @click="openPage('add-flight-calendar')" />
                </div>
                <template v-else>
                    <BaseCalendarPicker v-model="calendarDate" v-bind="calendarOptions" />
                    <button type="button" class="frame-page__link" @click="showFlights(calendarDate)">
                        {{ $t("Show flights on") }} {{ $t(selectedDateLabel) }}
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
import BaseCalendarPicker from "../component/base/BaseCalendarPicker.vue";
import BaseListRow from "../component/base/BaseListRow.vue";

import airports from "../common/airports.js";
import airlines from "../common/airlines.js";
import { flights } from "../common/flights.js";
import { locale } from "../common/preferences.js";

import routeIcon from "../assets/icons/lucide/route.svg";
import ticketIcon from "../assets/icons/lucide/ticket.svg";
import calendarIcon from "../assets/icons/lucide/calendar-days.svg";
import randomIcon from "../assets/icons/lucide/plane.svg";

import "../assets/scss/component/base/BaseInput.scss";
import "../assets/scss/component/base/BaseButton.scss";
import "../assets/scss/component/base/BaseIcon.scss";
import "../assets/scss/component/base/BaseCalendarPicker.scss";
import "../assets/scss/component/base/BaseListRow.scss";
import "../assets/scss/component/fc/FcAddFlightSearch.scss";
import "../assets/scss/pages/page_add_flight.scss";

// 이 페이지에서 사용하는 샘플 데이터입니다.
// prettier-ignore
const pageData = {
    "more": [
        {
            "title": "Find by Route",
            "icon": routeIcon,
            "name": "add-flight-route"
        },
        {
            "title": "Find by Flight Number",
            "icon": ticketIcon,
            "name": "add-flight-number"
        },
        {
            "title": "Sync from Calendar",
            "subtitle": "Fast, secure, and no setup",
            "icon": calendarIcon,
            "name": "calendar-sync"
        },
        {
            "title": "Random Flight",
            "subtitle": "Try Pro features for free",
            "icon": randomIcon,
            "name": "flight-detail"
        }
    ],
    "reportMessage": "Report preview opened."
};

const route = useRoute();
const router = useRouter();
const upcomingFlights = computed(() =>
    flights.value.filter((item) => !item.friend && !item.isCompleted),
);
const defaultFlight = upcomingFlights.value[0];
const query = ref("");
const airline = ref(String(route.query.airline || defaultFlight.airline));
const flight = ref(String(route.query.flight || defaultFlight.flight));
const date = ref(String(route.query.date || defaultFlight.departureDate));
const calendarDate = ref(date.value);
const from = ref(String(route.query.from || defaultFlight.from));
const to = ref(String(route.query.to || defaultFlight.to));
const searchOptions = computed(() => ({
    placeholder: "Search airline, airport, or flight",
    sectionLabel: "FREQUENTLY USED",
    items: [
        ...[...new Set(upcomingFlights.value.map((item) => item.airline))]
            .map((code) => airlines[code])
            .map((item) => ({
                title: item.name,
                subtitle: `${item.iata} · ${item.icao}`,
                avatar: item.logo,
                type: "airline",
                code: item.iata,
            })),
        ...[
            ...new Set(
                upcomingFlights.value.flatMap((item) => [item.from, item.to]),
            ),
        ]
            .map((code) => airports[code])
            .map((item) => ({
                title: item.fullName,
                subtitle: `${item.iata} · ${item.icao} · ${item.country}`,
                flag: item.flag,
                type: "airport",
                code: item.iata,
            })),
    ],
}));
const matchingFlights = computed(() =>
    upcomingFlights.value.filter(
        (item) =>
            item.airline === airline.value &&
            item.flight === flight.value &&
            item.from === from.value &&
            item.to === to.value,
    ),
);
const dateOptions = computed(() =>
    matchingFlights.value.map((item) => ({
        title: item.date,
        subtitle: `${item.from} → ${item.to}`,
        date: item.departureDate,
    })),
);
const calendarOptions = computed(() => {
    const [year, month] = (date.value || defaultFlight.departureDate)
        .split("-")
        .map(Number);
    return {
        year,
        month,
        marked: matchingFlights.value
            .filter((item) =>
                item.departureDate.startsWith(
                    `${year}-${String(month).padStart(2, "0")}`,
                ),
            )
            .map((item) => Number(item.departureDate.slice(-2))),
        outlined: [],
    };
});
const message = ref("");
const mode = computed(() => route.meta.searchMode || "search");
const selectedDateLabel = computed(() =>
    new Intl.DateTimeFormat(locale.value, {
        month: "long",
        day: "numeric",
    }).format(new Date(`${calendarDate.value}T00:00:00`)),
);

function openPage(name, extra = {}) {
    if (name === "flight-detail") {
        const items = flights.value.filter((item) => !item.friend);
        const item = items[Math.floor(Math.random() * items.length)];
        router.push({
            name,
            params: { id: item.id },
            query: { from: item.from, to: item.to },
        });
        return;
    }
    router.push({
        name,
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
    const match = upcomingFlights.value.find((candidate) =>
        item.type === "airline"
            ? candidate.airline === item.code
            : candidate.from === item.code,
    );
    if (match) {
        airline.value = match.airline;
        flight.value = match.flight;
        from.value = match.from;
        to.value = match.to;
        date.value = match.departureDate;
        calendarDate.value = match.departureDate;
    }
    openPage("add-flight-number");
}

function showFlights(selectedDate) {
    openPage("flight-results", {
        date: selectedDate,
        airline:
            mode.value === "route"
                ? undefined
                : airline.value.trim().toUpperCase(),
        flight: mode.value === "route" ? undefined : flight.value.trim(),
        from: from.value.trim().toUpperCase(),
        to: to.value.trim().toUpperCase(),
    });
}
</script>
