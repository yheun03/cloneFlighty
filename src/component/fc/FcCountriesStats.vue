<script setup>
import { computed, ref } from "vue";

import BaseButton from "../base/BaseButton.vue";

import shareIcon from "../../assets/icons/lucide/share-2.svg";

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
            <h2>Countries &amp; Territories</h2>
            <BaseButton
                label="Share"
                :icon="shareIcon"
                variant="outline"
            />
        </div>
        <div class="fc-stat-number">
            <strong>{{ total }}</strong>
            <span>total</span>
        </div>
        <div
            v-for="country in visibleCountries"
            :key="country.name"
            class="fc-countries__row"
        >
            <span>{{ country.flag }}</span>
            <strong>{{ country.name }}</strong>
            <small>{{ country.count }} flights</small>
        </div>
        <button
            type="button"
            class="fc-stat-more"
            :aria-expanded="expanded"
            @click="expanded = !expanded"
        >
            {{ expanded ? "Show Less" : "Show More" }}
        </button>
        <div class="fc-countries__regions">
            <div
                v-for="region in regions"
                :key="region.name"
            >
                <strong>{{ region.name }}</strong>
                <span>
                    {{ region.count }}
                    <small>{{ region.percent }}</small>
                </span>
            </div>
        </div>
    </div>
</template>
