<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import BaseButton from "../component/base/BaseButton.vue";
import FcPeriodTabs from "../component/fc/FcPeriodTabs.vue";
import FcAircraftStats from "../component/fc/FcAircraftStats.vue";
import FcTopAirlines from "../component/fc/FcTopAirlines.vue";
import FcSeatStats from "../component/fc/FcSeatStats.vue";
import FcFrequentTails from "../component/fc/FcFrequentTails.vue";
import shareIcon from "../assets/icons/lucide/share-2.svg";
import pageData from "./data/AircraftStatsPage.json";

const route = useRoute();
const period = ref(String(route.query.period || pageData.period));
const message = ref("");

function share(event) {
    if (event.target.closest(".fc-button--outline")) {
        message.value = pageData.shareMessage;
    }
}
</script>

<template>
    <section class="frame-page stats-page aircraft-stats-page" @click="share">
        <FcPeriodTabs v-model="period" :items="pageData.periods" />
        <FcAircraftStats
            :aircraft="pageData.aircraft"
            :show-period="false"
            :show-age="false"
        />
        <div class="aircraft-stats-page__seat-summary">
            <div>
                <span v-for="label in pageData.seatSummary.labels" :key="label">
                    {{ label }}
                </span>
            </div>
            <div class="aircraft-stats-page__seat-bar">
                <span
                    v-for="(count, index) in pageData.seatSummary.counts"
                    :key="index"
                    >{{ count }}</span
                >
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
                <BaseButton label="Share" :icon="shareIcon" variant="outline" />
            </div>
            <FcSeatStats v-bind="pageData.seats.class" :show-title="false" />
            <FcSeatStats v-bind="pageData.seats.seat" :show-title="false" />
            <FcSeatStats v-bind="pageData.seats.reason" :show-title="false" />
        </section>
        <FcFrequentTails v-bind="pageData.tails" />
        <div class="aircraft-stats-page__age">
            <div class="fc-stat-head">
                <h2>Aircraft Age</h2>
                <BaseButton label="Share" :icon="shareIcon" variant="outline" />
            </div>
            <FcAircraftStats
                :aircraft="pageData.aircraft"
                :show-period="false"
                :show-tail="false"
                :show-overview="false"
                :show-age-title="false"
            />
        </div>
        <p v-if="message" class="frame-page__feedback" role="status">
            {{ message }}
        </p>
    </section>
</template>
