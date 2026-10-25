<template>
    <section class="frame-page calendar-sync-page">
        <h1 class="frame-page__title">{{ $t("Calendar Sync") }}</h1>
        <FcCalendarSync :calendars="pageData.calendars" :settings="pageData" />
    </section>
</template>

<script setup>
import FcCalendarSync from "../component/fc/FcCalendarSync.vue";
import pageData from "../data/pages/calendar-sync.json";

import "../assets/scss/component/base/BaseIcon.scss";
import "../assets/scss/component/base/BaseToggleSwitch.scss";
import "../assets/scss/component/fc/FcCalendarSync.scss";
import "../assets/scss/pages/page_calendar_sync.scss";

</script>
