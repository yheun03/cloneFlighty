<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import FcConnectionStatus from "../component/fc/FcConnectionStatus.vue";
import FcTerminalTimeline from "../component/fc/FcTerminalTimeline.vue";
import pageData from "./data/ConnectionPage.json";

const route = useRoute();
const expanded = computed(() => route.name === "connection-details");
</script>

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
            <span class="connection-page__duration">{{
                pageData.status.duration
            }}</span>
        </RouterLink>
        <FcTerminalTimeline v-bind="pageData.timeline" />
    </section>
</template>
