<template>
    <section
        class="frame-page flights-page"
        :aria-label="
            $t(
                route.name === 'flight-results'
                    ? 'Flight search results'
                    : 'Upcoming flights',
            )
        "
    >
        <BaseInput
            v-model="search"
            class="frame-page__input"
            type="search"
            :placeholder="$t(pageData.placeholder)"
            :aria-label="$t('Search flights')"
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
                <FcFlightListItem
                    :airline="flight.airline"
                    :flight="flight.flight"
                    :title="$t(flight.title)"
                    :date="flight.date"
                    :departure="flight.departure"
                    :arrival="flight.arrival"
                    :duration="flight.duration"
                    :flight-time="flight.flightTime"
                    :variant="flight.isCompleted ? 'history' : 'upcoming'"
                    :days="flight.days"
                    :type="flight.type"
                    :profile="flight.profile"
                />
            </RouterLink>
            <p
                v-if="!filteredFlights.length"
                class="frame-page__note"
                role="status"
            >
                {{ $t(pageData.emptyMessage) }}
            </p>
        </div>
        <RouterLink
            class="frame-page__link flights-page__add"
            :to="{ name: 'add-flight', query: route.query }"
        >
            {{ $t("+ Add Flight") }}
        </RouterLink>
    </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";

import { useRoute } from "vue-router";

import BaseInput from "../component/base/BaseInput.vue";
import FcFlightListItem from "../component/fc/FcFlightListItem.vue";

import { flights } from "../common/flights.js";

import "../assets/scss/component/base/BaseInput.scss";
import "../assets/scss/component/base/BaseIcon.scss";
import "../assets/scss/component/fc/FcFlightListItem.scss";
import "../assets/scss/pages/page_home.scss";

const emit = defineEmits(["map-flights"]);

// 화면 문구만 페이지에서 관리하고 항공편은 공통 JSON을 사용합니다.
const pageData = {
    placeholder: "Search airline, flight, airport, or date",
    emptyMessage: "No flights found.",
};

const route = useRoute();
const search = ref("");
const visibleFlights = computed(() => {
    if (route.name === "friend-flights") {
        return flights.value.filter(
            (flight) => flight.friend && !flight.isCompleted,
        );
    }

    const ownFlights = flights.value.filter((flight) => !flight.friend);
    if (route.name !== "flight-results") {
        return ownFlights.filter((flight) => !flight.isCompleted);
    }

    return ownFlights.filter(
        (flight) =>
            (!route.query.from || flight.from === route.query.from) &&
            (!route.query.to || flight.to === route.query.to) &&
            (!route.query.airline || flight.airline === route.query.airline) &&
            (!route.query.flight || flight.flight === route.query.flight) &&
            (!route.query.date || flight.departureDate === route.query.date),
    );
});
const filteredFlights = computed(() => {
    const keyword = search.value.trim().toLowerCase();
    return [...visibleFlights.value]
        .sort((a, b) => Date.parse(a.departureAt) - Date.parse(b.departureAt))
        .filter((flight) =>
            `${flight.airlineInfo.name} ${flight.airline} ${flight.flight} ${flight.title} ${flight.from} ${flight.to} ${flight.date} ${flight.departureDate}`
                .toLowerCase()
                .includes(keyword),
        );
});

watch(filteredFlights, (items) => emit("map-flights", items), {
    immediate: true,
});
</script>
