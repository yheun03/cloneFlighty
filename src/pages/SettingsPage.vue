<script setup>
import { computed, inject, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import FcSettingsMenu from "../component/fc/FcSettingsMenu.vue";
import FcPeriodTabs from "../component/fc/FcPeriodTabs.vue";
import pageData from "./data/SettingsPage.json";

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

<template>
    <section class="frame-page settings-page">
        <RouterLink
            class="frame-page__close"
            :to="{ name: 'home', query: route.query }"
            aria-label="Close settings"
            >×</RouterLink
        >
        <FcSettingsMenu v-bind="pageData" @select="selectSetting" />
        <section
            class="settings-page__appearance"
            aria-labelledby="appearance-title"
        >
            <h2 id="appearance-title">Appearance</h2>
            <p class="frame-page__note">Choose how Flighty looks.</p>
            <FcPeriodTabs
                v-model="appearance"
                class="settings-page__theme-options"
                label="색상 모드"
                :items="pageData.appearance"
            />
        </section>
        <p v-if="message" class="frame-page__note" role="status">
            {{ message }}
        </p>
    </section>
</template>
