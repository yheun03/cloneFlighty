<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseInput from "../component/base/BaseInput.vue";

const airports = JSON.parse(document.querySelector("#airports").textContent);
const route = useRoute();
const router = useRouter();
const normalizeAirportCode = (value) => value.trim().toUpperCase().slice(0, 3);
const from = computed(() =>
    typeof route.query.from === "string"
        ? normalizeAirportCode(route.query.from)
        : "ICN",
);
const to = computed(() =>
    typeof route.query.to === "string"
        ? normalizeAirportCode(route.query.to)
        : "SFO",
);
const mode = ref("mine");
const search = ref("");
const ownFlights = computed(() => [
    {
        flight: "KE 24",
        from: from.value,
        to: to.value,
        date: "Sat, 20 Jun",
        days: 21,
    },
    { flight: "KE 703", from: "ICN", to: "NRT", date: "Tue, 10 Mar", days: 62 },
    { flight: "KE 16", from: "NRT", to: "SFO", date: "Sun, 22 Mar", days: 74 },
]);
const friendFlights = [
    { flight: "SK 613", from: "CDG", to: "LHR", date: "Thu, 15 Jan", days: 8 },
    {
        flight: "KL 1268",
        from: "LHR",
        to: "CDG",
        date: "Fri, 24 Apr",
        days: 107,
    },
    { flight: "KE 24", from: "SFO", to: "ICN", date: "Sat, 20 Jun", days: 164 },
];
const flights = computed(() =>
    (mode.value === "mine" ? ownFlights.value : friendFlights).filter(
        (flight) =>
            `${flight.flight} ${flight.from} ${flight.to} ${airports[flight.from]?.name || ""} ${airports[flight.to]?.name || ""}`
                .toLowerCase()
                .includes(search.value.toLowerCase()),
    ),
);

function selectFlight(flight) {
    router.push({ name: "home", query: { from: flight.from, to: flight.to } });
}
</script>

<template>
    <section class="flight-map__body" aria-labelledby="flight-list-title">
        <h2 id="flight-list-title" class="flight-map__title">
            {{ mode === "mine" ? "내 항공편" : "친구 항공편" }}
        </h2>
        <BaseInput
            v-model="search"
            type="search"
            placeholder="항공편명 또는 공항 검색"
            aria-label="항공편 검색"
        />
        <div
            class="flight-map__filters"
            role="group"
            aria-label="항공편 목록 필터"
        >
            <button
                type="button"
                :class="{ active: mode === 'mine' }"
                :aria-pressed="mode === 'mine'"
                @click="mode = 'mine'"
            >
                내 항공편</button
            ><button
                type="button"
                :class="{ active: mode === 'friends' }"
                :aria-pressed="mode === 'friends'"
                @click="mode = 'friends'"
            >
                친구 항공편
            </button>
        </div>
        <div class="flight-map__flights">
            <button
                v-for="flight in flights"
                :key="`${flight.flight}-${flight.from}-${flight.to}`"
                type="button"
                class="flight-map__flight"
                :class="{ active: from === flight.from && to === flight.to }"
                :aria-current="
                    from === flight.from && to === flight.to
                        ? 'true'
                        : undefined
                "
                @click="selectFlight(flight)"
            >
                <span class="flight-map__days"
                    ><strong>{{ flight.days }}</strong
                    ><small>일 후</small></span
                >
                <span class="flight-map__flight-info"
                    ><span
                        ><small>{{ flight.flight }}</small
                        ><small>{{ flight.date }}</small></span
                    ><strong
                        >{{ airports[flight.from]?.name }} →
                        {{ airports[flight.to]?.name }}</strong
                    ><small
                        >{{ flight.from }} 09:25 &nbsp; · &nbsp;
                        {{ flight.to }} 10:50</small
                    ></span
                >
            </button>
            <p v-if="!flights.length" class="flight-map__empty" role="status">
                검색 결과가 없습니다.
            </p>
        </div>
        <RouterLink
            class="flight-map__add"
            :to="{
                name: 'intro',
                query: { from, to },
                hash: '#interactive-demo',
            }"
            >+ 항공편 추가</RouterLink
        >
    </section>
</template>
