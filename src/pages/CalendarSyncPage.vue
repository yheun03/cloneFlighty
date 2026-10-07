<script setup>
import FcCalendarSync from "../component/fc/FcCalendarSync.vue";
import pageData from "./data/CalendarSyncPage.json";
</script>

<template>
    <section class="frame-page calendar-sync-page">
        <h1 class="frame-page__title">Calendar Sync</h1>
        <FcCalendarSync :calendars="pageData.calendars" :settings="pageData" />
    </section>
</template>
