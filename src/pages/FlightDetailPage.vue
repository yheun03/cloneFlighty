<template>
    <section class="frame-page flight-detail-page">
        <div :inert="editing || undefined" :class="{ 'flight-detail-page__background--blurred': editing }">
            <FcFlightListItem variant="header" v-bind="flight" @remove="closeFlight" />
            <FcFlightDetails :details="details" :booking-code="booking.code" :seat="booking.seat" @edit="editBooking"
                @connection="openConnection" />
        </div>
        <RouterView v-slot="{ Component }">
            <component :is="Component" v-model="booking" />
        </RouterView>
    </section>
</template>

<script setup>
import { computed, ref } from "vue";

import { useRoute, useRouter } from "vue-router";

import FcFlightListItem from "../component/fc/FcFlightListItem.vue";
import FcFlightDetails from "../component/fc/FcFlightDetails.vue";

import airports from "../common/airports.js";
import airlines from "../common/airlines.js";

import "../assets/scss/component/fc/FcIcon.scss";
import "../assets/scss/component/fc/FcFlightListItem.scss";
import "../assets/scss/component/fc/FcFlightDetails.scss";
import "../assets/scss/pages/FlightDetailPage.scss";

// 이 페이지에서 사용하는 샘플 데이터입니다.
// prettier-ignore
const pageData = {
    "flight": {
        "airline": airlines.KE.iata,
        "flight": "24",
        "title": "San Francisco to Seoul",
        "date": "Wed, 28 Jan",
        "departure": "SFO 11:40",
        "arrival": "ICN 17:40⁺¹",
        "days": 21,
        "avatar": false,
        "duration": "13h",
        "flightTime": "13h"
    },
    "details": {
        "airline": airlines.KE.name,
        "plane": "Airbus A330-300",
        "from": "SFO",
        "to": "ICN",
        "departure": "11:40",
        "arrival": "17:40",
        "departureAirport": airports.SFO.fullName,
        "arrivalAirport": airports.ICN.fullName,
        "scheduledDeparture": "11:40",
        "scheduledArrival": "18:00",
        "departureGate": "F4",
        "arrivalGate": "F4",
        "baggage": "14",
        "departureStatus": "20m Late",
        "arrivalStatus": "20m Early",
        "departureTerminal": "Terminal 1",
        "arrivalTerminal": "Terminal 1",
        "duration": "13h",
        "distance": "9,086 km",
        "arrivalDayOffset": "+1",
        "overnight": true,
        "timezoneTitle": "+17 Hours Timezone Change",
        "timezoneDescription": "17:40 arrival is 00:40 San Francisco time",
        "forecastDescription": "KE 24 performance over the last 60 days",
        "forecastStats": [
            {
                "label": "Late",
                "value": "22%"
            },
            {
                "label": "Average of Late",
                "value": "17m"
            },
            {
                "label": "Observed",
                "value": "59"
            }
        ],
        "forecast": [
            {
                "label": "Early",
                "value": 81,
                "color": "var(--fc-success, #00ae57)"
            },
            {
                "label": "On Time",
                "value": 80,
                "color": "#56d76a"
            },
            {
                "label": "15m late",
                "value": 60,
                "color": "#ffcb31"
            },
            {
                "label": "30m late",
                "value": 40,
                "color": "#ff9d20"
            },
            {
                "label": "45m+ late",
                "value": 20,
                "color": "var(--fc-danger, #ff4d4d)"
            }
        ],
        "features": [
            {
                "title": "Booking Code",
                "action": "Tap to Edit",
                "field": "bookingCode"
            },
            {
                "title": "Seat Information",
                "action": "Add Seat",
                "field": "seat"
            }
        ],
        "tail": "HL-7587",
        "firstFlight": "Nov 8, 2000",
        "age": "25 years old",
        "alliance": airlines.KE.alliance,
        "callsign": airlines.KE.callsign,
        "icao": airlines.KE.icao,
        "iata": airlines.KE.iata,
        "historyStats": [
            {
                "label": "Flights",
                "value": "1"
            },
            {
                "label": "Distance",
                "value": "9,086 km"
            },
            {
                "label": "Flight Time",
                "value": "13h"
            }
        ],
        "recentFlight": "20 Aug 2025 · KE 647"
    },
    "pastFlight": {
        "airline": airlines.KE.iata,
        "flight": "5926",
        "title": "Amsterdam to Seoul",
        "date": "Dec 29, 2025",
        "departure": "AMS 09:25",
        "arrival": "ICN 10:50",
        "days": 21,
        "avatar": false,
        "duration": "11h 25m",
        "flightTime": "11h 25m"
    },
    "pastDetails": {
        "airline": airlines.KE.name,
        "plane": "Airbus A330-300",
        "from": "AMS",
        "to": "ICN",
        "departure": "09:25",
        "arrival": "10:50",
        "departureAirport": airports.AMS.fullName,
        "arrivalAirport": airports.ICN.fullName,
        "scheduledDeparture": "09:05",
        "scheduledArrival": "11:10",
        "departureGate": "F4",
        "arrivalGate": "F4",
        "baggage": "14",
        "departureStatus": "20m Late",
        "arrivalStatus": "20m Early",
        "departureTerminal": "Terminal 1",
        "arrivalTerminal": "Terminal 1",
        "duration": "11h 25m",
        "distance": "8,560 km",
        "arrivalDayOffset": "+1",
        "overnight": true,
        "timezoneTitle": "+8 Hours Timezone Change",
        "timezoneDescription": "10:50 arrival is 02:50 Amsterdam time",
        "forecastDescription": "KE 5926 performance over the last 60 days",
        "forecastStats": [
            {
                "label": "Late",
                "value": "22%"
            },
            {
                "label": "Average of Late",
                "value": "17m"
            },
            {
                "label": "Observed",
                "value": "59"
            }
        ],
        "forecast": [
            {
                "label": "Early",
                "value": 81,
                "color": "var(--fc-success, #00ae57)"
            },
            {
                "label": "On Time",
                "value": 80,
                "color": "#56d76a"
            },
            {
                "label": "15m late",
                "value": 60,
                "color": "#ffcb31"
            },
            {
                "label": "30m late",
                "value": 40,
                "color": "#ff9d20"
            },
            {
                "label": "45m+ late",
                "value": 20,
                "color": "var(--fc-danger, #ff4d4d)"
            }
        ],
        "features": [
            {
                "title": "Booking Code",
                "action": "Tap to Edit",
                "field": "bookingCode"
            },
            {
                "title": "Seat Information",
                "action": "Add Seat",
                "field": "seat"
            }
        ],
        "tail": "HL-7587",
        "firstFlight": "Nov 8, 2000",
        "age": "25 years old",
        "alliance": airlines.KE.alliance,
        "callsign": airlines.KE.callsign,
        "icao": airlines.KE.icao,
        "iata": airlines.KE.iata,
        "historyStats": [
            {
                "label": "Flights",
                "value": "6"
            },
            {
                "label": "Distance",
                "value": "51,360 km"
            },
            {
                "label": "Flight Time",
                "value": "68h 30m"
            }
        ],
        "recentFlight": "29 Dec 2025 · KE 5926"
    },
    "booking": {
        "code": "",
        "seat": "",
        "position": "Middle",
        "cabin": "Business",
        "reason": "Business"
    }
};

const route = useRoute();
const router = useRouter();
const booking = ref({ ...pageData.booking });
const editing = computed(() => route.name === "flight-booking");
const isPastFlight = computed(() =>
    String(route.params.id).startsWith("past-"),
);
const flight = computed(() =>
    isPastFlight.value ? pageData.pastFlight : pageData.flight,
);
const details = computed(() =>
    isPastFlight.value ? pageData.pastDetails : pageData.details,
);

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
