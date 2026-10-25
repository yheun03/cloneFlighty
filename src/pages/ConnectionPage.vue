<template>
    <section class="frame-page connection-page">
        <FcConnectionStatus v-bind="pageData.status" />
        <p v-if="expanded" id="connection-description" class="connection-page__description">
            {{ $t(pageData.description) }}
        </p>
        <RouterLink class="connection-page__meter" :to="{
            name: expanded ? 'connection' : 'connection-details',
            params: route.params,
            query: route.query,
        }" :aria-expanded="expanded" aria-controls="connection-description"
            :aria-label="$t('Minimum connection time explanation')">
            <span class="connection-page__meter-callout">
                {{ $t(pageData.status.duration) }} {{ $t("AT AMS") }}
            </span>
            <span class="connection-page__meter-scale">
                <span class="connection-page__meter-hatch"></span>
                <span class="connection-page__meter-bar"></span>
                <span class="connection-page__meter-minimum" :data-label="$t(pageData.minimum)"></span>
                <span class="connection-page__meter-now"></span>
            </span>
            <span class="connection-page__meter-labels">
                <b>{{ $t("RISKY") }}</b>
                <b>{{ $t("MIN. NORMAL") }}</b>
                <b>{{ $t("RELAXED") }}</b>
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
import pageData from "../data/pages/connection.json";

import "../assets/scss/component/base/BaseIcon.scss";
import "../assets/scss/component/fc/FcConnectionStatus.scss";
import "../assets/scss/component/fc/FcTerminalTimeline.scss";
import "../assets/scss/pages/page_connection.scss";

const route = useRoute();
const expanded = computed(() => route.name === "connection-details");
</script>
