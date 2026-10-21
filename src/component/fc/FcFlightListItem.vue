<script setup>
import { computed } from "vue";

import FcChip from "./FcChip.vue";
import FcIcon from "./FcIcon.vue";

import {
    defaultAirlineLogo,
    getAirline,
} from "../../common/airlines.js";
import departureIcon from "../../assets/figma/departure.svg";
import arrivalIcon from "../../assets/figma/arrival.svg";
import routeIcon from "../../assets/icons/lucide/arrow-right.svg";
import durationIcon from "../../assets/icons/lucide/clock-3.svg";
import flightTimeIcon from "../../assets/icons/lucide/plane.svg";

const props = defineProps({
    type: {
        type: String,
        default: "default",
        validator: (value) => ["default", "friend"].includes(value),
    },
    variant: {
        type: String,
        default: "upcoming",
        validator: (value) => ["upcoming", "history", "header"].includes(value),
    },
    airline: { type: String, required: true },
    flight: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: String, required: true },
    departure: { type: String, required: true },
    arrival: { type: String, required: true },
    duration: { type: String, default: "" },
    flightTime: { type: String, default: "" },
    days: { type: Number, default: 0 },
    avatar: { type: Boolean, default: false },
    profile: { type: String, default: "" },
});

defineEmits(["remove"]);

const departureCode = computed(() => props.departure.split(" ")[0]);
const arrivalCode = computed(() => props.arrival.split(" ")[0]);
const departureTime = computed(() => props.departure.split(" ").slice(1).join(" "));
const arrivalTime = computed(() => props.arrival.split(" ").slice(1).join(" "));
const airlineIcon = computed(
    () => getAirline(props.airline)?.logo || defaultAirlineLogo,
);
const isFriend = computed(() => props.type === "friend" || props.avatar);
</script>

<template>
    <div class="fc-flight-list" :class="[`fc-flight-list--${variant}`, { 'fc-flight-list--friend': isFriend }]">
        <div v-if="variant === 'upcoming'" class="fc-flight-list__days">
            <span v-if="isFriend" class="fc-flight-list__avatar">
                <img v-if="profile" :src="profile" alt="" />
            </span>
            <strong v-else>{{ days }}</strong>
            <small>
                <b v-if="isFriend">{{ days }}</b>
                DAYS
            </small>
        </div>
        <div v-else class="fc-flight-list__logo">
            <FcIcon :src="airlineIcon" />
        </div>
        <div class="fc-flight-list__content">
            <div class="fc-flight-list__meta">
                <!-- prettier-ignore -->
                <span>
                    <FcIcon v-if="variant === 'upcoming'" :src="airlineIcon" />
                    {{ airline }} {{ flight }}<template v-if="variant === 'header'">
                        · {{ date }}
                    </template><template v-else-if="variant === 'history'">
                        &nbsp; {{ departureCode }}
                        <FcIcon :src="routeIcon" /> {{ arrivalCode }}
                    </template>
                </span>
                <span v-if="variant !== 'header'">{{ date }}</span>
            </div>
            <strong>{{ title }}</strong>
            <div v-if="variant === 'upcoming'" class="fc-flight-list__sub">
                <span class="fc-flight-list__route-time">
                    <span class="fc-flight-list__airport">
                        <img :src="departureIcon" alt="" />
                        {{ departureCode }}
                    </span>
                    <span>{{ departureTime }}</span>
                </span>
                <span class="fc-flight-list__route-time">
                    <span class="fc-flight-list__airport">
                        <img :src="arrivalIcon" alt="" />
                        {{ arrivalCode }}
                    </span>
                    <span>{{ arrivalTime }}</span>
                </span>
            </div>
            <div v-else-if="variant === 'history'" class="fc-flight-list__sub">
                <FcChip v-if="duration" :label="duration" :icon="durationIcon" />
                <FcChip v-if="flightTime" :label="flightTime" :icon="flightTimeIcon" />
            </div>
        </div>
        <button v-if="variant === 'header'" type="button" class="fc-flight-list__close" aria-label="항공편 닫기"
            @click="$emit('remove')">
            ×
        </button>
    </div>
</template>
