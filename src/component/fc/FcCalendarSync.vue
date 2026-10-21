<script setup>
import { ref } from "vue";

import BaseIcon from "../base/BaseIcon.vue";
import BaseToggleSwitch from "../base/BaseToggleSwitch.vue";

import calendarIcon from "../../assets/figma/calendar-import.svg";
import calendarExportIcon from "../../assets/figma/calendar-export.svg";
import nextIcon from "../../assets/figma/chevron-right.svg";
import noticeIcon from "../../assets/figma/calendar-shield.svg";

const props = defineProps({
    // 표시할 캘린더 이름 목록입니다.
    calendars: { type: Array, required: true },
    // 최초 상태: { importEnabled, exportEnabled, importCalendars, exportCalendar }
    settings: { type: Object, required: true },
});

const importEnabled = ref(props.settings.importEnabled);
const exportEnabled = ref(props.settings.exportEnabled);
const choosing = ref("");
const importCalendars = ref([...props.settings.importCalendars]);
const exportCalendar = ref(props.settings.exportCalendar);

function toggleCalendarChoices(mode) {
    choosing.value = choosing.value === mode ? "" : mode;
}

function selectCalendar(calendar) {
    if (choosing.value === "import") {
        importCalendars.value = importCalendars.value.includes(calendar)
            ? importCalendars.value.filter((item) => item !== calendar)
            : [...importCalendars.value, calendar];
    } else {
        exportCalendar.value = calendar;
        choosing.value = "";
    }
}
</script>

<template>
    <div class="fc-calendar-sync">
        <strong>Keep your calendar accurate and flights in sync.</strong>
        <p>
            Import flights in your calendar for tracking, plus past flights.
            Export flights with reservation details and live updating to keep
            your calendar accurate.
        </p>
        <div class="fc-calendar-sync__item">
            <div>
                <h3>Import Flights</h3>
                <BaseToggleSwitch
                    v-model="importEnabled"
                    label="Import Flights"
                />
            </div>
            <button
                type="button"
                :aria-expanded="choosing === 'import'"
                @click="toggleCalendarChoices('import')"
            >
                <span class="fc-calendar-sync__label">
                    <BaseIcon :src="calendarIcon" />
                    Choose Calendars
                </span>
                <span>
                    {{ importCalendars.join(", ") || "Select" }}&nbsp;
                    <BaseIcon :src="nextIcon" />
                </span>
            </button>
        </div>
        <div class="fc-calendar-sync__item">
            <div>
                <h3>Export Flights</h3>
                <BaseToggleSwitch
                    v-model="exportEnabled"
                    label="Export Flights"
                />
            </div>
            <button
                type="button"
                :aria-expanded="choosing === 'export'"
                @click="toggleCalendarChoices('export')"
            >
                <span class="fc-calendar-sync__label">
                    <BaseIcon :src="calendarExportIcon" />
                    Choose Calendar
                </span>
                <span>
                    {{ exportCalendar || "Select" }}&nbsp;
                    <BaseIcon :src="nextIcon" />
                </span>
            </button>
        </div>
        <div
            v-if="choosing"
            class="fc-calendar-sync__choices"
            role="group"
            aria-label="Choose calendar"
        >
            <button
                v-for="calendar in calendars"
                :key="calendar"
                type="button"
                :aria-pressed="
                    choosing === 'import'
                        ? importCalendars.includes(calendar)
                        : exportCalendar === calendar
                "
                @click="selectCalendar(calendar)"
            >
                {{ calendar }}
                <span
                    v-if="
                        choosing === 'import' &&
                        importCalendars.includes(calendar)
                    "
                >
                    ✓
                </span>
            </button>
            <button
                type="button"
                @click="choosing = ''"
            >
                Done
            </button>
        </div>
        <div class="fc-calendar-sync__notice">
            <BaseIcon :src="noticeIcon" />
            &nbsp;
            <span>
                <strong>Flighty receives minimal data</strong>
                <br />
                Calendar processing is on device, and only events identified for
                flight import are sent to Flighty.
            </span>
        </div>
    </div>
</template>
