<script setup>
import { computed, ref } from "vue";

import { useRoute, useRouter } from "vue-router";

import FcFlightListItem from "../component/fc/FcFlightListItem.vue";
import FcFlightDetails from "../component/fc/FcFlightDetails.vue";

import pageData from "./data/FlightDetailPage.json";

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

<template>
    <section class="frame-page flight-detail-page">
        <div
            :inert="editing || undefined"
            :class="{ 'flight-detail-page__background--blurred': editing }"
        >
            <FcFlightListItem
                variant="header"
                v-bind="flight"
                @remove="closeFlight"
            />
            <FcFlightDetails
                :details="details"
                :booking-code="booking.code"
                :seat="booking.seat"
                @edit="editBooking"
                @connection="openConnection"
            />
        </div>
        <RouterView v-slot="{ Component }">
            <component
                :is="Component"
                v-model="booking"
            />
        </RouterView>
    </section>
</template>
