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
            <BaseListRow
                v-for="language in pageData.languages"
                :key="language.id"
                v-bind="language"
                :accent="selected === language.id"
                :aria-pressed="selected === language.id"
                @click="selected = language.id"
            />
        </div>
        <h2 class="frame-page__label language-page__device">Device Language</h2>
        <BaseListRow
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

import BaseListRow from "../component/base/BaseListRow.vue";
import koreanFlag from "../assets/figma/flag-ko.svg";
import englishFlag from "../assets/figma/flag-en.svg";
import japaneseFlag from "../assets/figma/flag-ja.svg";
import deviceIcon from "../assets/figma/language-device.svg";

import "../assets/scss/component/base/BaseIcon.scss";
import "../assets/scss/component/base/BaseListRow.scss";
import "../assets/scss/pages/page_language.scss";

// 이 페이지에서 사용하는 예제 JSON 데이터입니다.
// prettier-ignore
const pageData = {
    "selected": "device",
    "languages": [
        {
            "id": "ko",
            "title": "한국어",
            "subtitle": "Korean",
            "image": koreanFlag
        },
        {
            "id": "en",
            "title": "English",
            "subtitle": "English",
            "image": englishFlag
        },
        {
            "id": "ja",
            "title": "Japanese",
            "subtitle": "日本語",
            "image": japaneseFlag
        }
    ],
    "device": {
        "id": "device",
        "title": "Use Device Language",
        "subtitle": "Follow your device language settings.",
        "icon": deviceIcon
    }
};

const selected = ref(pageData.selected);
</script>
