<template>
    <section class="frame-page stats-page delay-stats-page" @click="share">
        <FcPeriodTabs v-model="period" :items="pageData.periods" />
        <FcDelayReport v-bind="pageData.report" />
        <FcAirlinePerformance :report="pageData.performance" section="mine" />
        <FcAirlinePerformance :report="pageData.performance" section="delays" />
        <FcAirlinePerformance :report="pageData.performance" section="airline" />
        <FcAirlinePerformance :report="pageData.performance" section="airport" />
        <p v-if="message" class="frame-page__feedback" role="status">
            {{ message }}
        </p>
    </section>
</template>

<script setup>
import { ref } from "vue";

import { useRoute } from "vue-router";

import FcPeriodTabs from "../component/fc/FcPeriodTabs.vue";
import FcDelayReport from "../component/fc/FcDelayReport.vue";
import FcAirlinePerformance from "../component/fc/FcAirlinePerformance.vue";

import airlines from "../common/airlines.js";

import "../assets/scss/component/base/BaseButton.scss";
import "../assets/scss/component/fc/FcIcon.scss";
import "../assets/scss/component/fc/FcPeriodTabs.scss";
import "../assets/scss/component/fc/_stats.scss";
import "../assets/scss/component/fc/FcDelayReport.scss";
import "../assets/scss/component/fc/FcAirlinePerformance.scss";
import "../assets/scss/pages/_stats.scss";
import "../assets/scss/pages/DelayStatsPage.scss";

// 이 페이지에서 사용하는 샘플 데이터입니다.
// prettier-ignore
const pageData = {
    "period": "ALL-TIME",
    "periods": ["ALL-TIME", "2025", "2024", "2023", "2017"],
    "report": {
        "delayed": 8,
        "total": 20,
        "lostMinutes": 160,
        "worstDelay": "KE 24 · 1h 05m late",
        "worstAirline": `${airlines.KE.name} · 2h 10m late in total`
    },
    "performance": {
        "airports": [
            {
                "name": "🇰🇷 ICN",
                "percent": 100,
                "count": "1/1"
            },
            {
                "name": "🇫🇷 CDG",
                "percent": 50,
                "count": "1/2"
            },
            {
                "name": "🇺🇸 LAX",
                "percent": 33,
                "count": "1/3"
            },
            {
                "name": "🇯🇵 NRT",
                "percent": 25,
                "count": "1/4"
            },
            {
                "name": "🇳🇱 AMS",
                "percent": 10,
                "count": "1/1"
            },
            {
                "name": "🇫🇮 HEL",
                "percent": 10,
                "count": "1/1"
            }
        ],
        "airlines": [
            {
                "name": airlines.AY.name,
                "percent": 100,
                "count": "1/1"
            },
            {
                "name": airlines.KL.name,
                "percent": 50,
                "count": "1/2"
            },
            {
                "name": airlines.OZ.name,
                "percent": 33,
                "count": "1/3"
            },
            {
                "name": airlines.KE.name,
                "percent": 25,
                "count": "1/4"
            },
            {
                "name": airlines.AS.name,
                "percent": 10,
                "count": "1/1"
            },
            {
                "name": airlines.SQ.name,
                "percent": 10,
                "count": "1/1"
            }
        ],
        "performance": [
            {
                "label": "Early",
                "value": 81,
                "color": "var(--fc-success, #00ae70)"
            },
            {
                "label": "On Time",
                "value": 80,
                "color": "#53d96c"
            },
            {
                "label": "15m late",
                "value": 60,
                "color": "#ffca2d"
            },
            {
                "label": "30m late",
                "value": 40,
                "color": "#ff9d20"
            },
            {
                "label": "45m+ late",
                "value": 20,
                "color": "var(--fc-danger, #ff5049)"
            }
        ],
        "airportHeadline": "75%",
        "airlineHeadline": "50%",
        "cumulative": "11m",
        "delayTotal": 8,
        "delays": [
            {
                "flight": "KL 1251",
                "duration": "10h 47m",
                "route": "AMS-HEL",
                "date": "Dec 24, 2025"
            },
            {
                "flight": "KL 6410",
                "duration": "47m",
                "route": "AMS-HEL",
                "date": "Dec 24, 2025"
            },
            {
                "flight": "KL 703",
                "duration": "47m",
                "route": "AMS-HEL",
                "date": "Dec 24, 2025"
            },
            {
                "flight": "AY 911",
                "duration": "47m",
                "route": "AMS-HEL",
                "date": "Dec 24, 2025"
            },
            {
                "flight": "KE 24",
                "duration": "47m",
                "route": "AMS-HEL",
                "date": "Dec 24, 2025"
            },
            {
                "flight": "OZ 202",
                "duration": "47m",
                "route": "AMS-HEL",
                "date": "Dec 24, 2025"
            },
            {
                "flight": "AY 41",
                "duration": "47m",
                "route": "AMS-HEL",
                "date": "Dec 24, 2025"
            },
            {
                "flight": "KL 5926",
                "duration": "47m",
                "route": "AMS-HEL",
                "date": "Dec 24, 2025"
            }
        ]
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
