<template>
    <section class="frame-page passport-page">
        <FcTabItem v-model="period" :items="pageData.periods" />
        <div class="passport-page__card passport-page__card--passport">
            <FcPassportOverview v-bind="pageData.overview" :show-period="false" :show-map="false"
                :show-history="false" />
            <RouterLink class="passport-page__stats-link" :to="{
                name: 'flight-stats',
                query: { ...route.query, period },
            }">
                All Flight Stats
                <span>›</span>
            </RouterLink>
        </div>
        <div class="passport-page__card passport-page__card--delays">
            <strong class="passport-page__large">
                {{ pageData.delays.hours }}
            </strong>
            <h2>hours lost from delays</h2>
            <p>Delayed flights averaged {{ pageData.delays.average }} late</p>
            <RouterLink class="passport-page__stats-link"
                :to="{ name: 'delay-stats', query: { ...route.query, period } }">
                All Flight Stats
                <span>›</span>
            </RouterLink>
        </div>
        <div class="passport-page__card passport-page__card--aircraft">
            <h2>Most flown aircraft</h2>
            <strong class="passport-page__large">
                {{ pageData.aircraft.model }}
            </strong>
            <p>{{ pageData.aircraft.summary }}</p>
            <div class="passport-page__plane">
                <FcIcon :src="planeIcon" />
            </div>
            <RouterLink class="passport-page__stats-link" :to="{
                name: 'aircraft-stats',
                query: { ...route.query, period },
            }">
                All Flight Stats
                <span>›</span>
            </RouterLink>
        </div>
        <h2 class="passport-page__past-title">Past Flights</h2>
        <FcTabItem v-model="group" :items="pageData.groups" label="Group past flights" />
        <div v-for="history in pageData.historyGroups" :key="history.id" class="passport-page__history">
            <h3>
                {{ history.labels[group] }}
                <small>{{ history.count }}</small>
            </h3>
            <RouterLink v-for="flight in history.flights" :key="flight.id" :to="{
                name: 'flight-detail',
                params: { id: flight.id },
                query: { ...route.query, from: flight.from, to: flight.to },
            }">
                <FcFlightListItem v-bind="flight" variant="history" />
            </RouterLink>
        </div>
    </section>
</template>

<script setup>
import { ref } from "vue";

import { useRoute } from "vue-router";

import FcTabItem from "../component/fc/FcTabItem.vue";
import FcPassportOverview from "../component/fc/FcPassportOverview.vue";
import FcFlightListItem from "../component/fc/FcFlightListItem.vue";
import FcIcon from "../component/fc/FcIcon.vue";

import airlines from "../common/airlines.js";

import planeIcon from "../assets/icons/lucide/plane.svg";

import "../assets/scss/component/fc/FcIcon.scss";
import "../assets/scss/component/fc/FcTabItem.scss";
import "../assets/scss/component/fc/FcFlightListItem.scss";
import "../assets/scss/component/fc/FcPassportOverview.scss";
import "../assets/scss/pages/PassportPage.scss";

// 이 페이지에서 사용하는 샘플 데이터입니다.
// prettier-ignore
const pageData = {
    "period": "ALL-TIME",
    "periods": ["ALL-TIME", "2025", "2024", "2023", "2017"],
    "group": "To",
    "groups": ["Aisle", "From", "To", "Airline", "Airport", "Tail"],
    "overview": {
        "flights": 20,
        "distance": "73,650 km",
        "flightTime": "4d 13h",
        "airports": 16,
        "airlines": 5,
        "periods": ["ALL-TIME", "2025", "2024", "2023", "2017"],
        "mapFrom": "ICN",
        "mapTo": "ICN",
        "flags": "🇰🇷 🇲🇾 🇯🇵 🇩🇪 🇨🇳 🇸🇬 🇳🇱 🇫🇮 🇩🇰 🇸🇪 🇲🇳",
        "historyTitle": "2025",
        "historyCount": "9 FLIGHTS",
        "recent": [
            {
                "id": 1,
                "code": "KE 5926",
                "route": "AMS → ICN",
                "title": "Amsterdam to Seoul",
                "date": "Dec 29, 2025"
            },
            {
                "id": 2,
                "code": "AY 041",
                "route": "HEL → ICN",
                "title": "Helsinki to Seoul",
                "date": "Nov 14, 2025"
            },
            {
                "id": 3,
                "code": "KE 703",
                "route": "ICN → NRT",
                "title": "Seoul to Tokyo",
                "date": "Sep 8, 2025"
            },
            {
                "id": 4,
                "code": "SQ 607",
                "route": "ICN → SIN",
                "title": "Seoul to Singapore",
                "date": "Aug 20, 2025"
            },
            {
                "id": 5,
                "code": "OZ 202",
                "route": "ICN → LAX",
                "title": "Seoul to Los Angeles",
                "date": "Jun 2, 2025"
            }
        ]
    },
    "delays": {
        "hours": "3",
        "average": "20m"
    },
    "aircraft": {
        "model": "A330-300",
        "summary": "4 flights · 12 hours"
    },
    "historyGroups": [
        {
            "id": "december",
            "labels": {
                "From": "🇳🇱 Amsterdam (AMS)",
                "To": "🇰🇷 Seoul (ICN)",
                "Airline": airlines.KE.name,
                "Airport": "🇰🇷 Seoul (ICN)",
                "Tail": "HL-8078",
                "Aisle": "Aisle"
            },
            "count": "6 FLIGHTS",
            "flights": [
                {
                    "airline": airlines.KE.iata,
                    "flight": "5926",
                    "title": "Amsterdam to Seoul",
                    "date": "Dec 29, 2025",
                    "departure": "AMS 09:25",
                    "arrival": "ICN 10:50",
                    "days": 21,
                    "avatar": false,
                    "duration": "11h 25m",
                    "flightTime": "11h 25m",
                    "id": "past-1-1",
                    "from": "AMS",
                    "to": "ICN"
                },
                {
                    "airline": airlines.KE.iata,
                    "flight": "5926",
                    "title": "Amsterdam to Seoul",
                    "date": "Dec 29, 2025",
                    "departure": "AMS 09:25",
                    "arrival": "ICN 10:50",
                    "days": 21,
                    "avatar": false,
                    "duration": "11h 25m",
                    "flightTime": "11h 25m",
                    "id": "past-1-2",
                    "from": "AMS",
                    "to": "ICN"
                },
                {
                    "airline": airlines.KE.iata,
                    "flight": "5926",
                    "title": "Amsterdam to Seoul",
                    "date": "Dec 29, 2025",
                    "departure": "AMS 09:25",
                    "arrival": "ICN 10:50",
                    "days": 21,
                    "avatar": false,
                    "duration": "11h 25m",
                    "flightTime": "11h 25m",
                    "id": "past-1-3",
                    "from": "AMS",
                    "to": "ICN"
                }
            ]
        },
        {
            "id": "november",
            "labels": {
                "From": "🇳🇱 Amsterdam (AMS)",
                "To": "🇰🇷 Seoul (ICN)",
                "Airline": airlines.KE.name,
                "Airport": "🇰🇷 Seoul (ICN)",
                "Tail": "HL-8078",
                "Aisle": "Aisle"
            },
            "count": "6 FLIGHTS",
            "flights": [
                {
                    "airline": airlines.KE.iata,
                    "flight": "5926",
                    "title": "Amsterdam to Seoul",
                    "date": "Dec 29, 2025",
                    "departure": "AMS 09:25",
                    "arrival": "ICN 10:50",
                    "days": 21,
                    "avatar": false,
                    "duration": "11h 25m",
                    "flightTime": "11h 25m",
                    "id": "past-2-1",
                    "from": "AMS",
                    "to": "ICN"
                },
                {
                    "airline": airlines.KE.iata,
                    "flight": "5926",
                    "title": "Amsterdam to Seoul",
                    "date": "Dec 29, 2025",
                    "departure": "AMS 09:25",
                    "arrival": "ICN 10:50",
                    "days": 21,
                    "avatar": false,
                    "duration": "11h 25m",
                    "flightTime": "11h 25m",
                    "id": "past-2-2",
                    "from": "AMS",
                    "to": "ICN"
                },
                {
                    "airline": airlines.KE.iata,
                    "flight": "5926",
                    "title": "Amsterdam to Seoul",
                    "date": "Dec 29, 2025",
                    "departure": "AMS 09:25",
                    "arrival": "ICN 10:50",
                    "days": 21,
                    "avatar": false,
                    "duration": "11h 25m",
                    "flightTime": "11h 25m",
                    "id": "past-2-3",
                    "from": "AMS",
                    "to": "ICN"
                }
            ]
        }
    ]
};

const route = useRoute();
const period = ref(pageData.period);
const group = ref(pageData.group);
</script>
