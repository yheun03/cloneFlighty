<script setup>
import { computed, ref, watch } from "vue";

import BaseButton from "./BaseButton.vue";
import { locale, t } from "../../common/preferences.js";

const props = defineProps({
    year: { type: Number, required: true },
    month: {
        type: Number,
        required: true,
        validator: (value) =>
            Number.isInteger(value) && value >= 1 && value <= 12,
    },
    // 날짜 숫자 목록입니다. marked는 채움, outlined는 테두리 상태입니다.
    marked: { type: Array, default: () => [] },
    outlined: { type: Array, default: () => [] },
});

const selected = defineModel({ type: String, default: "" });
const viewYear = ref(props.year);
const viewMonth = ref(props.month);
const isPeriodOpen = ref(false);

const weekdays = computed(() =>
    Array.from({ length: 7 }, (_, index) =>
        new Intl.DateTimeFormat(locale.value, { weekday: "short" }).format(
            new Date(2026, 0, 4 + index),
        ),
    ),
);
const months = computed(() =>
    Array.from({ length: 12 }, (_, index) => ({
        value: index + 1,
        label: new Intl.DateTimeFormat(locale.value, { month: "long" }).format(
            new Date(2026, index, 1),
        ),
    })),
);
const years = computed(() =>
    Array.from({ length: 21 }, (_, index) => props.year - 10 + index),
);
const title = computed(() =>
    new Intl.DateTimeFormat(locale.value, {
        month: "long",
        year: "numeric",
    }).format(new Date(viewYear.value, viewMonth.value - 1, 1)),
);
const days = computed(() => {
    const offset = new Date(viewYear.value, viewMonth.value - 1, 1).getDay();
    const count = new Date(viewYear.value, viewMonth.value, 0).getDate();
    return [
        ...Array(offset).fill(null),
        ...Array.from({ length: count }, (_, index) => index + 1),
    ];
});
const selectedDay = computed(() => {
    const [year, month, day] = selected.value.split("-").map(Number);
    return year === viewYear.value && month === viewMonth.value ? day : null;
});

function selectDay(day) {
    selected.value = [
        viewYear.value,
        String(viewMonth.value).padStart(2, "0"),
        String(day).padStart(2, "0"),
    ].join("-");
}

function moveMonth(step) {
    const date = new Date(viewYear.value, viewMonth.value - 1 + step, 1);
    viewYear.value = date.getFullYear();
    viewMonth.value = date.getMonth() + 1;
    isPeriodOpen.value = false;
}

watch(
    () => [props.year, props.month],
    ([year, month]) => {
        viewYear.value = year;
        viewMonth.value = month;
    },
);
</script>

<template>
    <div class="fc-calendar">
        <header class="fc-calendar__header">
            <BaseButton
                class="fc-calendar__period"
                :label="$t(title)"
                size="md"
                variant="text"
                tone="default"
                :aria-expanded="isPeriodOpen"
                @click="isPeriodOpen = !isPeriodOpen"
            />
            <div class="fc-calendar__navigation">
                <BaseButton
                    class="fc-calendar__previous"
                    :aria-label="$t('이전 달')"
                    icon="chevron-right"
                    :icon-size="16"
                    size="sm"
                    variant="text"
                    tone="default"
                    @click="moveMonth(-1)"
                />
                <BaseButton
                    :aria-label="$t('다음 달')"
                    icon="chevron-right"
                    :icon-size="16"
                    size="sm"
                    variant="text"
                    tone="default"
                    @click="moveMonth(1)"
                />
            </div>
        </header>
        <div
            v-if="isPeriodOpen"
            class="fc-calendar__period-picker"
        >
            <label>
                <span>{{ $t("연도") }}</span>
                <select v-model.number="viewYear">
                    <option
                        v-for="year in years"
                        :key="year"
                        :value="year"
                    >
                        {{ $t(year) }}
                    </option>
                </select>
            </label>
            <label>
                <span>{{ $t("월") }}</span>
                <select v-model.number="viewMonth">
                    <option
                        v-for="month in months"
                        :key="month.value"
                        :value="month.value"
                    >
                        {{ $t(month.label) }}
                    </option>
                </select>
            </label>
        </div>
        <div
            class="fc-calendar__grid"
            role="grid"
            :aria-label="`${title} ${t('Choose date')}`"
        >
            <span
                v-for="day in weekdays"
                :key="day"
                class="fc-calendar__weekday"
                role="columnheader"
                aria-hidden="true"
            >
                {{ $t(day) }}
            </span>
            <span
                v-for="(day, index) in days"
                :key="index"
                role="gridcell"
            >
                <button
                    v-if="day"
                    type="button"
                    :class="{
                        'is-marked': marked.includes(day),
                        'is-selected': selectedDay === day,
                        'is-outlined': outlined.includes(day),
                    }"
                    :aria-label="`${new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(viewYear, viewMonth - 1, day))}${marked.includes(day) ? `, ${t('Flight available')}` : ''}`"
                    :aria-pressed="selectedDay === day"
                    @click="selectDay(day)"
                >
                    {{ $t(day) }}
                </button>
            </span>
        </div>
    </div>
</template>
