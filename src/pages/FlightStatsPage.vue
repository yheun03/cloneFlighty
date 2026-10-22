<template>
    <section
        class="frame-page stats-page flight-stats-page"
        @click="share"
    >
        <BaseTabItem
            v-model="period"
            :items="periods"
            :label="$t('Flight statistics period')"
        />
        <FcPassportOverview
            v-bind="statistics.overview"
            :show-period="false"
            :show-history="false"
        />
        <p class="frame-page__note">
            {{ $t("Completed flights only.") }}
            {{
                $t(
                    "Flight time recorded for {recorded} of {total} flights. Distances are great-circle estimates.",
                    {
                        recorded: statistics.recordedCount,
                        total: periodFlights.length,
                    },
                )
            }}
        </p>
        <p
            v-if="!periodFlights.length"
            class="frame-page__note"
            role="status"
        >
            {{ $t("No past flights for this period.") }}
        </p>
        <section class="stats-page__section">
            <div class="fc-stat-head">
                <h2>{{ $t("Flights") }}</h2>
                <BaseButton
                    :label="$t('Share')"
                    :icon="shareIcon"
                    size="md"
                    variant="fill"
                    tone="gray"
                />
            </div>
            <div class="fc-stat-number">
                <strong>{{ $t(statistics.totals.total) }}</strong>
            </div>
            <p class="frame-page__note">
                {{ $t(statistics.totals.domestic) }} {{ $t("domestic") }}
                <br />
                {{ $t(statistics.totals.international) }}
                {{ $t("international") }}
                <br />
                {{ $t(statistics.totals.longHaul) }} {{ $t("long haul") }}
            </p>
            <p class="frame-page__note">
                {{ $t("Long haul: scheduled duration of 6h or more.") }}
            </p>
            <div class="stats-page__flight-tabs">
                <span>{{ $t("FLIGHTS PER") }}</span>
                <BaseTabItem
                    v-model="metric"
                    :items="pageData.metrics"
                    :label="$t('Flights per')"
                    size="sm"
                />
            </div>
            <svg
                class="stats-page__line-chart"
                viewBox="0 0 280 180"
                role="img"
                :aria-label="$t(chartLabel)"
            >
                <polyline
                    :points="
                        chartPoints
                            .map((point) => `${point.x},${point.y}`)
                            .join(' ')
                    "
                    fill="none"
                    stroke="var(--fc-chart-line)"
                    stroke-width="2"
                />
                <g
                    v-for="point in chartPoints"
                    :key="point.label"
                    aria-hidden="true"
                >
                    <circle
                        :cx="point.x"
                        :cy="point.y"
                        r="3"
                        fill="var(--fc-chart-line)"
                    />
                    <text
                        class="stats-page__chart-count"
                        :x="point.x"
                        :y="point.y - 8"
                        text-anchor="middle"
                    >
                        {{ $t(point.count) }}
                    </text>
                    <text
                        class="stats-page__chart-label"
                        :x="point.x"
                        y="165"
                        text-anchor="middle"
                    >
                        {{ $t(point.label) }}
                    </text>
                </g>
            </svg>
        </section>
        <FcFlightDistanceStats
            v-bind="statistics.distance"
            view="summary"
        />
        <FcFlightDistanceStats
            v-bind="statistics.distance"
            view="breakdown"
        />
        <FcRankingStats
            v-bind="statistics.airports"
            type="airport"
        />
        <FcRankingStats
            v-bind="statistics.airlines"
            type="airline"
        />
        <FcRankingStats
            v-bind="statistics.routes"
            type="route"
        />
        <FcCountriesStats v-bind="statistics.countries" />
        <p class="frame-page__note">
            {{
                $t(
                    "Country flights include departures or arrivals, counted once per flight. Region totals count distinct countries and territories.",
                )
            }}
        </p>
        <p
            v-if="message"
            class="frame-page__feedback"
            role="status"
        >
            {{ $t(message) }}
        </p>
    </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";

import { useRoute, useRouter } from "vue-router";

import BaseButton from "../component/base/BaseButton.vue";
import BaseTabItem from "../component/base/BaseTabItem.vue";
import FcPassportOverview from "../component/fc/FcPassportOverview.vue";
import FcFlightDistanceStats from "../component/fc/FcFlightDistanceStats.vue";
import FcRankingStats from "../component/fc/FcRankingStats.vue";
import FcCountriesStats from "../component/fc/FcCountriesStats.vue";

import { flights, formatDuration } from "../common/flights.js";
import { t, locale, formatDistance } from "../common/preferences.js";
import shareIcon from "../assets/figma/share.svg";

import "../assets/scss/component/base/BaseButton.scss";
import "../assets/scss/component/base/BaseIcon.scss";
import "../assets/scss/component/base/BaseTabItem.scss";
import "../assets/scss/component/fc/_stats.scss";
import "../assets/scss/component/fc/FcPassportOverview.scss";
import "../assets/scss/component/fc/FcCountriesStats.scss";
import "../assets/scss/component/fc/FcRankingStats.scss";
import "../assets/scss/component/fc/FcFlightDistanceStats.scss";
import "../assets/scss/layout/_stats.scss";
import "../assets/scss/pages/page_flight_stats.scss";

const emit = defineEmits(["map-flights"]);
const pageData = {
    metrics: ["Year", "Month", "Weekday"],
    shareMessage: "Share preview ready.",
};
const regionNames = {
    AS: "Asia",
    EU: "Europe",
    NA: "N. America",
    SA: "S. America",
    AF: "Africa",
    OC: "Oceania",
    AN: "Antarctica",
};
// 거리 비교 기준: https://science.nasa.gov/moon/by-the-numbers/
const distanceComparisons = [
    { icon: "earth", label: "Around Earth", km: 40030.2 },
    { icon: "moon", label: "To the Moon", km: 384400 },
    { icon: "sun", label: "To the Sun", km: 149598262 },
];
const route = useRoute();
const router = useRouter();
const period = computed({
    get: () => String(route.query.period || "ALL-TIME"),
    set: (value) =>
        router.replace({ query: { ...route.query, period: value } }),
});
const metric = ref(pageData.metrics[0]);
const message = ref("");
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
const statistics = computed(() => {
    const items = periodFlights.value;
    const recorded = items.filter((flight) => flight.airborneMinutes !== null);
    const airMinutes = recorded.length
        ? recorded.reduce((sum, flight) => sum + flight.airborneMinutes, 0)
        : null;
    const taxiFlights = recorded.filter(
        (flight) =>
            flight.departureInfo.actualAt && flight.arrivalInfo.actualAt,
    );
    const taxiMinutes = taxiFlights.length
        ? taxiFlights.reduce(
              (sum, flight) =>
                  sum + flight.durationMinutes - flight.airborneMinutes,
              0,
          )
        : null;
    const distanceKm = items.reduce(
        (sum, flight) => sum + flight.distanceKm,
        0,
    );
    const domestic = items.filter(
        (flight) =>
            flight.departureAirport.countryCode ===
            flight.arrivalAirport.countryCode,
    ).length;
    const airportRows = new Map();
    const airlineRows = new Map();
    const routeRows = new Map();
    const countryRows = new Map();

    for (const flight of items) {
        const airline = airlineRows.get(flight.airline) || {
            iata: flight.airline,
            name: flight.airlineInfo.name,
            flights: 0,
            distance: 0,
        };
        airline.flights += 1;
        airline.distance += flight.distanceKm;
        airlineRows.set(flight.airline, airline);

        // 왕복 노선은 같은 공항 쌍으로 묶습니다.
        const routeName = [flight.from, flight.to].sort().join("–");
        const pair = routeRows.get(routeName) || {
            name: routeName,
            flights: 0,
            distance: 0,
        };
        pair.flights += 1;
        pair.distance += flight.distanceKm;
        routeRows.set(routeName, pair);

        const visitedCountries = new Set();
        const visitedAirports = new Set();
        for (const airport of [
            flight.departureAirport,
            flight.arrivalAirport,
        ]) {
            if (!visitedAirports.has(airport.iata)) {
                const row = airportRows.get(airport.iata) || {
                    name: airport.iata,
                    flights: 0,
                    distance: 0,
                };
                row.flights += 1;
                row.distance += flight.distanceKm;
                airportRows.set(airport.iata, row);
                visitedAirports.add(airport.iata);
            }
            if (!visitedCountries.has(airport.countryCode)) {
                const country = countryRows.get(airport.countryCode) || {
                    name: airport.country,
                    flag: airport.flag,
                    continent: airport.continent,
                    count: 0,
                };
                country.count += 1;
                countryRows.set(airport.countryCode, country);
                visitedCountries.add(airport.countryCode);
            }
        }
    }

    const countries = [...countryRows.values()].sort(
        (a, b) =>
            b.count - a.count || a.name.localeCompare(b.name, locale.value),
    );
    const regionRows = new Map();
    for (const country of countries) {
        const name = regionNames[country.continent] || "Other";
        regionRows.set(name, (regionRows.get(name) || 0) + 1);
    }
    const regions = [...regionRows]
        .map(([name, count]) => ({
            name,
            count,
            percent: `${Math.round((count / countries.length) * 100)}%`,
        }))
        .sort(
            (a, b) =>
                b.count - a.count || a.name.localeCompare(b.name, locale.value),
        );
    const byDistance = [...items].sort(
        (a, b) =>
            a.distanceKm - b.distanceKm ||
            Date.parse(a.departureAt) - Date.parse(b.departureAt),
    );
    const extremes = [
        { title: "Shortest flight", flight: byDistance[0] },
        { title: "Longest flight", flight: byDistance.at(-1) },
    ].map(({ title, flight }) => ({
        title,
        route: flight
            ? `${flight.departureAirport.city} → ${flight.arrivalAirport.city}`
            : "—",
        distance: flight ? `≈ ${formatDistance(flight.distanceKm)}` : "—",
        detail: flight
            ? `${flight.airline} ${flight.flight} · ${flight.date}`
            : "No flights in this period",
    }));

    return {
        recordedCount: recorded.length,
        overview: {
            flights: items.length,
            distance: `≈ ${formatDistance(distanceKm)}`,
            flightTime: formatDuration(airMinutes),
            airports: airportRows.size,
            airlines: airlineRows.size,
            periods: periods.value,
            mapFrom: items[0]?.from || "ICN",
            mapTo: items[0]?.to || "ICN",
            flags: countries.map((country) => country.flag).join(" "),
            historyTitle: period.value,
            historyCount: `${items.length} FLIGHTS`,
            recent: [],
        },
        totals: {
            total: items.length,
            domestic,
            international: items.length - domestic,
            longHaul: items.filter(
                (flight) =>
                    Date.parse(flight.arrivalInfo.scheduledAt) -
                        Date.parse(flight.departureInfo.scheduledAt) >=
                    6 * 60 * 60000,
            ).length,
        },
        distance: {
            title: "Flight Distance",
            shareLabel: "Share",
            shareIcon: "share",
            distance: `≈ ${distanceKm.toLocaleString("en-US")}`,
            distanceUnit: "km",
            miles: `≈ ${Math.round(distanceKm / 1.609344).toLocaleString("en-US")}`,
            milesUnit: "mi",
            breakdown: [
                {
                    label: "Days in air",
                    value:
                        airMinutes === null
                            ? "—"
                            : (airMinutes / 1440).toFixed(2),
                },
                {
                    label: "Weeks in air",
                    value:
                        airMinutes === null
                            ? "—"
                            : (airMinutes / 10080).toFixed(2),
                },
                {
                    label: "Months in air (30 days)",
                    value:
                        airMinutes === null
                            ? "—"
                            : (airMinutes / 43200).toFixed(3),
                },
                {
                    label: "Years in air (365 days)",
                    value:
                        airMinutes === null
                            ? "—"
                            : (airMinutes / 525600).toFixed(4),
                },
                {
                    label: "Avg. recorded flight time",
                    value: formatDuration(
                        recorded.length
                            ? Math.round(airMinutes / recorded.length)
                            : null,
                    ),
                },
                { label: "In Air", value: formatDuration(airMinutes) },
                {
                    label: t("Taxiing ({count} flights)", {
                        count: taxiFlights.length,
                    }),
                    value: formatDuration(taxiMinutes),
                },
            ],
            averageLabel: items.length
                ? t("Average distance: {distance}", {
                      distance: `≈ ${formatDistance(distanceKm / items.length)}`,
                  })
                : "Average distance: —",
            comparisons: distanceComparisons.map((item) => ({
                icon: item.icon,
                text: `${(distanceKm / item.km).toLocaleString(locale.value, { maximumSignificantDigits: 2 })}x ${t(item.label)}`,
            })),
            summaryLabel: "Show Summary",
            breakdownLabel: "Show Breakdown",
            shortestFlight: extremes[0],
            longestFlight: extremes[1],
        },
        airports: {
            title: "Top Airports",
            total: airportRows.size,
            unit: "total airports",
            items: [...airportRows.values()],
            limit: 8,
        },
        airlines: {
            title: "Top Airlines",
            total: airlineRows.size,
            unit: "total airlines",
            items: [...airlineRows.values()],
        },
        routes: {
            title: "Top Routes",
            total: routeRows.size,
            unit: "airport pairs",
            items: [...routeRows.values()],
            limit: 4,
        },
        countries: { total: countries.length, countries, regions },
    };
});
const chartData = computed(() => {
    const items = periodFlights.value;
    if (metric.value === "Month") {
        return [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ].map((label, index) => ({
            label: new Intl.DateTimeFormat(locale.value, {
                month: "short",
                timeZone: "UTC",
            }).format(new Date(Date.UTC(2026, index, 1))),
            count: items.filter(
                (flight) =>
                    Number(flight.departureDate.slice(5, 7)) === index + 1,
            ).length,
        }));
    }
    if (metric.value === "Weekday") {
        return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
            (label, index) => ({
                label: new Intl.DateTimeFormat(locale.value, {
                    weekday: "short",
                    timeZone: "UTC",
                }).format(new Date(Date.UTC(2026, 0, 5 + index))),
                count: items.filter(
                    (flight) =>
                        (new Date(
                            `${flight.departureDate}T00:00:00Z`,
                        ).getUTCDay() +
                            6) %
                            7 ===
                        index,
                ).length,
            }),
        );
    }
    if (!items.length) return [];
    const years = items.map((flight) => Number(flight.year));
    const first = Math.min(...years);
    return Array.from(
        { length: Math.max(...years) - first + 1 },
        (_, index) => ({
            label: String(first + index),
            count: items.filter(
                (flight) => Number(flight.year) === first + index,
            ).length,
        }),
    );
});
const chartPoints = computed(() => {
    const maximum = Math.max(1, ...chartData.value.map((item) => item.count));
    return chartData.value.map((item, index) => ({
        ...item,
        x:
            chartData.value.length === 1
                ? 140
                : 10 + (index * 260) / (chartData.value.length - 1),
        y: 142 - (item.count / maximum) * 120,
    }));
});
const chartLabel = computed(
    () =>
        `${t("Flights per")} ${t(metric.value)}: ${chartData.value.map((item) => `${item.label}: ${item.count}`).join(", ")}`,
);

watch(periodFlights, (items) => emit("map-flights", items), {
    immediate: true,
});

function share(event) {
    if (event.target.closest(".fc-stat-head .fc-button")) {
        message.value = pageData.shareMessage;
    }
}
</script>
