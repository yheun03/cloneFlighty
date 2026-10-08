<template>
    <section class="frame-page language-page">
        <h1 class="frame-page__title">Language</h1>
        <p class="frame-page__lead">
            Choose the language used in Flighty.
            <br />
            Your flight details, notifications, and settings will be displayed
            in the selected language.
        </p>
        <h2 class="frame-page__label">ALERTS</h2>
        <div
            role="group"
            aria-label="Language"
        >
            <FcListRow
                v-for="language in pageData.languages"
                :key="language.id"
                v-bind="language"
                :accent="selected === language.id"
                :aria-pressed="selected === language.id"
                @click="selected = language.id"
            />
        </div>
        <h2 class="frame-page__label language-page__device">Device Language</h2>
        <FcListRow
            v-bind="pageData.device"
            :accent="selected === 'device'"
            :aria-pressed="selected === 'device'"
            @click="selected = 'device'"
        />
        <p
            class="sr-only"
            role="status"
        >
            Selected language: {{ selected }}
        </p>
    </section>
</template>

<script setup>
import { ref } from "vue";

import FcListRow from "../component/fc/FcListRow.vue";

import "../assets/scss/component/fc/FcIcon.scss";
import "../assets/scss/component/fc/FcListRow.scss";
import "../assets/scss/pages/LanguagePage.scss";

// 이 페이지에서 사용하는 예제 JSON 데이터입니다.
// prettier-ignore
const pageData = {
    "selected": "device",
    "languages": [
        {
            "id": "ko",
            "title": "한국어",
            "subtitle": "Korean",
            "avatar": "🇰🇷"
        },
        {
            "id": "en",
            "title": "English",
            "subtitle": "English",
            "avatar": "🇬🇧"
        },
        {
            "id": "ja",
            "title": "Japanese",
            "subtitle": "日本語",
            "avatar": "🇯🇵"
        }
    ],
    "device": {
        "id": "device",
        "title": "Use Device Language",
        "subtitle": "Follow your device language settings.",
        "avatar": "⚙"
    }
};

const selected = ref(pageData.selected);
</script>
