<template>
    <section class="frame-page units-page">
        <h1 class="frame-page__title">{{ $t("Units") }}</h1>
        <p class="frame-page__lead">
            {{
                $t(
                    "Choose distance, speed, and altitude units for this device.",
                )
            }}
        </p>
        <section
            class="units-page__section"
            aria-labelledby="distance-title"
        >
            <h2 id="distance-title">{{ $t("Distance") }}</h2>
            <BaseTabItem
                v-model="preferences.distance"
                variant="segment"
                type="radio"
                :items="pageData.distanceUnits"
                :label="$t('Distance unit')"
            />
            <p>{{ $t("Example: {value}", { value: formatDistance(1000) }) }}</p>
        </section>
        <section
            class="units-page__section"
            aria-labelledby="speed-title"
        >
            <h2 id="speed-title">
                <BaseIcon :src="speedIcon" />
                {{ $t("Aircraft Speed") }}
            </h2>
            <p>{{ $t("Speed relative to the ground.") }}</p>
            <BaseTabItem
                v-model="preferences.speed"
                variant="segment"
                type="radio"
                :items="pageData.speedUnits"
                :label="$t('Aircraft speed unit')"
            />
            <p>{{ $t("Example: {value}", { value: formatSpeed(900) }) }}</p>
        </section>
        <section
            class="units-page__section"
            aria-labelledby="altitude-title"
        >
            <h2 id="altitude-title">
                <BaseIcon :src="speedIcon" />
                {{ $t("Altitude") }}
            </h2>
            <p>
                {{
                    $t(
                        "Zero on the ground, and “Standard Pressure Setting” in flight to ensure consistent flight levels worldwide.",
                    )
                }}
            </p>
            <BaseTabItem
                v-model="preferences.altitude"
                variant="segment"
                type="radio"
                :items="pageData.altitudeUnits"
                :label="$t('Altitude unit')"
            />
            <p>
                {{ $t("Example: {value}", { value: formatAltitude(10668) }) }}
            </p>
        </section>
        <p class="frame-page__note">
            {{
                $t(
                    "Example values demonstrate unit conversion, not live flight measurements.",
                )
            }}
        </p>
    </section>
</template>
<script setup>
import BaseIcon from "../component/base/BaseIcon.vue";
import BaseTabItem from "../component/base/BaseTabItem.vue";
import {
    preferences,
    formatDistance,
    formatSpeed,
    formatAltitude,
} from "../common/preferences.js";
import speedIcon from "../assets/figma/speed.svg";
import "../assets/scss/component/base/BaseIcon.scss";
import "../assets/scss/component/base/BaseTabItem.scss";
import "../assets/scss/pages/page_units.scss";

const pageData = {
    distanceUnits: ["km", "mi", "nm"],
    speedUnits: ["mph", "km/h", "kt"],
    altitudeUnits: ["ft", "km", "m", "FL"],
};
</script>
