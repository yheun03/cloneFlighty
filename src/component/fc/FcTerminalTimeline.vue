<script setup>
import FcIcon from "./FcIcon.vue";

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
                <strong>{{ terminal }}</strong>
                <small>Awaiting Gate</small>
            </span>
            <span>
                Arrive {{ arrival }}
                <small>Scheduled</small>
            </span>
        </div>
        <div class="fc-terminal__change">
            <FcIcon :src="terminalIcon" />
            &nbsp;No Terminal Change
        </div>
        <div class="fc-terminal__stop">
            <b>{{ gate }}</b>
            <span>
                <strong>{{ terminal }}</strong>
                <small>Awaiting Gate</small>
            </span>
            <span>
                Depart {{ departure }}
                <small>Scheduled</small>
            </span>
        </div>
    </div>
</template>
