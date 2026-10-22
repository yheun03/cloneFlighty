<script setup>
import BaseIcon from "../base/BaseIcon.vue";

import terminalIcon from "../../assets/icons/lucide/circle-check.svg";

defineProps({
    arrival: { type: String, required: true },
    departure: { type: String, required: true },
    terminal: { type: String, required: true },
    gate: { type: String, required: true },
});
</script>

<template>
    <div class="fc-terminal">
        <div class="fc-terminal__stop">
            <b>{{ gate }}</b>
            <span>
                <strong>{{ $t(terminal) }}</strong>
                <small>{{ $t("Awaiting Gate") }}</small>
            </span>
            <span>
                {{ $t("Arrive") }} {{ $t(arrival) }}
                <small>{{ $t("Scheduled") }}</small>
            </span>
        </div>
        <div class="fc-terminal__change">
            <BaseIcon :src="terminalIcon" />
            {{ $t("No Terminal Change") }}
        </div>
        <div class="fc-terminal__stop">
            <b>{{ gate }}</b>
            <span>
                <strong>{{ $t(terminal) }}</strong>
                <small>{{ $t("Awaiting Gate") }}</small>
            </span>
            <span>
                {{ $t("Depart") }} {{ $t(departure) }}
                <small>{{ $t("Scheduled") }}</small>
            </span>
        </div>
    </div>
</template>
