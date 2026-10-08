<template>
    <section class="frame-page connection-page">
        <FcConnectionStatus v-bind="pageData.status" />
        <p
            v-if="expanded"
            id="connection-description"
            class="connection-page__description"
        >
            {{ pageData.description }}
        </p>
        <RouterLink
            class="connection-page__meter"
            :to="{
                name: expanded ? 'connection' : 'connection-details',
                params: route.params,
                query: route.query,
            }"
            :aria-expanded="expanded"
            aria-controls="connection-description"
            aria-label="Minimum connection time explanation"
        >
            <span class="connection-page__minimum">{{ pageData.minimum }}</span>
            <span class="connection-page__track"><span></span></span>
            <span class="connection-page__duration">
                {{ pageData.status.duration }}
            </span>
        </RouterLink>
        <FcTerminalTimeline v-bind="pageData.timeline" />
    </section>
</template>

<script setup>
import { computed } from "vue";

import { useRoute } from "vue-router";

import FcConnectionStatus from "../component/fc/FcConnectionStatus.vue";
import FcTerminalTimeline from "../component/fc/FcTerminalTimeline.vue";

import "../assets/scss/component/fc/FcIcon.scss";
import "../assets/scss/component/fc/FcConnectionStatus.scss";
import "../assets/scss/component/fc/FcTerminalTimeline.scss";
import "../assets/scss/pages/ConnectionPage.scss";

// 이 페이지에서 사용하는 예제 JSON 데이터입니다.
// prettier-ignore
const pageData = {
    "status": {
        "title": "Relaxed Connection",
        "duration": "4h 30m",
        "extra": "3h 10m"
    },
    "minimum": "1h 20m minimum",
    "description": "The Minimum Connection Time (MCT) is the shortest time airlines allow when booking connecting flights. It’s an official time, specific to every connection and accounting for things like distance, security, border control, and even seasonality. While it’s a great rule of thumb for the minimum amount of time you’ll need, it’s certainly possible to make it in less time.",
    "timeline": {
        "arrival": "05:20",
        "departure": "09:50",
        "terminal": "Terminal Main",
        "gate": "A4"
    }
};

const route = useRoute();
const expanded = computed(() => route.name === "connection-details");
</script>
