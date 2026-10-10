<template>
    <section class="frame-page stats-page" @click="share">
        <FcPeriodTabs v-model="period" :items="pageData.periods" />
        <FcPassportOverview v-bind="pageData.overview" :show-period="false" :show-history="false" />
        <section class="stats-page__section">
            <div class="fc-stat-head">
                <h2>Flights</h2>
                <BaseButton label="Share" :icon="shareIcon" size="sm" variant="fill" tone="default" />
            </div>
            <div class="fc-stat-number">
                <strong>{{ pageData.flights.total }}</strong>
            </div>
            <p class="frame-page__note">
                {{ pageData.flights.domestic }} domestic
                <br />
                {{ pageData.flights.international }} international
                <br />
                {{ pageData.flights.longHaul }} long haul
            </p>
            <div class="stats-page__flight-tabs">
                <span>FLIGHTS PER</span>
                <FcPeriodTabs v-model="metric" :items="pageData.metrics" />
            </div>
            <svg class="stats-page__line-chart" viewBox="0 0 280 170" role="img" :aria-label="`Flights per ${metric}`">
                <polyline :points="pageData.points[metric]" fill="none" stroke="var(--fc-chart-line)"
                    stroke-width="2" />
                <circle v-for="point in chartPoints" :key="point.point" :cx="point.x" :cy="point.y" r="3"
                    fill="var(--fc-chart-line)" />
            </svg>
        </section>
        <FcFlightDistanceStats v-bind="pageData.distance" view="summary" />
        <FcFlightDistanceStats v-bind="pageData.distance" view="breakdown" />
        <FcTopAirlines v-bind="pageData.airports" />
        <FcTopAirlines v-bind="pageData.airlines" />
        <FcTopAirlines v-bind="pageData.routes" />
        <FcCountriesStats v-bind="pageData.countries" />
        <p v-if="message" class="frame-page__feedback" role="status">
            {{ message }}
        </p>
    </section>
</template>

<script setup>
import { computed, ref } from "vue";

import { useRoute } from "vue-router";

import BaseButton from "../component/base/BaseButton.vue";
import FcPeriodTabs from "../component/fc/FcPeriodTabs.vue";
import FcPassportOverview from "../component/fc/FcPassportOverview.vue";
import FcFlightDistanceStats from "../component/fc/FcFlightDistanceStats.vue";
import FcTopAirlines from "../component/fc/FcTopAirlines.vue";
import FcCountriesStats from "../component/fc/FcCountriesStats.vue";

import airlines from "../common/airlines.js";

import shareIcon from "../assets/icons/lucide/share-2.svg";

import "../assets/scss/component/base/BaseButton.scss";
import "../assets/scss/component/fc/FcIcon.scss";
import "../assets/scss/component/fc/FcPeriodTabs.scss";
import "../assets/scss/component/fc/_stats.scss";
import "../assets/scss/component/fc/FcPassportOverview.scss";
import "../assets/scss/component/fc/FcCountriesStats.scss";
import "../assets/scss/component/fc/FcTopAirlines.scss";
import "../assets/scss/component/fc/FcFlightDistanceStats.scss";
import "../assets/scss/pages/_stats.scss";
import "../assets/scss/pages/FlightStatsPage.scss";

// 이 페이지에서 사용하는 샘플 데이터입니다.
// prettier-ignore
const pageData = {
    "period": "ALL-TIME",
    "periods": ["ALL-TIME", "2025", "2024", "2023", "2017"],
    "metric": "Year",
    "metrics": ["Year", "Month", "Weekday"],
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
    "flights": {
        "total": 20,
        "domestic": 3,
        "international": 17,
        "longHaul": 8
    },
    "points": {
        "Year": "0,90 70,130 140,75 210,125 280,28",
        "Month": "0,120 70,90 140,115 210,50 280,28",
        "Weekday": "0,115 70,60 140,95 210,40 280,75"
    },
    "distance": {
        "title": "Flight Distance",
        "shareLabel": "Share",
        "shareIcon": "share-2",
        "distance": "73,650",
        "distanceUnit": "km",
        "miles": "45,764",
        "milesUnit": "mi",
        "breakdown": [
            {
                "label": "Days",
                "value": "4.6"
            },
            {
                "label": "Weeks",
                "value": "4.6"
            },
            {
                "label": "Months",
                "value": "4.6"
            },
            {
                "label": "Years",
                "value": "4.6"
            },
            {
                "label": "Avg. Flight Time",
                "value": "5h 28m"
            },
            {
                "label": "In Air",
                "value": "4.6"
            },
            {
                "label": "Taxiing",
                "value": "5h 28m"
            }
        ],
        "averageLabel": "Average distance: 3,682 km",
        "comparisons": [
            {
                "icon": "earth",
                "text": "1.8x Around Earth"
            },
            {
                "icon": "moon",
                "text": "0.2x To the Moon"
            },
            {
                "icon": "sun",
                "text": "0.02x Around the Sun"
            }
        ],
        "summaryLabel": "Show Summary",
        "breakdownLabel": "Show Breakdown",
        "shortestFlight": {
            "title": "Shortest flight",
            "route": "Jeju → Seoul",
            "distance": "451 km",
            "detail": "KE 1238 · 2 Jun 2017"
        },
        "longestFlight": {
            "title": "Longest flight",
            "route": "Jeju → Seoul",
            "distance": "9,647 km",
            "detail": "KE 1238 · 2 Jun 2017"
        }
    },
    "airports": {
        "title": "Flight Distance",
        "total": "73,650",
        "unit": "km",
        "items": [
            {
                "name": "ICN",
                "flights": 13,
                "distance": 48600
            },
            {
                "name": "AMS",
                "flights": 3,
                "distance": 5250
            },
            {
                "name": "CDG",
                "flights": 2,
                "distance": 5250
            },
            {
                "name": "LAX",
                "flights": 2,
                "distance": 5250
            },
            {
                "name": "SFO",
                "flights": 2,
                "distance": 5250
            },
            {
                "name": "JFK",
                "flights": 2,
                "distance": 5250
            },
            {
                "name": "FRA",
                "flights": 2,
                "distance": 5250
            },
            {
                "name": "NRT",
                "flights": 2,
                "distance": 5250
            },
            {
                "name": "HEL",
                "flights": 2,
                "distance": 5250
            },
            {
                "name": "SIN",
                "flights": 2,
                "distance": 5250
            },
            {
                "name": "LHR",
                "flights": 2,
                "distance": 5250
            }
        ],
        "limit": 8,
        "showNames": true,
        "showTabs": false
    },
    "airlines": {
        "title": "Top Airlines",
        "total": 9,
        "unit": "total airlines",
        "items": [
            {
                "name": airlines.KE.name,
                "flights": 13,
                "distance": 48600
            },
            {
                "name": airlines.OZ.name,
                "flights": 3,
                "distance": 12000
            },
            {
                "name": airlines.KL.name,
                "flights": 2,
                "distance": 7800
            },
            {
                "name": airlines.AY.name,
                "flights": 2,
                "distance": 5250
            }
        ]
    },
    "routes": {
        "title": "Top Routes",
        "total": 9,
        "items": [
            {
                "name": "AMS-HEL",
                "flights": 13,
                "distance": 48600
            },
            {
                "name": "AMS-ICN",
                "flights": 3,
                "distance": 5250
            },
            {
                "name": "CJU-GMP",
                "flights": 2,
                "distance": 5250
            },
            {
                "name": "FRA-ICN",
                "flights": 2,
                "distance": 5250
            },
            {
                "name": "ICN-NRT",
                "flights": 2,
                "distance": 5250
            },
            {
                "name": "ICN-SFO",
                "flights": 2,
                "distance": 5250
            }
        ],
        "limit": 4,
        "unit": "total routes",
        "showNames": true
    },
    "countries": {
        "total": 11,
        "countries": [
            {
                "flag": "🇰🇷",
                "name": "South Korea",
                "count": 16
            },
            {
                "flag": "🇳🇱",
                "name": "Netherlands",
                "count": 16
            },
            {
                "flag": "🇺🇸",
                "name": "United States",
                "count": 16
            },
            {
                "flag": "🇯🇵",
                "name": "Japan",
                "count": 7
            },
            {
                "flag": "🇸🇬",
                "name": "Singapore",
                "count": 5
            }
        ],
        "regions": [
            {
                "name": "Asia",
                "count": 5,
                "percent": "14%"
            },
            {
                "name": "Europe",
                "count": 5,
                "percent": "14%"
            },
            {
                "name": "N. America",
                "count": 5,
                "percent": "14%"
            },
            {
                "name": "Africa",
                "count": 5,
                "percent": "14%"
            },
            {
                "name": "C. America",
                "count": 5,
                "percent": "14%"
            },
            {
                "name": "Caribbean",
                "count": 5,
                "percent": "14%"
            },
            {
                "name": "Middle East",
                "count": 5,
                "percent": "14%"
            },
            {
                "name": "Oceania",
                "count": 5,
                "percent": "14%"
            },
            {
                "name": "S. America",
                "count": 5,
                "percent": "14%"
            }
        ]
    },
    "shareMessage": "Share preview ready."
};

const route = useRoute();
const period = ref(String(route.query.period || pageData.period));
const metric = ref(pageData.metric);
const message = ref("");
const chartPoints = computed(() =>
    pageData.points[metric.value].split(" ").map((point) => {
        const [x, y] = point.split(",");
        return { point, x, y };
    }),
);

function share(event) {
    if (event.target.closest(".fc-button--outline")) {
        message.value = pageData.shareMessage;
    }
}
</script>
