<template>
    <section class="frame-page passport-page">
        <BaseTabItem
            v-model="period"
            :items="periods"
            :label="$t('Flight history period')"
        />
        <div class="passport-page__card passport-page__card--passport">
            <FcPassportOverview
                v-bind="overview"
                :show-period="false"
                :show-map="false"
                :show-history="false"
            />
            <p>
                {{
                    $t(
                        "Flight time recorded for {recorded} of {total} flights. Distances are great-circle estimates.",
                        {
                            recorded: recordedFlights.length,
                            total: periodFlights.length,
                        },
                    )
                }}
            </p>
            <RouterLink
                class="passport-page__stats-link"
                :to="{
                    name: 'flight-stats',
                    query: { ...route.query, period },
                }"
            >
                {{ $t("All Flight Stats") }}
                <span>›</span>
            </RouterLink>
        </div>
        <div class="passport-page__card passport-page__card--delays">
            <strong class="passport-page__large">
                {{ $t(delays.hours) }}
            </strong>
            <h2>{{ $t("hours lost from delays") }}</h2>
            <p>
                {{
                    $t("Delayed flights averaged {duration} late", {
                        duration: delays.average,
                    })
                }}
            </p>
            <p>
                {{
                    $t(
                        "Arrival times recorded for {recorded} of {total} flights.",
                        {
                            recorded: delays.observed,
                            total: periodFlights.length,
                        },
                    )
                }}
            </p>
            <RouterLink
                class="passport-page__stats-link"
                :to="{ name: 'delay-stats', query: { ...route.query, period } }"
            >
                {{ $t("All Flight Stats") }}
                <span>›</span>
            </RouterLink>
        </div>
        <div class="passport-page__card passport-page__card--aircraft">
            <h2>{{ $t("Most flown aircraft") }}</h2>
            <strong class="passport-page__large">
                {{ $t(aircraft.model) }}
            </strong>
            <p>{{ $t(aircraft.summary) }}</p>
            <div class="passport-page__plane">
                <img
                    v-if="aircraft.image"
                    :src="aircraft.image"
                    :class="{ 'is-local': aircraft.imageIsLocal }"
                    :alt="$t(aircraft.model)"
                />
            </div>
            <RouterLink
                class="passport-page__stats-link"
                :to="{
                    name: 'aircraft-stats',
                    query: { ...route.query, period },
                }"
            >
                {{ $t("All Flight Stats") }}
                <span>›</span>
            </RouterLink>
        </div>
        <h2 class="passport-page__past-title">{{ $t("Past Flights") }}</h2>
        <BaseTabItem
            v-model="group"
            v-model:order="sortOrder"
            :items="pageData.groups"
            type="sort"
            :label="$t('Group past flights')"
        />
        <div
            v-for="history in historyGroups"
            :key="history.id"
            class="passport-page__history"
        >
            <h3>
                <span>
                    <BaseIcon
                        v-if="history.icon"
                        :src="history.icon"
                        variant="image"
                    />
                    {{ $t(history.label) }}
                </span>
                <small>{{ $t(history.count) }}</small>
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
                    :airline="flight.airline"
                    :flight="flight.flight"
                    :title="$t(flight.title)"
                    :date="flight.date"
                    :departure="flight.departure"
                    :arrival="flight.arrival"
                    :duration="flight.duration"
                    :flight-time="flight.flightTime"
                    variant="history"
                />
            </RouterLink>
        </div>
        <p
            class="sr-only"
            role="status"
        >
            {{
                $t(
                    group
                        ? `${t(group)}: ${t(sortOrder === "desc" ? "Descending" : "Ascending")}`
                        : t("Date: newest first"),
                )
            }}
        </p>
        <p
            v-if="!historyGroups.length"
            class="frame-page__note"
            role="status"
        >
            {{ $t("No past flights for this period.") }}
        </p>
    </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";

import { useRoute, useRouter } from "vue-router";

import BaseTabItem from "../component/base/BaseTabItem.vue";
import BaseIcon from "../component/base/BaseIcon.vue";
import FcPassportOverview from "../component/fc/FcPassportOverview.vue";
import FcFlightListItem from "../component/fc/FcFlightListItem.vue";

import { flights, formatDuration } from "../common/flights.js";
import { t, formatDistance, locale } from "../common/preferences.js";

import "../assets/scss/component/base/BaseIcon.scss";
import "../assets/scss/component/base/BaseTabItem.scss";
import "../assets/scss/component/fc/FcFlightListItem.scss";
import "../assets/scss/component/fc/FcPassportOverview.scss";
import "../assets/scss/pages/page_passport.scss";

const emit = defineEmits(["map-flights"]);

const pageData = {
    groups: [
        "Aisle",
        "From",
        "To",
        "Airline",
        "Airport",
        "Tail",
        "Aircraft",
        "Flight Time",
    ],
};

const route = useRoute();
const router = useRouter();
const period = computed({
    get: () => String(route.query.period || "ALL-TIME"),
    set: (value) =>
        router.replace({ query: { ...route.query, period: value } }),
});
const group = ref("");
const sortOrder = ref("");
const pastFlights = computed(() =>
    flights.value.filter((flight) => flight.isCompleted && !flight.friend),
);
const periods = computed(() => [
    "ALL-TIME",
    ...[...new Set(pastFlights.value.map((flight) => flight.year))].sort(
        (a, b) => Number(b) - Number(a),
    ),
]);
const periodFlights = computed(() =>
    pastFlights.value.filter(
        (flight) => period.value === "ALL-TIME" || flight.year === period.value,
    ),
);
const recordedFlights = computed(() =>
    periodFlights.value.filter((flight) => flight.airborneMinutes !== null),
);
const overview = computed(() => {
    const items = periodFlights.value;
    const airports = items.flatMap((flight) => [
        flight.departureAirport,
        flight.arrivalAirport,
    ]);
    return {
        flights: items.length,
        distance: `≈ ${formatDistance(items.reduce((sum, flight) => sum + flight.distanceKm, 0))}`,
        flightTime: formatDuration(
            recordedFlights.value.length
                ? recordedFlights.value.reduce(
                      (sum, flight) => sum + flight.airborneMinutes,
                      0,
                  )
                : null,
        ),
        airports: new Set(airports.map((airport) => airport.iata)).size,
        airlines: new Set(items.map((flight) => flight.airline)).size,
        periods: periods.value,
        mapFrom: items[0]?.from || "ICN",
        mapTo: items[0]?.to || "ICN",
        flags: [...new Set(airports.map((airport) => airport.flag))].join(" "),
        historyTitle: period.value,
        historyCount: `${items.length} FLIGHTS`,
        recent: [],
    };
});
const delays = computed(() => {
    const delayed = periodFlights.value.filter(
        (flight) => flight.arrivalDelayMinutes > 0,
    );
    const minutes = delayed.reduce(
        (sum, flight) => sum + flight.arrivalDelayMinutes,
        0,
    );
    return {
        observed: periodFlights.value.filter(
            (flight) => flight.arrivalDelayMinutes !== null,
        ).length,
        hours: Math.round((minutes / 60) * 10) / 10,
        average: formatDuration(
            delayed.length ? Math.round(minutes / delayed.length) : null,
        ),
    };
});
const aircraft = computed(() => {
    const models = new Map();
    for (const flight of periodFlights.value) {
        const model = flight.aircraft.model;
        const summary = models.get(model) || {
            model,
            count: 0,
            minutes: 0,
            recorded: 0,
            image: flight.aircraft.passportImage,
            imageIsLocal: flight.aircraft.imageIsLocal,
        };
        summary.count += 1;
        if (flight.airborneMinutes !== null) {
            summary.minutes += flight.airborneMinutes;
            summary.recorded += 1;
        }
        if (
            !summary.image ||
            (!summary.imageIsLocal && flight.aircraft.imageIsLocal)
        ) {
            summary.image = flight.aircraft.passportImage;
            summary.imageIsLocal = flight.aircraft.imageIsLocal;
        }
        models.set(model, summary);
    }
    const mostFlown = [...models.values()].sort((a, b) => b.count - a.count)[0];
    return mostFlown
        ? {
              ...mostFlown,
              summary: t(
                  "{count} flights · {duration} recorded ({recorded}/{total})",
                  {
                      count: mostFlown.count,
                      duration: formatDuration(
                          mostFlown.recorded ? mostFlown.minutes : null,
                      ),
                      recorded: mostFlown.recorded,
                      total: mostFlown.count,
                  },
              ),
          }
        : { model: "—", image: "", summary: "No aircraft history" };
});
const historyGroups = computed(() => {
    const groups = new Map();
    for (const flight of periodFlights.value) {
        let value = flight.year;
        let label = flight.year;
        let icon = "";
        const from = flight.departureAirport;
        const to = flight.arrivalAirport;

        switch (group.value) {
            case "Aisle":
                value = flight.booking.position || null;
                label = value || "Not recorded";
                break;
            case "From":
                value = flight.from;
                label = `${from.city} (${from.iata})`;
                icon = from.flagIcon;
                break;
            case "To":
                value = flight.to;
                label = `${to.city} (${to.iata})`;
                icon = to.flagIcon;
                break;
            case "Airline":
                value = flight.airlineInfo.name;
                label = value;
                icon = flight.airlineInfo.logo;
                break;
            case "Airport":
                value = `${flight.from}-${flight.to}`;
                label = `${flight.from} → ${flight.to}`;
                break;
            case "Tail":
                value = flight.aircraft.registration;
                label = value || "Not recorded";
                break;
            case "Aircraft":
                value = flight.aircraft.model;
                label = value;
                break;
            case "Flight Time":
                value = flight.airborneMinutes;
                label = value === null ? "Not recorded" : formatDuration(value);
                break;
        }

        if (!groups.has(value))
            groups.set(value, {
                id: String(value),
                label,
                icon,
                value,
                flights: [],
            });
        groups.get(value).flights.push(flight);
    }

    const direction = group.value && sortOrder.value === "asc" ? 1 : -1;
    return [...groups.values()]
        .sort((a, b) => {
            if (a.value === null && b.value === null) return 0;
            if (a.value === null) return 1;
            if (b.value === null) return -1;
            return (
                direction *
                (typeof a.value === "number"
                    ? a.value - b.value
                    : String(a.value).localeCompare(
                          String(b.value),
                          locale.value,
                          {
                              numeric: true,
                          },
                      ))
            );
        })
        .map((history) => ({
            ...history,
            count: `${history.flights.length} ${history.flights.length === 1 ? "FLIGHT" : "FLIGHTS"}`,
            flights: [...history.flights].sort(
                (a, b) => Date.parse(b.departureAt) - Date.parse(a.departureAt),
            ),
        }));
});

watch(periodFlights, (items) => emit("map-flights", items), {
    immediate: true,
});
</script>
