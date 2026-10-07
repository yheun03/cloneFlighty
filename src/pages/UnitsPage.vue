<script setup>
import { ref } from "vue";
import FcIcon from "../component/fc/FcIcon.vue";
import FcPeriodTabs from "../component/fc/FcPeriodTabs.vue";
import speedIcon from "../assets/icons/lucide/clock-3.svg";
import pageData from "./data/UnitsPage.json";

const speed = ref(pageData.speed);
const altitude = ref(pageData.altitude);
</script>

<template>
    <section class="frame-page units-page">
        <h1 class="frame-page__title">Units</h1>
        <p class="frame-page__lead">
            Set your preferred units for this device. Other units can be changed
            in your device settings.
        </p>
        <section class="units-page__section" aria-labelledby="speed-title">
            <h2 id="speed-title"><FcIcon :src="speedIcon" /> Aircraft Speed</h2>
            <p>Speed relative to the ground.</p>
            <FcPeriodTabs
                v-model="speed"
                class="units-page__segments"
                :items="pageData.speedUnits"
                label="Aircraft speed unit"
            />
        </section>
        <section class="units-page__section" aria-labelledby="altitude-title">
            <h2 id="altitude-title"><FcIcon :src="speedIcon" /> Altitude</h2>
            <p>
                Zero on the ground, and “Standard Pressure Setting” in flight to
                ensure consistent flight levels worldwide.
            </p>
            <FcPeriodTabs
                v-model="altitude"
                class="units-page__segments"
                :items="pageData.altitudeUnits"
                label="Altitude unit"
            />
        </section>
    </section>
</template>
