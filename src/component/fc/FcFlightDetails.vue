<script setup>
import { computed } from "vue";

import FcIcon from "./FcIcon.vue";

import {
    defaultAirlineLogo,
    getAirline,
} from "../../common/airlines.js";
import bookingIcon from "../../assets/icons/lucide/ticket.svg";
import planeIcon from "../../assets/icons/lucide/plane.svg";
import departureIcon from "../../assets/icons/lucide/plane-takeoff.svg";
import arrivalIcon from "../../assets/icons/lucide/plane-landing.svg";
import durationIcon from "../../assets/icons/lucide/clock-3.svg";
import overnightIcon from "../../assets/icons/lucide/moon.svg";
import routeIcon from "../../assets/icons/lucide/arrow-right.svg";
import gateIcon from "../../assets/figma/gate.svg";
import baggageIcon from "../../assets/figma/baggage.svg";

const props = defineProps({
    // FlightDetailPage.vue의 샘플 데이터에서 details 또는 pastDetails를 전달합니다.
    details: { type: Object, required: true },
    completed: { type: Boolean, default: false },
    bookingCode: { type: String, default: "" },
    seat: { type: String, default: "" },
});

defineEmits(["edit", "connection"]);

const airlineIcon = computed(
    () =>
        props.details.logo ||
        getAirline(props.details.iata || props.details.airline)?.logo ||
        defaultAirlineLogo,
);
</script>

<template>
    <div class="fc-details" :class="{ 'is-completed': completed }">
        <div class="fc-schedule">
            <div class="fc-schedule__airport">
                <FcIcon :src="departureIcon" />
                &nbsp;{{ details.from }}
                &nbsp;·&nbsp;
                {{ details.departureAirport }}
            </div>
            <div class="fc-schedule__time">
                <span class="fc-schedule__actual">
                    <strong>{{ details.departure }}</strong>
                    <del>{{ details.scheduledDeparture }}</del>
                </span>
                <b>
                    <img :src="gateIcon" alt="" />
                    {{ details.departureGate }}
                </b>
            </div>
            <div class="fc-schedule__detail">
                <span>{{ details.departureStatus }}</span>
                <span>{{ details.departureTerminal }}</span>
            </div>
            <div class="fc-schedule__divider">
                <FcIcon :src="durationIcon" />
                &nbsp;·&nbsp; {{ details.duration }} &nbsp;·&nbsp;
                {{ details.distance }} &nbsp;·&nbsp;
                <template v-if="details.overnight">
                    <FcIcon :src="overnightIcon" />
                    &nbsp;Overnight
                </template>
            </div>
            <div class="fc-schedule__airport">
                <FcIcon :src="arrivalIcon" />
                &nbsp;{{ details.to }}
                &nbsp;·&nbsp;
                {{ details.arrivalAirport }}
            </div>
            <div class="fc-schedule__time">
                <span class="fc-schedule__actual">
                    <!-- prettier-ignore -->
                    <strong>{{ details.arrival }}<sup>{{ details.arrivalDayOffset }}</sup></strong>
                    <del>{{ details.scheduledArrival }}</del>
                </span>
                <span class="fc-schedule__gates">
                    <!-- prettier-ignore -->
                    <b>
                        <img :src="baggageIcon" alt="" />{{ details.baggage }}
                    </b>
                    <b>
                        <img :src="gateIcon" alt="" />
                        {{ details.arrivalGate }}
                    </b>
                </span>
            </div>
            <div class="fc-schedule__detail">
                <span>{{ details.arrivalStatus }}</span>
                <span>{{ details.arrivalTerminal }}</span>
            </div>
        </div>
        <h2>Enable popular features:</h2>
        <div class="fc-details__features">
            <button v-for="feature in details.features" :key="feature.title" type="button" @click="$emit('edit')">
                <FcIcon :src="feature.field === 'bookingCode'
                    ? bookingIcon
                    : planeIcon
                    " />
                <span class="fc-details__paste">PASTE</span>
                <strong>{{ feature.title }}</strong>
                <small>
                    {{
                        (feature.field === "bookingCode"
                            ? bookingCode
                            : seat) || feature.action
                    }}
                </small>
            </button>
        </div>
        <button class="fc-details__connection" type="button" @click="$emit('connection')">
            Connection information
            <FcIcon :src="routeIcon" />
        </button>
        <h2>Good to Know</h2>
        <div class="fc-details__card fc-details__timezone">
            <FcIcon :src="durationIcon" />
            <div>
                <strong>{{ details.timezoneTitle }}</strong>
                <span>{{ details.timezoneDescription }}</span>
            </div>
        </div>
        <div class="fc-details__card">
            <h3>Arrival Forecast</h3>
            <p>{{ details.forecastDescription }}</p>
            <div class="fc-details__stats">
                <span v-for="stat in details.forecastStats" :key="stat.label">
                    {{ stat.label }}
                    <strong>
                        <FcIcon :src="durationIcon" />
                        {{ stat.value }}
                    </strong>
                </span>
            </div>
            <div v-for="item in details.forecast" :key="item.label" class="fc-details__bar">
                <span>{{ item.label }}</span>
                <div>
                    <i :style="{
                        width: `${item.value}%`,
                        background: item.color,
                    }"></i>
                </div>
                <b>{{ item.value }}%</b>
            </div>
        </div>
        <div class="fc-details__card">
            <h3>What’s My Plane?</h3>
            <p>{{ details.plane }} &nbsp;·&nbsp; {{ details.tail }}</p>
            <small>
                First Flight: {{ details.firstFlight }} &nbsp;·&nbsp;
                {{ details.age }}
            </small>
            <div class="fc-details__plane">
                <img v-if="details.image" :src="details.image" :alt="details.plane" />
                <FcIcon v-else :src="planeIcon" />
            </div>
        </div>
        <div class="fc-details__card">
            <h3>
                <FcIcon :src="airlineIcon" />
                &nbsp;{{ details.airline }}
            </h3>
            <p>{{ details.alliance }}</p>
            <div class="fc-details__links">
                <span>PHONE</span>
                <span>WEBSITE</span>
                <span>X / TWITTER</span>
                <span>FACEBOOK</span>
            </div>
            <dl class="fc-details__codes">
                <div>
                    <dt>ATC Callsign</dt>
                    <dd>{{ details.callsign }}</dd>
                </div>
                <div>
                    <dt>ICAO</dt>
                    <dd>{{ details.icao }}</dd>
                </div>
                <div>
                    <dt>IATA</dt>
                    <dd>{{ details.iata }}</dd>
                </div>
            </dl>
        </div>
        <div class="fc-details__card">
            <h3>My History on This Route</h3>
            <p>
                {{ details.from }}
                <FcIcon :src="routeIcon" />
                {{ details.to }}
            </p>
            <div class="fc-details__stats">
                <span v-for="stat in details.historyStats" :key="stat.label">
                    {{ stat.label }}
                    <strong>
                        <FcIcon :src="durationIcon" />
                        {{ stat.value }}
                    </strong>
                </span>
            </div>
            <p>Most recent flights</p>
            <strong>
                <FcIcon :src="airlineIcon" />
                &nbsp;{{ details.recentFlight }}
            </strong>
        </div>
    </div>
</template>
