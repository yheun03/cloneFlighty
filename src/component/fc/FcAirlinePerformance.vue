<script setup>
import { computed, ref } from "vue";

import BaseIcon from "../base/BaseIcon.vue";
import BaseButton from "../base/BaseButton.vue";

import { defaultAirlineLogo, getAirline } from "../../common/airlines.js";
import airports from "../../common/airports.js";
import shareIcon from "../../assets/figma/share.svg";

const props = defineProps({
    section: {
        type: String,
        default: "all",
        validator: (value) =>
            ["all", "airline", "airport", "mine", "delays"].includes(value),
    },
    report: { type: Object, required: true },
});

const showAll = ref(false);
const showDelays = ref(false);

const isAirport = computed(() => props.section === "airport");
const performanceTitle = computed(() =>
    isAirport.value ? "Airport Performance" : "Airline Performance",
);
const performanceHeadline = computed(() =>
    isAirport.value
        ? props.report.airportHeadline
        : props.report.airlineHeadline,
);
const visiblePerformance = computed(() => {
    const items = isAirport.value
        ? props.report.airports
        : props.report.airlines;
    return (showAll.value ? items : items.slice(0, 5)).map((item) => {
        const code = item.iata || item.name.split(" ").at(-1);
        return {
            ...item,
            name: isAirport.value ? code : item.name,
            icon:
                item.icon ||
                (isAirport.value
                    ? airports[code]?.flagIcon
                    : airlineLogo(item.iata || item.name)),
        };
    });
});
const visibleDelays = computed(() =>
    showDelays.value ? props.report.delays : props.report.delays.slice(0, 4),
);

function airlineLogo(value) {
    return getAirline(value)?.logo || defaultAirlineLogo;
}
</script>

<template>
    <div class="fc-performance">
        <template v-if="['all', 'airline', 'airport'].includes(section)">
            <div class="fc-stat-head">
                <h2>{{ $t(performanceTitle) }}</h2>
                <BaseButton
                    :label="$t('Share')"
                    :icon="shareIcon"
                    size="md"
                    variant="fill"
                    tone="gray"
                />
            </div>
            <div class="fc-performance__headline">
                <strong>{{ $t(performanceHeadline) }}</strong>
                <span>
                    {{ $t(isAirport ? "late departures" : "late arrivals") }}
                </span>
            </div>
            <div
                v-for="item in visiblePerformance"
                :key="item.name"
                class="fc-performance__bar"
            >
                <div>
                    <span>
                        <BaseIcon
                            v-if="item.icon"
                            :src="item.icon"
                            variant="image"
                        />
                        &nbsp;{{ $t(item.name) }}
                    </span>
                    <span>
                        {{ $t(item.percent) }}% &nbsp;({{ $t(item.count) }})
                    </span>
                </div>
                <i><b :style="{ width: `${item.percent}%` }"></b></i>
            </div>
            <button
                v-if="
                    (isAirport ? report.airports : report.airlines).length > 5
                "
                type="button"
                class="fc-stat-more"
                :aria-expanded="showAll"
                @click="showAll = !showAll"
            >
                {{ $t(showAll ? "Show Less" : "Show More") }}
            </button>
        </template>
        <template v-if="['all', 'mine'].includes(section)">
            <div class="fc-stat-head">
                <h2>{{ $t("My Performance") }}</h2>
                <BaseButton
                    :label="$t('Share')"
                    :icon="shareIcon"
                    size="md"
                    variant="fill"
                    tone="gray"
                />
            </div>
            <div class="fc-performance__headline">
                <strong>{{ $t(report.cumulative) }}</strong>
                <span>{{ $t(report.cumulativeTiming || "late") }}</span>
            </div>
            <p>{{ $t("cumulative arrival performance") }}</p>
            <div
                v-for="item in report.performance"
                :key="item.label"
                class="fc-performance__meter"
            >
                <span>{{ $t(item.label) }}</span>
                <i>
                    <b
                        :style="{
                            width: `${item.value}%`,
                            background: item.color,
                        }"
                    ></b>
                </i>
                <strong>{{ $t(item.value) }}%</strong>
            </div>
        </template>
        <template v-if="['all', 'delays'].includes(section)">
            <div class="fc-stat-head">
                <h2>{{ $t("Arrival Delays") }}</h2>
                <BaseButton
                    :label="$t('Share')"
                    :icon="shareIcon"
                    size="md"
                    variant="fill"
                    tone="gray"
                />
            </div>
            <div class="fc-stat-number">
                <strong>{{ $t(report.delayTotal) }}</strong>
                <span>{{ $t("total") }}</span>
            </div>
            <div
                v-for="flight in visibleDelays"
                :key="flight.id || `${flight.flight}-${flight.date}`"
                class="fc-performance__delay"
            >
                <span>
                    <BaseIcon
                        :src="airlineLogo(flight.flight)"
                        variant="image"
                    />
                    {{ flight.flight }}
                </span>
                <b>{{ $t(flight.duration) }}</b>
                <span>{{ $t(flight.route) }}</span>
                <small>{{ $t(flight.date) }}</small>
            </div>
            <button
                v-if="report.delays.length > 4"
                type="button"
                class="fc-stat-more"
                :aria-expanded="showDelays"
                @click="showDelays = !showDelays"
            >
                {{ $t(showDelays ? "Show Less" : "Show More") }}
            </button>
        </template>
        <p
            v-if="
                (section === 'mine' && !report.performance.length) ||
                (section === 'airline' && !report.airlines.length) ||
                (section === 'airport' && !report.airports.length)
            "
            class="frame-page__note"
        >
            {{ $t("No recorded times for this period.") }}
        </p>
        <p
            v-if="section === 'delays' && !report.delays.length"
            class="frame-page__note"
        >
            {{ $t("No delayed arrivals recorded for this period.") }}
        </p>
    </div>
</template>
