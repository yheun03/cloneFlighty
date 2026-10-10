<template>
    <section class="frame-page flights-page" aria-label="Upcoming flights">
        <BaseInput v-model="search" class="frame-page__input" type="search" :placeholder="pageData.placeholder"
            aria-label="Search flights" />
        <div class="flights-page__list">
            <RouterLink v-for="flight in filteredFlights" :key="flight.id" class="flights-page__flight" :to="{
                name: 'flight-detail',
                params: { id: flight.id },
                query: { ...route.query, from: flight.from, to: flight.to },
            }">
                <FcFlightListItem v-bind="flight" />
            </RouterLink>
            <p v-if="!filteredFlights.length" class="frame-page__note" role="status">
                {{ pageData.emptyMessage }}
            </p>
        </div>
        <RouterLink class="frame-page__link flights-page__add" :to="{ name: 'add-flight', query: route.query }">
            + Add Flight
        </RouterLink>
    </section>
</template>

<script setup>
import { computed, ref } from "vue";

import { useRoute } from "vue-router";

import BaseInput from "../component/base/BaseInput.vue";
import FcFlightListItem from "../component/fc/FcFlightListItem.vue";

import airlines from "../common/airlines.js";

import "../assets/scss/component/fc/FcIcon.scss";
import "../assets/scss/component/fc/FcFlightListItem.scss";
import "../assets/scss/pages/HomePage.scss";

// 이 페이지에서 사용하는 샘플 데이터입니다.
// prettier-ignore
const pageData = {
    "search": "",
    "placeholder": "10/5 or Friday",
    "emptyMessage": "No flights found.",
    "flights": [
        {
            "airline": airlines.KE.iata,
            "flight": "24",
            "title": "San Francisco to Seoul",
            "date": "Wed, 28 Jan",
            "departure": "SFO 11:40",
            "arrival": "ICN 17:40⁺¹",
            "days": 21,
            "avatar": false,
            "duration": "13h",
            "flightTime": "13h",
            "id": "ke-24",
            "from": "SFO",
            "to": "ICN"
        },
        {
            "airline": airlines.KE.iata,
            "flight": "24",
            "title": "San Francisco to Seoul",
            "date": "Wed, 28 Jan",
            "departure": "SFO 11:40",
            "arrival": "ICN 17:40⁺¹",
            "days": 999,
            "avatar": false,
            "duration": "13h",
            "flightTime": "13h",
            "id": "ke-24-2",
            "from": "SFO",
            "to": "ICN"
        }
    ],
    "friendFlights": [
        {
            "airline": airlines.KE.iata,
            "flight": "24",
            "title": "San Francisco to Seoul",
            "date": "Wed, 28 Jan",
            "departure": "SFO 11:40",
            "arrival": "ICN 17:40⁺¹",
            "days": 999,
            "avatar": true,
            "duration": "13h",
            "flightTime": "13h",
            "id": "ke-24",
            "from": "SFO",
            "to": "ICN"
        },
        {
            "airline": airlines.KE.iata,
            "flight": "24",
            "title": "San Francisco to Seoul",
            "date": "Wed, 28 Jan",
            "departure": "SFO 11:40",
            "arrival": "ICN 17:40⁺¹",
            "days": 999,
            "avatar": true,
            "duration": "13h",
            "flightTime": "13h",
            "id": "ke-24-2",
            "from": "SFO",
            "to": "ICN"
        }
    ],
    "results": [
        {
            "airline": airlines.KE.iata,
            "flight": "24",
            "title": "San Francisco to Seoul",
            "date": "Wed, 28 Jan",
            "departure": "SFO 11:40",
            "arrival": "ICN 17:40⁺¹",
            "days": 21,
            "avatar": false,
            "duration": "13h",
            "flightTime": "13h",
            "id": "ke-24",
            "from": "SFO",
            "to": "ICN"
        },
        {
            "airline": airlines.KE.iata,
            "flight": "24",
            "title": "San Francisco to Seoul",
            "date": "Wed, 28 Jan",
            "departure": "SFO 11:40",
            "arrival": "ICN 17:40⁺¹",
            "days": 999,
            "avatar": false,
            "duration": "13h",
            "flightTime": "13h",
            "id": "ke-24-2",
            "from": "SFO",
            "to": "ICN"
        }
    ]
};

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
