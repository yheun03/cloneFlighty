<script setup>
import { computed, ref } from "vue";

import BaseButton from "../base/BaseButton.vue";

import shareIcon from "../../assets/figma/share.svg";

const props = defineProps({
    total: { type: Number, required: true },
    // 국가: { name, flag, count }, 지역: { name, count, percent }
    countries: { type: Array, required: true },
    regions: { type: Array, required: true },
});

const expanded = ref(false);
const visibleCountries = computed(() =>
    expanded.value ? props.countries : props.countries.slice(0, 3),
);
</script>

<template>
    <div class="fc-countries">
        <div class="fc-stat-head">
            <h2>{{ $t("Countries & Territories") }}</h2>
            <BaseButton
                :label="$t('Share')"
                :icon="shareIcon"
                size="md"
                variant="fill"
                tone="gray"
            />
        </div>
        <div class="fc-stat-number">
            <strong>{{ $t(total) }}</strong>
            <span>{{ $t("total") }}</span>
        </div>
        <div
            v-for="country in visibleCountries"
            :key="country.name"
            class="fc-countries__row"
        >
            <span>{{ $t(country.flag) }}</span>
            <strong>{{ $t(country.name) }}</strong>
            <small>{{ $t(country.count) }} {{ $t("flights") }}</small>
        </div>
        <button
            type="button"
            class="fc-stat-more"
            :aria-expanded="expanded"
            @click="expanded = !expanded"
        >
            {{ $t(expanded ? "Show Less" : "Show More") }}
        </button>
        <div class="fc-countries__regions">
            <div
                v-for="region in regions"
                :key="region.name"
            >
                <strong>{{ $t(region.name) }}</strong>
                <span>
                    {{ $t(region.count) }}
                    <small>{{ $t(region.percent) }}</small>
                </span>
            </div>
        </div>
    </div>
</template>
