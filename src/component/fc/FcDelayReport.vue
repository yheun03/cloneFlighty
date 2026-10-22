<script setup>
import { computed } from "vue";

import BaseIcon from "../base/BaseIcon.vue";
import { formatDuration } from "../../common/preferences.js";

const props = defineProps({
    brandIcon: { type: String, default: "" },
    delayed: { type: Number, required: true },
    total: { type: Number, required: true },
    worstDelay: { type: String, required: true },
    worstAirline: { type: String, required: true },
    lostMinutes: { type: Number, required: true },
});

const delayedPercent = computed(() =>
    props.total ? Math.round((props.delayed / props.total) * 100) : 0,
);
const averageDelay = computed(() =>
    props.delayed ? Math.round(props.lostMinutes / props.delayed) : 0,
);
const lostTime = computed(() => formatDuration(props.lostMinutes));
</script>

<template>
    <div class="fc-delay-report">
        <div class="fc-delay-report__brand">
            <BaseIcon :src="brandIcon" />
            {{ $t("Flighty") }}
            <strong>{{ $t("All-Time Delay Report") }}</strong>
        </div>
        <strong class="fc-delay-report__percent">
            {{ $t(delayedPercent) }}%
        </strong>
        <h2>{{ $t("My flights delayed") }}</h2>
        <p>
            {{
                $t(
                    "{delayed} of my {total} flights arrived later than scheduled",
                    { delayed, total },
                )
            }}
        </p>
        <div class="fc-delay-report__stripe"></div>
        <h3>{{ $t("Lost to Delays") }}</h3>
        <p>
            {{
                $t("Delayed flights averaged {duration} late", {
                    duration: formatDuration(averageDelay),
                })
            }}
        </p>
        <strong class="fc-delay-report__big">{{ $t(lostTime) }}</strong>
        <h3>{{ $t("Worst Delay") }}</h3>
        <p>{{ $t(worstDelay) }}</p>
        <div class="fc-delay-report__stripe"></div>
        <h3>{{ $t("Worst Airline") }}</h3>
        <p>{{ $t(worstAirline) }}</p>
    </div>
</template>
