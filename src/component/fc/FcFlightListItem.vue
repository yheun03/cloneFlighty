<script setup>
import FcIcon from "./FcIcon.vue";
import airlineIcon from "../../assets/icons/lucide/circle.svg";
import departureIcon from "../../assets/icons/lucide/plane-takeoff.svg";
import arrivalIcon from "../../assets/icons/lucide/plane-landing.svg";
import routeIcon from "../../assets/icons/lucide/arrow-right.svg";
defineProps({
    variant: { type: String, default: "upcoming" },
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
});
defineEmits(["remove"]);
</script>

<template>
    <div class="fc-flight-list" :class="`fc-flight-list--${variant}`">
        <div v-if="variant === 'upcoming'" class="fc-flight-list__days">
            <span v-if="avatar" class="fc-flight-list__avatar"></span>
            <strong v-else>{{ days }}</strong>
            <small
                ><template v-if="avatar">{{ days }} </template>DAYS</small
            >
        </div>
        <div v-else class="fc-flight-list__logo">
            <FcIcon :src="airlineIcon" />
        </div>
        <div class="fc-flight-list__content">
            <div class="fc-flight-list__meta">
                <span
                    ><FcIcon v-if="variant === 'upcoming'" :src="airlineIcon" />
                    {{ airline }} {{ flight
                    }}<template v-if="variant === 'header'">
                        · {{ date }}</template
                    ><template v-else-if="variant === 'history'">
                        &nbsp; {{ departure.split(" ")[0] }}
                        <FcIcon :src="routeIcon" /> {{ arrival.split(" ")[0] }}
                    </template></span
                ><span v-if="variant !== 'header'">{{ date }}</span>
            </div>
            <strong>{{ title }}</strong>
            <div v-if="variant === 'upcoming'" class="fc-flight-list__sub">
                <FcIcon :src="departureIcon" /> {{ departure }}
                &nbsp;&nbsp;
                <FcIcon :src="arrivalIcon" /> {{ arrival }}
            </div>
            <div v-else-if="variant === 'history'" class="fc-flight-list__sub">
                <span>{{ duration }}</span
                ><span>{{ flightTime }}</span>
            </div>
        </div>
        <button
            v-if="variant === 'header'"
            type="button"
            class="fc-flight-list__close"
            aria-label="항공편 닫기"
            @click="$emit('remove')"
        >
            ×
        </button>
    </div>
</template>
