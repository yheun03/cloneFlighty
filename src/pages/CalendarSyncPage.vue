<template>
    <section class="frame-page calendar-sync-page">
        <h1 class="frame-page__title">Calendar Sync</h1>
        <FcCalendarSync
            :calendars="pageData.calendars"
            :settings="pageData"
        />
    </section>
</template>

<script setup>
import FcCalendarSync from "../component/fc/FcCalendarSync.vue";

import "../assets/scss/component/base/BaseIcon.scss";
import "../assets/scss/component/base/BaseToggleSwitch.scss";
import "../assets/scss/component/fc/FcCalendarSync.scss";
import "../assets/scss/pages/page_calendar_sync.scss";

// 이 페이지에서 사용하는 예제 JSON 데이터입니다.
// prettier-ignore
const pageData = {
    "calendars": ["Personal", "Work", "Flighty"],
    "importEnabled": false,
    "exportEnabled": false,
    "importCalendars": [],
    "exportCalendar": ""
};
</script>
