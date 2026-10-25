<template>
    <section class="frame-page language-page">
        <h1 class="frame-page__title">{{ $t("Language") }}</h1>
        <p class="frame-page__lead">
            {{ $t("Choose the language used in Flighty.") }}
            <br />
            {{
                $t(
                    "Your flight details, notifications, and settings will be displayed in the selected language.",
                )
            }}
        </p>
        <h2 class="frame-page__label">{{ $t("Languages") }}</h2>
        <div role="group" :aria-label="$t('Language')">
            <BaseListRow v-for="language in pageData.languages" :key="language.id" v-bind="language"
                :translate-subtitle="false" :accent="selected === language.id" :aria-pressed="selected === language.id"
                @click="selected = language.id" />
        </div>
        <h2 class="frame-page__label language-page__device">
            {{ $t("Device Language") }}
        </h2>
        <BaseListRow v-bind="pageData.device" :accent="selected === 'device'" :aria-pressed="selected === 'device'"
            @click="selected = 'device'" />
        <p class="sr-only" role="status">
            {{ $t("Selected language:") }}
            {{
                $t(
                    pageData.languages.find((item) => item.id === selected)
                        ?.subtitle || "Device Language",
                )
            }}
        </p>
    </section>
</template>

<script setup>
import { computed } from "vue";
import { preferences } from "../common/preferences.js";

import BaseListRow from "../component/base/BaseListRow.vue";
import koreanFlag from "../assets/figma/flag-ko.svg";
import englishFlag from "../assets/figma/flag-en.svg";
import japaneseFlag from "../assets/figma/flag-ja.svg";
import deviceIcon from "../assets/figma/language-device.svg";
import pageContent from "../data/pages/language.json";

import "../assets/scss/component/base/BaseIcon.scss";
import "../assets/scss/component/base/BaseListRow.scss";
import "../assets/scss/pages/page_language.scss";

const imageAssets = { ko: koreanFlag, en: englishFlag, ja: japaneseFlag };
const pageData = {
    ...pageContent,
    languages: pageContent.languages.map((item) => ({
        ...item,
        image: imageAssets[item.image],
    })),
    device: { ...pageContent.device, icon: deviceIcon },
};

const selected = computed({
    get: () => preferences.language,
    set: (value) => {
        preferences.language = value;
    },
});
</script>
