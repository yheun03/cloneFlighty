<template>
    <section class="frame-page flight-detail-page">
        <div
            v-if="flight"
            :inert="editing || undefined"
            :class="{ 'flight-detail-page__background--blurred': editing }"
        >
            <FcFlightListItem
                variant="header"
                :airline="flight.airline"
                :flight="flight.flight"
                :title="flight.title"
                :date="flight.date"
                :departure="flight.departure"
                :arrival="flight.arrival"
                @remove="closeFlight"
            />
            <FcFlightDetails
                :details="details"
                :completed="flight.isCompleted"
                :booking-code="booking.code"
                :seat="booking.seat"
                @edit="editBooking"
                @connection="openConnection"
            />
        </div>
        <p
            v-else
            class="frame-page__note"
            role="status"
        >
            Flight not found.
            <RouterLink :to="{ name: 'home' }">Back to flights</RouterLink>
        </p>
        <RouterView
            v-if="flight"
            v-slot="{ Component }"
        >
            <component
                :is="Component"
                v-model="booking"
            />
        </RouterView>
    </section>
</template>

<script setup>
import { computed } from "vue";

import { useRoute, useRouter } from "vue-router";

import FcFlightListItem from "../component/fc/FcFlightListItem.vue";
import FcFlightDetails from "../component/fc/FcFlightDetails.vue";

import { flights, getFlight, formatDuration } from "../common/flights.js";

import "../assets/scss/component/base/BaseIcon.scss";
import "../assets/scss/component/fc/FcFlightListItem.scss";
import "../assets/scss/component/fc/FcFlightDetails.scss";
import "../assets/scss/pages/page_flight_detail.scss";

const route = useRoute();
const router = useRouter();
const flight = computed(() => getFlight(String(route.params.id)));
const editing = computed(() => route.name === "flight-booking");
const booking = computed({
    get: () => flight.value?.booking,
    set: (value) => {
        if (flight.value) Object.assign(flight.value.booking, value);
    },
});
const routeHistory = computed(() =>
    flights.value
        .filter(
            (item) =>
                item.isCompleted &&
                !item.friend &&
                item.from === flight.value?.from &&
                item.to === flight.value?.to,
        )
        .sort((a, b) => Date.parse(b.departureAt) - Date.parse(a.departureAt)),
);
const details = computed(() => {
    const item = flight.value;
    if (!item) return null;

    const airline = item.airlineInfo;
    const aircraft = item.aircraft;
    const performance = flights.value.filter(
        (past) =>
            past.isCompleted &&
            !past.friend &&
            past.airline === item.airline &&
            past.flight === item.flight,
    );
    const delayed = performance.filter((past) => past.arrivalDelayMinutes > 0);
    const averageDelay = delayed.length
        ? Math.round(
              delayed.reduce((sum, past) => sum + past.arrivalDelayMinutes, 0) /
                  delayed.length,
          )
        : 0;
    const percent = (count) =>
        performance.length ? Math.round((count / performance.length) * 100) : 0;
    const firstFlight = new Date(`${aircraft.firstFlight}T00:00:00Z`);
    const departure = new Date(item.departureAt);
    let age = departure.getUTCFullYear() - firstFlight.getUTCFullYear();
    if (
        departure.getUTCMonth() < firstFlight.getUTCMonth() ||
        (departure.getUTCMonth() === firstFlight.getUTCMonth() &&
            departure.getUTCDate() < firstFlight.getUTCDate())
    )
        age -= 1;
    const timezoneHours = item.timezoneChangeMinutes / 60;
    const timing = (minutes) =>
        minutes > 0 ? "late" : minutes < 0 ? "early" : "on-time";
    const recent = routeHistory.value[0];

    return {
        from: item.from,
        to: item.to,
        departure: item.departureTime,
        arrival: item.arrivalTime,
        scheduledDeparture: item.scheduledDeparture,
        scheduledArrival: item.scheduledArrival,
        departureAirport: item.departureAirport.fullName,
        arrivalAirport: item.arrivalAirport.fullName,
        departureGate: item.departureInfo.gate,
        arrivalGate: item.arrivalInfo.gate,
        departureTerminal: item.departureInfo.terminal,
        arrivalTerminal: item.arrivalInfo.terminal,
        departureStatus: item.departureStatus,
        arrivalStatus: item.arrivalStatus,
        departureTiming: timing(item.departureDelayMinutes),
        arrivalTiming: timing(item.arrivalDelayMinutes),
        departureDateTime: item.departureAt,
        arrivalDateTime: item.arrivalAt,
        baggage: item.arrivalInfo.baggage,
        duration: item.duration,
        distance: `${item.distanceKm.toLocaleString("en-US")} km`,
        arrivalDayOffset: item.arrivalDayOffset,
        overnight: Boolean(item.arrivalDayOffset),
        timezoneTitle: `${timezoneHours > 0 ? "+" : ""}${timezoneHours} Hours Timezone Change`,
        timezoneDescription: `${item.arrivalTime} arrival in ${item.arrivalAirport.city} (${item.arrivalAirport.timeZone}) is ${item.arrivalAtOriginTime} ${item.departureAirport.city} time`,
        features: [
            {
                title: "Booking Code",
                field: "bookingCode",
                action: "Tap to Edit",
            },
            { title: "Seat Information", field: "seat", action: "Add Seat" },
        ],
        forecastDescription: `${item.airline} ${item.flight} · sample flight history`,
        forecastStats: [
            { label: "Late", value: `${percent(delayed.length)}%` },
            { label: "Average of Late", value: formatDuration(averageDelay) },
            { label: "Observed", value: String(performance.length) },
        ],
        forecast: [
            {
                label: "Early",
                value: percent(
                    performance.filter((past) => past.arrivalDelayMinutes < 0)
                        .length,
                ),
                color: "var(--fc-success)",
            },
            {
                label: "On Time",
                value: percent(
                    performance.filter((past) => past.arrivalDelayMinutes === 0)
                        .length,
                ),
                color: "#56d76a",
            },
            {
                label: "Under 30m",
                value: percent(
                    performance.filter(
                        (past) =>
                            past.arrivalDelayMinutes > 0 &&
                            past.arrivalDelayMinutes < 30,
                    ).length,
                ),
                color: "#ffcb31",
            },
            {
                label: "30–44m",
                value: percent(
                    performance.filter(
                        (past) =>
                            past.arrivalDelayMinutes >= 30 &&
                            past.arrivalDelayMinutes < 45,
                    ).length,
                ),
                color: "#ff9d20",
            },
            {
                label: "45m+ late",
                value: percent(
                    performance.filter((past) => past.arrivalDelayMinutes >= 45)
                        .length,
                ),
                color: "var(--fc-danger)",
            },
        ],
        plane: `${aircraft.manufacturer} ${aircraft.model}`,
        tail: aircraft.registration,
        firstFlight: new Intl.DateTimeFormat("en-US", {
            timeZone: "UTC",
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(firstFlight),
        age: `${age} years old`,
        engines: aircraft.engines,
        capacity: aircraft.seats,
        image: aircraft.image,
        airline: airline.name,
        logo: airline.logo,
        alliance: airline.alliance,
        callsign: airline.callsign,
        icao: airline.icao,
        iata: airline.iata,
        phone: airline.phone,
        website: airline.website,
        x: airline.x,
        facebook: airline.facebook,
        historyStats: [
            { label: "Flights", value: String(routeHistory.value.length) },
            {
                label: "Distance",
                value: `${routeHistory.value.reduce((sum, past) => sum + past.distanceKm, 0).toLocaleString("en-US")} km`,
            },
            {
                label: "Flight Time",
                value: formatDuration(
                    routeHistory.value.reduce(
                        (sum, past) => sum + past.airborneMinutes,
                        0,
                    ),
                ),
            },
        ],
        recentFlight: recent
            ? `${recent.date} · ${recent.airline} ${recent.flight}`
            : "No past flights on this route",
    };
});

function editBooking() {
    router.push({
        name: "flight-booking",
        params: { id: route.params.id },
        query: route.query,
    });
}

function closeFlight() {
    router.push({ name: "home", query: route.query });
}

function openConnection() {
    router.push({
        name: "connection",
        params: { id: route.params.id },
        query: route.query,
    });
}
</script>
