<script setup>
import BaseButton from "../base/BaseButton.vue";

import shareIcon from "../../assets/figma/share.svg";

defineProps({
    airline: { type: String, required: true },
    flag: { type: String, required: true },
    tail: { type: String, required: true },
    flights: { type: Number, required: true },
    model: { type: String, required: true },
});
</script>

<template>
    <div class="fc-frequent-tails">
        <div class="fc-stat-head">
            <h2>{{ $t("Most Frequent Tails") }}</h2>
            <BaseButton
                :label="$t('Share')"
                :icon="shareIcon"
                size="md"
                variant="fill"
                tone="gray"
            />
        </div>
        <strong>{{ tail }}</strong>
        <p>{{ $t(flights) }} {{ $t("flights") }}</p>
        <small>{{ $t(airline) }} · {{ $t(model) }}</small>
        <span>{{ $t(flag) }}</span>
    </div>
</template>
