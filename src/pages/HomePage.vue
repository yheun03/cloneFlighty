<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import BaseInput from "../component/base/BaseInput.vue";
import FcFlightListItem from "../component/fc/FcFlightListItem.vue";
import pageData from "./data/HomePage.json";

const route = useRoute();
const search = ref(pageData.search);
const flights = computed(() =>
    route.name === "friend-flights"
        ? pageData.friendFlights
        : route.name === "flight-results"
          ? pageData.results
          : pageData.flights,
);
const filtered = computed(() =>
    flights.value.filter((flight) =>
        `${flight.airline} ${flight.flight} ${flight.title} ${flight.from} ${flight.to} ${flight.date}`
            .toLowerCase()
            .includes(search.value.toLowerCase()),
    ),
);
</script>

<template>
    <section class="frame-page flights-page" aria-label="Upcoming flights">
        <BaseInput
            v-model="search"
            class="frame-page__input"
            type="search"
            :placeholder="pageData.placeholder"
            aria-label="Search flights"
        />
        <div class="flights-page__list">
            <RouterLink
                v-for="flight in filtered"
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
            <p v-if="!filtered.length" class="frame-page__note" role="status">
                {{ pageData.emptyMessage }}
            </p>
        </div>
        <RouterLink
            class="frame-page__link flights-page__add"
            :to="{ name: 'add-flight', query: route.query }"
            >+ Add Flight</RouterLink
        >
    </section>
</template>
