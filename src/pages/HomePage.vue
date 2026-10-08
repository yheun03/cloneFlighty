<script setup>
import { computed, ref } from "vue";

import { useRoute } from "vue-router";

import BaseInput from "../component/base/BaseInput.vue";
import FcFlightListItem from "../component/fc/FcFlightListItem.vue";

import pageData from "./data/HomePage.json";

const route = useRoute();
const search = ref(pageData.search);
const flights = computed(() => {
    if (route.name === "friend-flights") return pageData.friendFlights;
    if (route.name === "flight-results") return pageData.results;
    return pageData.flights;
});
const filteredFlights = computed(() => {
    const keyword = search.value.toLowerCase();
    return flights.value.filter((flight) =>
        `${flight.airline} ${flight.flight} ${flight.title} ${flight.from} ${flight.to} ${flight.date}`
            .toLowerCase()
            .includes(keyword),
    );
});
</script>

<template>
    <section
        class="frame-page flights-page"
        aria-label="Upcoming flights"
    >
        <BaseInput
            v-model="search"
            class="frame-page__input"
            type="search"
            :placeholder="pageData.placeholder"
            aria-label="Search flights"
        />
        <div class="flights-page__list">
            <RouterLink
                v-for="flight in filteredFlights"
                :key="flight.id"
                class="flights-page__flight"
                :to="{
                    name: 'flight-detail',
                    params: { id: flight.id },
                    query: { ...route.query, from: flight.from, to: flight.to },
                }"
            >
                <FcFlightListItem v-bind="flight" />
            </RouterLink>
            <p
                v-if="!filteredFlights.length"
                class="frame-page__note"
                role="status"
            >
                {{ pageData.emptyMessage }}
            </p>
        </div>
        <RouterLink
            class="frame-page__link flights-page__add"
            :to="{ name: 'add-flight', query: route.query }"
        >
            + Add Flight
        </RouterLink>
    </section>
</template>
