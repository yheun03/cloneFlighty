<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import FcPeriodTabs from "../component/fc/FcPeriodTabs.vue";
import FcDelayReport from "../component/fc/FcDelayReport.vue";
import FcAirlinePerformance from "../component/fc/FcAirlinePerformance.vue";
import pageData from "./data/DelayStatsPage.json";

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
    <section class="frame-page stats-page delay-stats-page" @click="share">
        <FcPeriodTabs v-model="period" :items="pageData.periods" />
        <FcDelayReport v-bind="pageData.report" />
        <FcAirlinePerformance :report="pageData.performance" section="mine" />
        <FcAirlinePerformance :report="pageData.performance" section="delays" />
        <FcAirlinePerformance
            :report="pageData.performance"
            section="airline"
        />
        <FcAirlinePerformance
            :report="pageData.performance"
            section="airport"
        />
        <p v-if="message" class="frame-page__feedback" role="status">
            {{ message }}
        </p>
    </section>
</template>
