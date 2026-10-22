<script setup>
import { ref, watch } from "vue";

import BaseIcon from "../base/BaseIcon.vue";
import BaseTabItem from "../base/BaseTabItem.vue";

import planeIcon from "../../assets/icons/lucide/plane.svg";

const props = defineProps({
    // 페이지에서 실제 항공편을 집계한 표시 데이터를 전달합니다.
    aircraft: { type: Object, required: true },
    // 표시할 통계 영역입니다.
    showPeriod: { type: Boolean, default: true },
    showAge: { type: Boolean, default: true },
    showAgeTitle: { type: Boolean, default: true },
    showTail: { type: Boolean, default: true },
    showOverview: { type: Boolean, default: true },
});

const period = ref(props.aircraft.periods[0]);
const imageFailed = ref(false);
watch(
    () => props.aircraft.image,
    () => {
        imageFailed.value = false;
    },
);
</script>

<template>
    <div class="fc-aircraft-stats">
        <BaseTabItem
            v-if="showPeriod"
            v-model="period"
            :items="aircraft.periods"
        />
        <template v-if="showOverview">
            <div class="fc-aircraft-stats__numbers">
                <div>
                    <span>{{ $t("Total Aircraft") }}</span>
                    <strong>{{ $t(aircraft.total) }}</strong>
                    <small>{{ $t(aircraft.manufacturer) }}</small>
                </div>
                <div>
                    <span>{{ $t("Newest Aircraft") }}</span>
                    <strong>{{ $t(aircraft.newest.age) }}</strong>
                    <small>{{ $t(aircraft.newest.model) }}</small>
                </div>
                <div>
                    <span>{{ $t("Oldest Aircraft") }}</span>
                    <strong>{{ $t(aircraft.oldest.age) }}</strong>
                    <small>{{ $t(aircraft.oldest.model) }}</small>
                </div>
            </div>
            <h3>{{ $t("Most flown aircraft") }}</h3>
            <div class="fc-aircraft-stats__featured">
                <strong>{{ $t(aircraft.mostFlown) }}</strong>
                <span>{{ $t(aircraft.summary) }}</span>
                <div>
                    <img
                        v-if="aircraft.image && !imageFailed"
                        :src="aircraft.image"
                        :class="{ 'is-local': aircraft.imageIsLocal }"
                        :alt="$t(aircraft.mostFlown)"
                        @error="imageFailed = true"
                    />
                    <BaseIcon
                        v-else
                        :src="planeIcon"
                    />
                </div>
            </div>
            <small
                v-if="aircraft.source"
                class="frame-page__note"
            >
                <a
                    :href="aircraft.source"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {{ $t("Aircraft data: adsbdb") }}
                </a>
                <template v-if="aircraft.imageSource && !imageFailed">
                    ·
                    <a
                        :href="aircraft.imageSource"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {{ $t("Photo: airport-data.com") }}
                    </a>
                </template>
            </small>
        </template>
        <template v-if="showAge">
            <h3 v-if="showAgeTitle">{{ $t("Aircraft Age") }}</h3>
            <p>
                {{ $t(aircraft.median) }}
                <small>{{ $t("median age") }}</small>
            </p>
            <div class="fc-aircraft-stats__ages">
                <div
                    v-for="age in aircraft.ages"
                    :key="age.label"
                >
                    <i :style="{ height: `${age.value * 5}px` }"></i>
                    <span>{{ $t(age.label) }}</span>
                </div>
            </div>
            <div class="fc-aircraft-stats__cards">
                <div>
                    <strong>{{ $t("Newest Aircraft") }}</strong>
                    <b>{{ $t(aircraft.newest.age) }} {{ $t("old") }}</b>
                    <span>{{ $t(aircraft.newest.date) }}</span>
                    <div
                        v-if="aircraft.newest.image"
                        class="fc-aircraft-stats__card-image"
                    >
                        <img
                            :src="aircraft.newest.image"
                            :alt="$t(aircraft.newest.model)"
                        />
                    </div>
                    <small>{{ $t(aircraft.newest.model) }}</small>
                </div>
                <div>
                    <strong>{{ $t("Oldest Aircraft") }}</strong>
                    <b>{{ $t(aircraft.oldest.age) }} {{ $t("old") }}</b>
                    <span>{{ $t(aircraft.oldest.date) }}</span>
                    <div
                        v-if="aircraft.oldest.image"
                        class="fc-aircraft-stats__card-image"
                    >
                        <img
                            :src="aircraft.oldest.image"
                            :alt="$t(aircraft.oldest.model)"
                        />
                    </div>
                    <small>{{ $t(aircraft.oldest.model) }}</small>
                </div>
            </div>
        </template>
        <template v-if="showTail">
            <h3>{{ $t("Frequented Tail No.") }}</h3>
            <p>
                {{ $t(aircraft.tailFlights) }} {{ $t("flights ·") }}
                {{ aircraft.tail }}
            </p>
        </template>
    </div>
</template>
