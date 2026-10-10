<template>
    <section class="frame-page stats-page aircraft-stats-page" @click="share">
        <FcTabItem v-model="period" :items="pageData.periods" />
        <FcAircraftStats :aircraft="pageData.aircraft" :show-period="false" :show-age="false" />
        <div class="aircraft-stats-page__seat-summary">
            <div>
                <span v-for="label in pageData.seatSummary.labels" :key="label">
                    {{ label }}
                </span>
            </div>
            <div class="aircraft-stats-page__seat-bar">
                <span v-for="(count, index) in pageData.seatSummary.counts" :key="index">
                    {{ count }}
                </span>
            </div>
            <p>
                Favorite Seat
                <strong>{{ pageData.seatSummary.favorite }}</strong>
            </p>
        </div>
        <FcTopAirlines v-bind="pageData.types" />
        <section class="stats-page__section">
            <div class="fc-stat-head">
                <h2>Class and Seat</h2>
                <BaseButton label="Share" :icon="shareIcon" size="sm" variant="fill" tone="default" />
            </div>
            <FcSeatStats v-bind="pageData.seats.class" :show-title="false" />
            <FcSeatStats v-bind="pageData.seats.seat" :show-title="false" />
            <FcSeatStats v-bind="pageData.seats.reason" :show-title="false" />
        </section>
        <FcFrequentTails v-bind="pageData.tails" />
        <div class="aircraft-stats-page__age">
            <div class="fc-stat-head">
                <h2>Aircraft Age</h2>
                <BaseButton label="Share" :icon="shareIcon" size="sm" variant="fill" tone="default" />
            </div>
            <FcAircraftStats :aircraft="pageData.aircraft" :show-period="false" :show-tail="false"
                :show-overview="false" :show-age-title="false" />
        </div>
        <p v-if="message" class="frame-page__feedback" role="status">
            {{ message }}
        </p>
    </section>
</template>

<script setup>
import { ref } from "vue";

import { useRoute } from "vue-router";

import BaseButton from "../component/base/BaseButton.vue";
import FcTabItem from "../component/fc/FcTabItem.vue";
import FcAircraftStats from "../component/fc/FcAircraftStats.vue";
import FcTopAirlines from "../component/fc/FcTopAirlines.vue";
import FcSeatStats from "../component/fc/FcSeatStats.vue";
import FcFrequentTails from "../component/fc/FcFrequentTails.vue";

import airlines from "../common/airlines.js";

import shareIcon from "../assets/icons/lucide/share-2.svg";

import "../assets/scss/component/base/BaseButton.scss";
import "../assets/scss/component/fc/FcIcon.scss";
import "../assets/scss/component/fc/FcTabItem.scss";
import "../assets/scss/component/fc/_stats.scss";
import "../assets/scss/component/fc/FcAircraftStats.scss";
import "../assets/scss/component/fc/FcSeatStats.scss";
import "../assets/scss/component/fc/FcFrequentTails.scss";
import "../assets/scss/component/fc/FcTopAirlines.scss";
import "../assets/scss/pages/_stats.scss";
import "../assets/scss/pages/AircraftStatsPage.scss";

// 이 페이지에서 사용하는 샘플 데이터입니다.
// prettier-ignore
const pageData = {
    "period": "ALL-TIME",
    "periods": ["ALL-TIME", "2025", "2024", "2023", "2017"],
    "aircraft": {
        "total": 12,
        "mostFlown": "A330-300",
        "tail": "HL-8078",
        "periods": ["ALL-TIME", "2025", "2024", "2023", "2017"],
        "manufacturer": "55% Airbus",
        "newest": {
            "age": "2 years",
            "model": "Embraer 175",
            "date": "5/25/2024"
        },
        "oldest": {
            "age": "25 years",
            "model": "B737-800",
            "date": "11/8/2000"
        },
        "summary": "4 flights · 12 hours",
        "median": "9 years old",
        "ages": [
            {
                "label": "2000's",
                "value": 25
            },
            {
                "label": "2010's",
                "value": 19
            },
            {
                "label": "2020's",
                "value": 6
            }
        ],
        "tailFlights": 2
    },
    "seatSummary": {
        "labels": ["Eco", "Eco+ Business First"],
        "counts": [19, 1, 0, 0],
        "favorite": "32K (3 times)"
    },
    "types": {
        "title": "Aircraft Types",
        "total": 16,
        "unit": "total aircraft",
        "items": [
            {
                "name": "A333",
                "flights": 13,
                "distance": 1000
            },
            {
                "name": "A359",
                "flights": 3,
                "distance": 1000
            },
            {
                "name": "A388",
                "flights": 2,
                "distance": 1000
            },
            {
                "name": "B738",
                "flights": 2,
                "distance": 1000
            },
            {
                "name": "A21N",
                "flights": 2,
                "distance": 1000
            },
            {
                "name": "A321",
                "flights": 2,
                "distance": 1000
            },
            {
                "name": "FRA",
                "flights": 2,
                "distance": 1000
            },
            {
                "name": "B739",
                "flights": 2,
                "distance": 1000
            },
            {
                "name": "B773",
                "flights": 2,
                "distance": 1000
            },
            {
                "name": "B789",
                "flights": 2,
                "distance": 1000
            },
            {
                "name": "E175",
                "flights": 2,
                "distance": 1000
            }
        ],
        "limit": 8,
        "showNames": true,
        "showTabs": false,
        "color": "var(--fc-chart-aircraft)"
    },
    "seats": {
        "seat": {
            "mode": "seat",
            "topLabel": "Top Seat",
            "topValue": "32K",
            "rows": [
                {
                    "name": "Aisle",
                    "count": 0,
                    "percent": 0,
                    "color": "var(--fc-success, #00ae70)"
                },
                {
                    "name": "Middle",
                    "count": 2,
                    "percent": 10,
                    "color": "#ff9d20"
                },
                {
                    "name": "Window",
                    "count": 18,
                    "percent": 90,
                    "color": "var(--fc-blue, #087bfa)"
                }
            ]
        },
        "class": {
            "mode": "class",
            "topLabel": "Top Class",
            "topValue": "Economy",
            "rows": [
                {
                    "name": "Economy",
                    "count": 20,
                    "percent": 100,
                    "color": "var(--fc-economy)"
                },
                {
                    "name": "Premium Economy",
                    "count": 0,
                    "percent": 0,
                    "color": "var(--fc-premium-economy)"
                },
                {
                    "name": "Business",
                    "count": 0,
                    "percent": 0,
                    "color": "var(--fc-business)"
                },
                {
                    "name": "First Class",
                    "count": 0,
                    "percent": 0,
                    "color": "var(--fc-first-class)"
                }
            ]
        },
        "reason": {
            "mode": "reason",
            "topLabel": "Top Reason",
            "topValue": "Personal",
            "rows": [
                {
                    "name": "Personal",
                    "count": 20,
                    "percent": 100,
                    "color": "var(--fc-success, #00ae70)"
                },
                {
                    "name": "Business",
                    "count": 0,
                    "percent": 0,
                    "color": "var(--fc-blue, #087bfa)"
                }
            ]
        }
    },
    "tails": {
        "tail": "HL-8078",
        "flights": 2,
        "model": "A359",
        "airline": airlines.OZ.iata,
        "flag": "🇰🇷"
    },
    "shareMessage": "Share preview ready."
};

const route = useRoute();
const period = ref(String(route.query.period || pageData.period));
const message = ref("");

function share(event) {
    if (event.target.closest(".fc-button--outline")) {
        message.value = pageData.shareMessage;
    }
}
</script>
