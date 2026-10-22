<template>
    <section
        class="frame-page stats-page aircraft-stats-page"
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
                    "Aircraft types use flight records, with current registry data only when the record is missing.",
                )
            }}
            {{
                $t("Aircraft recorded for {recorded} of {total} flights.", {
                    recorded: statistics.recordedCount,
                    total: periodFlights.length,
                })
            }}
        </p>
        <p
            v-if="!periodFlights.length"
            class="frame-page__note"
            role="status"
        >
            {{ $t("No past flights for this period.") }}
        </p>
        <FcAircraftStats
            :aircraft="statistics.aircraft"
            :show-period="false"
            :show-age="false"
            :show-tail="false"
        />
        <div class="aircraft-stats-page__seat-summary">
            <div>
                <span
                    v-for="row in statistics.seats.class.rows.filter(
                        (row) => row.count,
                    )"
                    :key="row.name"
                >
                    {{ $t(row.name) }}
                </span>
            </div>
            <div class="aircraft-stats-page__seat-bar">
                <span
                    v-for="row in statistics.seats.class.rows.filter(
                        (row) => row.count,
                    )"
                    :key="row.name"
                    :style="{ flexGrow: row.count, background: row.color }"
                    :title="`${$t(row.name)}: ${row.count}`"
                >
                    {{ $t(row.count) }}
                </span>
            </div>
            <p>
                {{ $t("Favorite Seat") }}
                <strong>{{ statistics.seatSummary }}</strong>
            </p>
        </div>
        <FcRankingStats
            v-bind="statistics.types"
            type="aircraft"
        />
        <section class="stats-page__section">
            <div class="fc-stat-head">
                <h2>{{ $t("Class and Seat") }}</h2>
                <BaseButton
                    :label="$t('Share')"
                    :icon="shareIcon"
                    size="md"
                    variant="fill"
                    tone="gray"
                />
            </div>
            <FcSeatStats
                v-bind="statistics.seats.class"
                :show-title="false"
            />
            <FcSeatStats
                v-bind="statistics.seats.seat"
                :show-title="false"
            />
            <FcSeatStats
                v-bind="statistics.seats.reason"
                :show-title="false"
            />
        </section>
        <FcFrequentTails
            v-if="statistics.tails"
            v-bind="statistics.tails"
        />
        <p
            v-else
            class="frame-page__note"
        >
            {{ $t("No recorded tail numbers for this period.") }}
        </p>
        <div class="aircraft-stats-page__age">
            <div class="fc-stat-head">
                <h2>{{ $t("Aircraft Age") }}</h2>
                <BaseButton
                    :label="$t('Share')"
                    :icon="shareIcon"
                    size="md"
                    variant="fill"
                    tone="gray"
                />
            </div>
            <p class="frame-page__note">
                {{
                    $t(
                        "Aircraft manufacture dates are not available in the public data.",
                    )
                }}
            </p>
        </div>
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
import FcAircraftStats from "../component/fc/FcAircraftStats.vue";
import FcRankingStats from "../component/fc/FcRankingStats.vue";
import FcSeatStats from "../component/fc/FcSeatStats.vue";
import FcFrequentTails from "../component/fc/FcFrequentTails.vue";

import { flights, formatDuration } from "../common/flights.js";
import { normalizeRegistration } from "../common/aircraft.js";
import { t, locale } from "../common/preferences.js";
import shareIcon from "../assets/figma/share.svg";

import "../assets/scss/component/base/BaseButton.scss";
import "../assets/scss/component/base/BaseIcon.scss";
import "../assets/scss/component/base/BaseTabItem.scss";
import "../assets/scss/component/fc/_stats.scss";
import "../assets/scss/component/fc/FcAircraftStats.scss";
import "../assets/scss/component/fc/FcSeatStats.scss";
import "../assets/scss/component/fc/FcFrequentTails.scss";
import "../assets/scss/component/fc/FcRankingStats.scss";
import "../assets/scss/layout/_stats.scss";
import "../assets/scss/pages/page_aircraft_stats.scss";

const emit = defineEmits(["map-flights"]);
const pageData = {
    classes: [
        { name: "Economy", color: "var(--fc-economy)" },
        { name: "Premium Economy", color: "var(--fc-premium-economy)" },
        { name: "Business", color: "var(--fc-business)" },
        { name: "First Class", color: "var(--fc-first-class)" },
    ],
    positions: [
        { name: "Aisle", color: "var(--fc-success)" },
        { name: "Middle", color: "#ff9d20" },
        { name: "Window", color: "var(--fc-blue)" },
    ],
    reasons: [
        { name: "Leisure", color: "var(--fc-success)" },
        { name: "Business", color: "var(--fc-blue)" },
    ],
    shareMessage: "Share preview ready.",
};
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
    const models = new Map();
    const tails = new Map();
    const manufacturers = new Map();
    const seats = new Map();
    let recordedCount = 0;

    for (const flight of items) {
        const model = flight.aircraft.model;
        if (model) {
            recordedCount += 1;
            const row = models.get(model) || {
                name: model,
                flights: 0,
                distance: 0,
                minutes: 0,
                recorded: 0,
                image: "",
                imageSource: "",
                imageIsLocal: false,
                source: "",
            };
            row.flights += 1;
            row.distance += flight.distanceKm;
            if (flight.airborneMinutes !== null) {
                row.minutes += flight.airborneMinutes;
                row.recorded += 1;
            }
            if (
                !row.image ||
                (!row.imageIsLocal && flight.aircraft.imageIsLocal)
            ) {
                row.image = flight.aircraft.passportImage;
                row.imageSource = flight.aircraft.imageSource;
                row.imageIsLocal = flight.aircraft.imageIsLocal;
            }
            if (flight.aircraft.lookup?.data)
                row.source ||= flight.aircraft.lookup.source;
            models.set(model, row);
        }
        const tail = normalizeRegistration(flight.aircraft.registration);
        if (tail) {
            const row = tails.get(tail) || {
                tail,
                flights: 0,
                model: model || t("Not recorded"),
                airline: flight.airlineInfo.name,
                flag: "",
            };
            row.flights += 1;
            const country =
                flight.aircraft.lookup?.data?.registered_owner_country_iso_name;
            row.flag = country
                ? [...country]
                      .map((letter) =>
                          String.fromCodePoint(127397 + letter.charCodeAt(0)),
                      )
                      .join("")
                : "";
            tails.set(tail, row);
        }
        // 당시 기록의 제조사를 사용하며 현재 등록 정보로 과거 기종을 교체하지 않습니다.
        const manufacturer = model?.match(/^(Airbus|Boeing|Embraer)\b/)?.[1];
        if (manufacturer)
            manufacturers.set(
                manufacturer,
                (manufacturers.get(manufacturer) || 0) + 1,
            );
        const seat = flight.booking.seat.trim().toUpperCase();
        if (seat) seats.set(seat, (seats.get(seat) || 0) + 1);
    }
    const byCount = (a, b) =>
        b.flights - a.flights ||
        (a.name || a.tail).localeCompare(b.name || b.tail, locale.value);
    const mostFlown = [...models.values()].sort(byCount)[0];
    const topTail = [...tails.values()].sort(byCount)[0] || null;
    const topManufacturer = [...manufacturers].sort(
        (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
    )[0];
    const topSeat = [...seats].sort(
        (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
    )[0];

    function bookingStats(field, categories, mode, topLabel) {
        const rows = categories.map((category) => ({ ...category, count: 0 }));
        for (const flight of items) {
            const name = flight.booking[field] || "Not recorded";
            let row = rows.find((item) => item.name === name);
            if (!row) {
                row = { name, count: 0, color: "var(--fc-text-secondary)" };
                rows.push(row);
            }
            row.count += 1;
        }
        const top = [...rows]
            .filter((row) => row.name !== "Not recorded" && row.count)
            .sort(
                (a, b) =>
                    b.count - a.count ||
                    a.name.localeCompare(b.name, locale.value),
            )[0];
        return {
            mode,
            topLabel,
            topValue: top?.name || "Not recorded",
            rows: rows.map((row) => ({
                ...row,
                percent: items.length
                    ? Math.round((row.count / items.length) * 100)
                    : 0,
            })),
        };
    }
    const seatStats = bookingStats(
        "position",
        pageData.positions,
        "seat",
        "Top Seat",
    );
    seatStats.topValue = topSeat?.[0] || "Not recorded";
    const unknownAge = {
        age: "—",
        model: "Not recorded",
        date: "—",
        image: "",
    };
    return {
        recordedCount,
        aircraft: {
            total: tails.size,
            mostFlown: mostFlown?.name || "Not recorded",
            manufacturer: topManufacturer
                ? `${Math.round((topManufacturer[1] / recordedCount) * 100)}% ${topManufacturer[0]}`
                : "Not recorded",
            newest: unknownAge,
            oldest: unknownAge,
            image: mostFlown?.image || "",
            imageSource: mostFlown?.imageSource || "",
            imageIsLocal: mostFlown?.imageIsLocal || false,
            source: mostFlown?.source || "",
            summary: mostFlown
                ? t(
                      "{count} flights · {duration} recorded ({recorded}/{total})",
                      {
                          count: mostFlown.flights,
                          duration: formatDuration(
                              mostFlown.recorded ? mostFlown.minutes : null,
                          ),
                          recorded: mostFlown.recorded,
                          total: mostFlown.flights,
                      },
                  )
                : "No aircraft history",
            periods: periods.value,
        },
        seatSummary: topSeat
            ? t("{seat} ({count} times)", {
                  seat: topSeat[0],
                  count: topSeat[1],
              })
            : t("Not recorded"),
        types: {
            title: "Aircraft Types",
            total: models.size,
            unit: "total aircraft types",
            items: [...models.values()],
            limit: 8,
            color: "var(--fc-chart-aircraft)",
        },
        seats: {
            class: bookingStats(
                "cabin",
                pageData.classes,
                "class",
                "Top Class",
            ),
            seat: seatStats,
            reason: bookingStats(
                "reason",
                pageData.reasons,
                "reason",
                "Top Reason",
            ),
        },
        tails: topTail,
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
