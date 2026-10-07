<script setup>
import FcIcon from "./FcIcon.vue";
import bookingIcon from "../assets/icons/lucide/ticket.svg";
import planeIcon from "../assets/icons/lucide/plane.svg";
import airlineIcon from "../assets/icons/lucide/circle.svg";
import departureIcon from "../assets/icons/lucide/plane-takeoff.svg";
import arrivalIcon from "../assets/icons/lucide/plane-landing.svg";
import durationIcon from "../assets/icons/lucide/clock-3.svg";
import overnightIcon from "../assets/icons/lucide/moon.svg";
import routeIcon from "../assets/icons/lucide/arrow-right.svg";
defineProps({
    airline: { type: String, default: "Korean Air" },
    plane: { type: String, default: "Airbus A330-300" },
    from: { type: String, default: "SFO" },
    to: { type: String, default: "ICN" },
    departure: { type: String, default: "11:40" },
    arrival: { type: String, default: "17:40" },
    completed: { type: Boolean, default: false },
});
const forecast = [
    { label: "Early", value: 81, color: "#00ae57" },
    { label: "On Time", value: 80, color: "#56d76a" },
    { label: "15m late", value: 60, color: "#ffcb31" },
    { label: "30m late", value: 40, color: "#ff9d20" },
    { label: "45m+ late", value: 20, color: "#ff4d4d" },
];
const popularFeatures = [
    { icon: bookingIcon, title: "Booking Code", action: "Tap to Edit" },
    { icon: planeIcon, title: "Seat Information", action: "Add Seat" },
];
const airportNames = {
    SFO: "San Francisco Intl.",
    ICN: "Incheon Intl.",
    NRT: "Narita Intl.",
    LAX: "Los Angeles Intl.",
    JFK: "John F. Kennedy Intl.",
};
</script>

<template>
    <div class="fc-details" :class="{ 'is-completed': completed }">
        <div class="fc-schedule">
            <div class="fc-schedule__airport">
                <FcIcon :src="departureIcon" /> &nbsp;{{ from }} &nbsp;·&nbsp;
                {{ airportNames[from] || "Departure airport" }}
            </div>
            <div class="fc-schedule__time">
                <strong>{{ departure }}</strong
                ><b> <FcIcon :src="departureIcon" /> F4 </b>
            </div>
            <div class="fc-schedule__detail">
                <span>20m Late</span><span>Terminal 1</span>
            </div>
            <div class="fc-schedule__divider">
                <FcIcon :src="durationIcon" /> &nbsp;·&nbsp; 13h &nbsp;·&nbsp;
                9,086 km &nbsp;·&nbsp;
                <FcIcon :src="overnightIcon" /> &nbsp;Overnight
            </div>
            <div class="fc-schedule__airport">
                <FcIcon :src="arrivalIcon" /> &nbsp;{{ to }} &nbsp;·&nbsp;
                {{ airportNames[to] || "Arrival airport" }}
            </div>
            <div class="fc-schedule__time">
                <strong>{{ arrival }}<sup>+1</sup></strong
                ><b> <FcIcon :src="arrivalIcon" /> F4 </b>
            </div>
            <div class="fc-schedule__detail">
                <span>12m Early</span><span>Terminal 2</span>
            </div>
        </div>
        <h2>Enable popular features:</h2>
        <div class="fc-details__features">
            <div v-for="feature in popularFeatures" :key="feature.title">
                <FcIcon :src="feature.icon" /> <span></span
                ><strong>{{ feature.title }}</strong
                ><small>{{ feature.action }}</small>
            </div>
        </div>
        <h2>Good to Know</h2>
        <div class="fc-details__card fc-details__timezone">
            <strong>+17 Hours Timezone Change</strong
            ><span>17:40 arrival is 00:40 San Francisco time</span>
        </div>
        <div class="fc-details__card">
            <h3>Arrival Forecast</h3>
            <p>KE 24 performance over the last 60 days</p>
            <div class="fc-details__stats">
                <span
                    >Late
                    <strong> <FcIcon :src="durationIcon" /> 22% </strong></span
                ><span
                    >Average of Late
                    <strong>
                        <FcIcon :src="durationIcon" />
                        17m
                    </strong></span
                ><span
                    >Observed
                    <strong> <FcIcon :src="durationIcon" /> 59 </strong></span
                >
            </div>
            <div
                v-for="item in forecast"
                :key="item.label"
                class="fc-details__bar"
            >
                <span>{{ item.label }}</span>
                <div>
                    <i
                        :style="{
                            width: `${item.value}%`,
                            background: item.color,
                        }"
                    ></i>
                </div>
                <b>{{ item.value }}%</b>
            </div>
        </div>
        <div class="fc-details__card">
            <h3>What’s My Plane?</h3>
            <p>{{ plane }} &nbsp;·&nbsp; HL-7587</p>
            <small>First Flight: Nov 8, 2000 &nbsp;·&nbsp; 25 years old</small>
            <div class="fc-details__plane">
                <FcIcon :src="planeIcon" />
            </div>
        </div>
        <div class="fc-details__card">
            <h3><FcIcon :src="airlineIcon" /> &nbsp;{{ airline }}</h3>
            <p>SkyTeam</p>
            <div class="fc-details__links">
                <span>PHONE</span><span>WEBSITE</span><span>X / TWITTER</span
                ><span>FACEBOOK</span>
            </div>
            <p>ATC Callsign &nbsp;&nbsp;&nbsp; ICAO &nbsp;&nbsp;&nbsp; IATA</p>
            <strong>KOREANAIR &nbsp;&nbsp; KAL &nbsp;&nbsp; KE</strong>
        </div>
        <div class="fc-details__card">
            <h3>My History on This Route</h3>
            <p>{{ from }} <FcIcon :src="routeIcon" /> {{ to }}</p>
            <div class="fc-details__stats">
                <span
                    >Flights
                    <strong> <FcIcon :src="durationIcon" /> 1 </strong></span
                ><span
                    >Distance
                    <strong>
                        <FcIcon :src="durationIcon" /> 9,086 km
                    </strong></span
                ><span
                    >Flight Time
                    <strong> <FcIcon :src="durationIcon" /> 13h </strong></span
                >
            </div>
            <p>Most recent flights</p>
            <strong>
                <FcIcon :src="airlineIcon" /> &nbsp;20 Aug 2025
                &nbsp;&nbsp;&nbsp; KE 647
            </strong>
        </div>
    </div>
</template>
