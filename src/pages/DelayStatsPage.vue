<template>
    <section
        class="frame-page stats-page delay-stats-page"
        @click="share"
    >
        <BaseTabItem
            v-model="period"
            :items="periods"
            :label="$t('Flight statistics period')"
        />
        <p class="frame-page__note">
            {{ $t("Completed flights only.") }}
            {{
                $t(
                    "Arrival times recorded for {recorded} of {total} flights.",
                    {
                        recorded: statistics.arrivalCount,
                        total: periodFlights.length,
                    },
                )
            }}
            {{
                $t(
                    "Departure times recorded for {recorded} of {total} flights.",
                    {
                        recorded: statistics.departureCount,
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
        <FcDelayReport
            v-bind="statistics.report"
            :period="period"
        />
        <FcAirlinePerformance
            :report="statistics.performance"
            section="mine"
        />
        <FcAirlinePerformance
            :report="statistics.performance"
            section="delays"
        />
        <FcAirlinePerformance
            :report="statistics.performance"
            section="airline"
        />
        <FcAirlinePerformance
            :report="statistics.performance"
            section="airport"
        />
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

import BaseTabItem from "../component/base/BaseTabItem.vue";
import FcDelayReport from "../component/fc/FcDelayReport.vue";
import FcAirlinePerformance from "../component/fc/FcAirlinePerformance.vue";

import { flights, formatDuration } from "../common/flights.js";
import { t, locale } from "../common/preferences.js";

import "../assets/scss/component/base/BaseButton.scss";
import "../assets/scss/component/base/BaseIcon.scss";
import "../assets/scss/component/base/BaseTabItem.scss";
import "../assets/scss/component/fc/_stats.scss";
import "../assets/scss/component/fc/FcDelayReport.scss";
import "../assets/scss/component/fc/FcAirlinePerformance.scss";
import "../assets/scss/layout/_stats.scss";
import "../assets/scss/pages/page_delay_stats.scss";

const emit = defineEmits(["map-flights"]);
const pageData = { shareMessage: "Share preview ready." };
const route = useRoute();
const router = useRouter();
const period = computed({
    get: () => String(route.query.period || "ALL-TIME"),
    set: (value) =>
        router.replace({ query: { ...route.query, period: value } }),
});
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
    const arrivals = items.filter(
        (flight) => flight.arrivalDelayMinutes !== null,
    );
    const departures = items.filter(
        (flight) => flight.departureDelayMinutes !== null,
    );
    const delayed = arrivals
        .filter((flight) => flight.arrivalDelayMinutes > 0)
        .sort(
            (a, b) =>
                b.arrivalDelayMinutes - a.arrivalDelayMinutes ||
                a.id.localeCompare(b.id),
        );
    const minutes = delayed.reduce(
        (sum, flight) => sum + flight.arrivalDelayMinutes,
        0,
    );
    const netMinutes = arrivals.reduce(
        (sum, flight) => sum + flight.arrivalDelayMinutes,
        0,
    );
    const airlines = new Map();
    const airports = new Map();
    for (const flight of arrivals) {
        const row = airlines.get(flight.airline) || {
            name: flight.airlineInfo.name,
            total: 0,
            delayed: 0,
            minutes: 0,
        };
        row.total += 1;
        if (flight.arrivalDelayMinutes > 0) {
            row.delayed += 1;
            row.minutes += flight.arrivalDelayMinutes;
        }
        airlines.set(flight.airline, row);
    }
    for (const flight of departures) {
        const row = airports.get(flight.from) || {
            name: `${flight.departureAirport.flag} ${flight.from}`,
            total: 0,
            delayed: 0,
        };
        row.total += 1;
        if (flight.departureDelayMinutes > 0) row.delayed += 1;
        airports.set(flight.from, row);
    }
    const percent = (count, total) =>
        total ? Math.round((count / total) * 100) : null;
    const ranking = (rows) =>
        [...rows.values()]
            .map((row) => ({
                ...row,
                percent: percent(row.delayed, row.total),
                count: `${row.delayed}/${row.total}`,
            }))
            .sort(
                (a, b) =>
                    b.percent - a.percent ||
                    b.total - a.total ||
                    a.name.localeCompare(b.name, locale.value),
            );
    const worstAirline = [...airlines.values()]
        .filter((row) => row.delayed)
        .sort(
            (a, b) =>
                b.minutes - a.minutes ||
                a.name.localeCompare(b.name, locale.value),
        )[0];
    const worst = delayed[0];
    const buckets = [
        {
            label: "Early",
            count: arrivals.filter((flight) => flight.arrivalDelayMinutes < 0)
                .length,
            color: "var(--fc-success)",
        },
        {
            label: "On Time",
            count: arrivals.filter((flight) => flight.arrivalDelayMinutes === 0)
                .length,
            color: "#53d96c",
        },
        {
            label: "1–14m late",
            count: arrivals.filter(
                (flight) =>
                    flight.arrivalDelayMinutes > 0 &&
                    flight.arrivalDelayMinutes < 15,
            ).length,
            color: "#ffca2d",
        },
        {
            label: "15–29m late",
            count: arrivals.filter(
                (flight) =>
                    flight.arrivalDelayMinutes >= 15 &&
                    flight.arrivalDelayMinutes < 30,
            ).length,
            color: "#ffb02d",
        },
        {
            label: "30–44m late",
            count: arrivals.filter(
                (flight) =>
                    flight.arrivalDelayMinutes >= 30 &&
                    flight.arrivalDelayMinutes < 45,
            ).length,
            color: "#ff9d20",
        },
        {
            label: "45m+ late",
            count: arrivals.filter((flight) => flight.arrivalDelayMinutes >= 45)
                .length,
            color: "var(--fc-danger)",
        },
    ];
    return {
        arrivalCount: arrivals.length,
        departureCount: departures.length,
        report: {
            delayed: delayed.length,
            total: arrivals.length,
            lostMinutes: arrivals.length ? minutes : null,
            worstDelay: worst
                ? `${worst.airline} ${worst.flight} · ${t("{duration} Late", { duration: formatDuration(worst.arrivalDelayMinutes) })}`
                : arrivals.length
                  ? "No delayed arrivals"
                  : "Not recorded",
            worstAirline: worstAirline
                ? `${worstAirline.name} · ${formatDuration(worstAirline.minutes)}`
                : arrivals.length
                  ? "No delayed arrivals"
                  : "Not recorded",
        },
        performance: {
            airports: ranking(airports),
            airlines: ranking(airlines),
            airportHeadline: departures.length
                ? `${percent(departures.filter((flight) => flight.departureDelayMinutes > 0).length, departures.length)}%`
                : "—",
            airlineHeadline: arrivals.length
                ? `${percent(delayed.length, arrivals.length)}%`
                : "—",
            cumulative: arrivals.length
                ? formatDuration(Math.abs(netMinutes))
                : "—",
            cumulativeTiming: !arrivals.length
                ? "Not recorded"
                : netMinutes < 0
                  ? "Early"
                  : netMinutes > 0
                    ? "Late"
                    : "On Time",
            performance: arrivals.length
                ? buckets.map((bucket) => ({
                      ...bucket,
                      value: percent(bucket.count, arrivals.length),
                  }))
                : [],
            delayTotal: delayed.length,
            delays: delayed.map((flight) => ({
                id: flight.id,
                flight: `${flight.airline} ${flight.flight}`,
                duration: formatDuration(flight.arrivalDelayMinutes),
                route: `${flight.from} → ${flight.to}`,
                date: flight.date,
            })),
        },
    };
});

watch(periodFlights, (items) => emit("map-flights", items), {
    immediate: true,
});

function share(event) {
    if (event.target.closest(".fc-stat-head .fc-button"))
        message.value = pageData.shareMessage;
}
</script>
