<script setup>
import { computed } from "vue";

import BaseIcon from "../base/BaseIcon.vue";

import { defaultAirlineLogo, getAirline } from "../../common/airlines.js";
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
    // 공통 항공편·항공사·공항·기체 JSON을 연결한 표시 데이터를 전달합니다.
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
const airlineLinks = computed(() => [
    {
        label: "PHONE",
        href: props.details.phone
            ? `tel:${props.details.phone.replace(/[^+\d]/g, "")}`
            : "",
    },
    { label: "WEBSITE", href: props.details.website },
    { label: "X / TWITTER", href: props.details.x },
    { label: "FACEBOOK", href: props.details.facebook },
]);
</script>

<template>
    <div
        class="fc-details"
        :class="{ 'is-completed': completed }"
    >
        <div class="fc-schedule">
            <div class="fc-schedule__airport">
                <BaseIcon :src="departureIcon" />
                &nbsp;{{ details.from }}
                &nbsp;·&nbsp;
                {{ details.departureAirport }}
            </div>
            <div
                class="fc-schedule__time"
                :class="`is-${details.departureTiming || 'late'}`"
            >
                <span class="fc-schedule__actual">
                    <strong>
                        <time :datetime="details.departureDateTime">
                            {{ details.departure }}
                        </time>
                    </strong>
                    <del
                        v-if="details.departure !== details.scheduledDeparture"
                    >
                        {{ details.scheduledDeparture }}
                    </del>
                </span>
                <b>
                    <img
                        :src="gateIcon"
                        alt=""
                    />
                    {{ details.departureGate }}
                </b>
            </div>
            <div
                class="fc-schedule__detail"
                :class="`is-${details.departureTiming || 'late'}`"
            >
                <span>{{ details.departureStatus }}</span>
                <span>{{ details.departureTerminal }}</span>
            </div>
            <div class="fc-schedule__divider">
                <BaseIcon :src="durationIcon" />
                &nbsp;·&nbsp; {{ details.duration }} &nbsp;·&nbsp;
                {{ details.distance }} &nbsp;·&nbsp;
                <template v-if="details.overnight">
                    <BaseIcon :src="overnightIcon" />
                    &nbsp;Overnight
                </template>
            </div>
            <div class="fc-schedule__airport">
                <BaseIcon :src="arrivalIcon" />
                &nbsp;{{ details.to }}
                &nbsp;·&nbsp;
                {{ details.arrivalAirport }}
            </div>
            <div
                class="fc-schedule__time"
                :class="`is-${details.arrivalTiming || 'early'}`"
            >
                <span class="fc-schedule__actual">
                    <!-- prettier-ignore -->
                    <strong><time :datetime="details.arrivalDateTime">{{ details.arrival }}</time><sup>{{ details.arrivalDayOffset }}</sup></strong>
                    <del v-if="details.arrival !== details.scheduledArrival">
                        {{ details.scheduledArrival }}
                    </del>
                </span>
                <span class="fc-schedule__gates">
                    <!-- prettier-ignore -->
                    <b>
                        <img :src="baggageIcon" alt="" />{{ details.baggage }}
                    </b>
                    <b>
                        <img
                            :src="gateIcon"
                            alt=""
                        />
                        {{ details.arrivalGate }}
                    </b>
                </span>
            </div>
            <div
                class="fc-schedule__detail"
                :class="`is-${details.arrivalTiming || 'early'}`"
            >
                <span>{{ details.arrivalStatus }}</span>
                <span>{{ details.arrivalTerminal }}</span>
            </div>
        </div>
        <h2>Enable popular features:</h2>
        <div class="fc-details__features">
            <button
                v-for="feature in details.features"
                :key="feature.title"
                type="button"
                @click="$emit('edit')"
            >
                <BaseIcon
                    :src="
                        feature.field === 'bookingCode'
                            ? bookingIcon
                            : planeIcon
                    "
                />
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
        <button
            class="fc-details__connection"
            type="button"
            @click="$emit('connection')"
        >
            Connection information
            <BaseIcon :src="routeIcon" />
        </button>
        <h2>Good to Know</h2>
        <div class="fc-details__card fc-details__timezone">
            <BaseIcon :src="durationIcon" />
            <div>
                <strong>{{ details.timezoneTitle }}</strong>
                <span>{{ details.timezoneDescription }}</span>
            </div>
        </div>
        <div class="fc-details__card">
            <h3>Arrival Forecast</h3>
            <p>{{ details.forecastDescription }}</p>
            <div class="fc-details__stats">
                <span
                    v-for="stat in details.forecastStats"
                    :key="stat.label"
                >
                    {{ stat.label }}
                    <strong>
                        <BaseIcon :src="durationIcon" />
                        {{ stat.value }}
                    </strong>
                </span>
            </div>
            <div
                v-for="item in details.forecast"
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
            <p>{{ details.plane }} &nbsp;·&nbsp; {{ details.tail }}</p>
            <small>
                First Flight: {{ details.firstFlight }} &nbsp;·&nbsp;
                {{ details.age }}
            </small>
            <dl
                v-if="details.capacity || details.engines"
                class="fc-details__codes fc-details__codes--aircraft"
            >
                <div>
                    <dt>Seats</dt>
                    <dd>{{ details.capacity }}</dd>
                </div>
                <div>
                    <dt>Engines</dt>
                    <dd>{{ details.engines }}</dd>
                </div>
            </dl>
            <div class="fc-details__plane">
                <img
                    v-if="details.image"
                    :src="details.image"
                    :alt="details.plane"
                />
            </div>
        </div>
        <div class="fc-details__card">
            <h3>
                <BaseIcon :src="airlineIcon" />
                &nbsp;{{ details.airline }}
            </h3>
            <p>{{ details.alliance }}</p>
            <div class="fc-details__links">
                <template
                    v-for="link in airlineLinks"
                    :key="link.label"
                >
                    <a
                        v-if="link.href"
                        :href="link.href"
                        :target="
                            link.href.startsWith('https:')
                                ? '_blank'
                                : undefined
                        "
                        :rel="
                            link.href.startsWith('https:')
                                ? 'noopener noreferrer'
                                : undefined
                        "
                        :aria-label="`${details.airline} ${link.label}`"
                    >
                        {{ link.label }}
                    </a>
                    <span
                        v-else
                        aria-disabled="true"
                    >
                        {{ link.label }}
                    </span>
                </template>
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
                <BaseIcon :src="routeIcon" />
                {{ details.to }}
            </p>
            <div class="fc-details__stats">
                <span
                    v-for="stat in details.historyStats"
                    :key="stat.label"
                >
                    {{ stat.label }}
                    <strong>
                        <BaseIcon :src="durationIcon" />
                        {{ stat.value }}
                    </strong>
                </span>
            </div>
            <p>Most recent flights</p>
            <strong>
                <BaseIcon :src="airlineIcon" />
                &nbsp;{{ details.recentFlight }}
            </strong>
        </div>
    </div>
</template>
