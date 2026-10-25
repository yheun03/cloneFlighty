<template>
    <section class="frame-page settings-page">
        <RouterLink class="frame-page__close" :to="{ name: 'home', query: route.query }"
            :aria-label="$t('Close settings')">
            ×
        </RouterLink>
        <FcSettingsMenu v-bind="pageData" @select="selectSetting" />
        <section class="settings-page__appearance" aria-labelledby="appearance-title">
            <h2 id="appearance-title">{{ $t("Appearance") }}</h2>
            <p class="frame-page__note">
                {{ $t("Choose how Flighty looks.") }}
            </p>
            <BaseTabItem v-model="appearance" class="settings-page__theme-options" :label="$t('색상 모드')"
                :items="pageData.appearance" />
        </section>
        <section class="settings-page__sources" aria-labelledby="data-sources-title">
            <h2 id="data-sources-title">{{ $t("Data sources") }}</h2>
            <p>
                {{ $t("Airport data") }}:
                <a href="https://github.com/aashishvanand/airport-data-js" target="_blank" rel="noopener noreferrer">
                    airport-data-js
                </a>
                ·
                <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">
                    CC BY 4.0
                </a>
            </p>
            <p>
                {{ $t("Airline data") }}:
                <a href="https://openflights.org/data.php" target="_blank" rel="noopener noreferrer">
                    OpenFlights
                </a>
                (
                <a href="https://github.com/npow/airline-codes" target="_blank" rel="noopener noreferrer">
                    airline-codes
                </a>
                ) ·
                <a href="https://opendatacommons.org/licenses/odbl/1-0/" target="_blank" rel="noopener noreferrer">
                    ODbL
                </a>
            </p>
        </section>
        <p v-if="message" class="frame-page__note" role="status">
            {{ $t(message) }}
        </p>
    </section>
</template>

<script setup>
import { computed, inject, ref } from "vue";

import { useRoute, useRouter } from "vue-router";

import FcSettingsMenu from "../component/fc/FcSettingsMenu.vue";
import BaseTabItem from "../component/base/BaseTabItem.vue";
import pageData from "../data/pages/settings.json";

import "../assets/scss/component/base/BaseIcon.scss";
import "../assets/scss/component/base/BaseTabItem.scss";
import "../assets/scss/component/fc/FcSettingsMenu.scss";
import "../assets/scss/pages/page_settings.scss";

const route = useRoute();
const router = useRouter();
const message = ref("");
const { theme, setTheme } = inject("appearance");
const appearance = computed({
    get: () => (theme.value === "light" ? "Light" : "Dark"),
    set: (value) => setTheme(value.toLowerCase()),
});

function selectSetting(item) {
    if (item === "pro") {
        message.value = pageData.membershipMessage;
        return;
    }
    router.push({ name: item.name, query: route.query });
}
</script>
