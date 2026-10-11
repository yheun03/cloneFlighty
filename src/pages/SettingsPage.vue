<template>
    <section class="frame-page settings-page">
        <RouterLink class="frame-page__close" :to="{ name: 'home', query: route.query }" aria-label="Close settings">
            ×
        </RouterLink>
        <h1 class="frame-page__title">Settings</h1>
        <FcListRow class="settings-page__pro" :title="pageData.membership.title" :subtitle="pageData.membership.status"
            avatar="PRO" shape="double" type="profile" @click="selectSetting('pro')" />
        <section v-for="group in pageData.groups" :key="group.label" class="settings-page__group"
            :aria-labelledby="`settings-${group.label.toLowerCase()}`">
            <h2 :id="`settings-${group.label.toLowerCase()}`" class="frame-page__label">
                {{ group.label }}
            </h2>
            <FcListRow v-for="item in group.items" :key="item.name" :title="item.title" :icon="item.icon" shape="single"
                type="icon" @click="selectSetting(item)" />
        </section>
        <section class="settings-page__appearance" aria-labelledby="appearance-title">
            <h2 id="appearance-title">Appearance</h2>
            <p class="frame-page__note">Choose how Flighty looks.</p>
            <FcTabItem v-model="appearance" class="settings-page__theme-options" label="색상 모드"
                :items="pageData.appearance" />
        </section>
        <p v-if="message" class="frame-page__note" role="status">
            {{ message }}
        </p>
    </section>
</template>

<script setup>
import { computed, inject, ref } from "vue";

import { useRoute, useRouter } from "vue-router";

import FcListRow from "../component/fc/FcListRow.vue";
import FcTabItem from "../component/fc/FcTabItem.vue";

import "../assets/scss/component/fc/FcIcon.scss";
import "../assets/scss/component/fc/FcListRow.scss";
import "../assets/scss/component/fc/FcTabItem.scss";
import "../assets/scss/pages/SettingsPage.scss";

// 이 페이지에서 사용하는 예제 JSON 데이터입니다.
// prettier-ignore
const pageData = {
    "groups": [
        {
            "label": "ALERTS",
            "items": [
                {
                    "icon": "plane",
                    "title": "My Flights",
                    "name": "my-flight-alerts"
                },
                {
                    "icon": "users",
                    "title": "Friends’ Flights",
                    "name": "friends-flight-alerts"
                }
            ]
        },
        {
            "label": "AUTOMATIONS",
            "items": [
                {
                    "icon": "calendar-days",
                    "title": "Calendar Sync",
                    "name": "calendar-sync"
                }
            ]
        },
        {
            "label": "CUSTOMIZE",
            "items": [
                {
                    "icon": "earth",
                    "title": "Language",
                    "name": "language"
                },
                {
                    "icon": "settings",
                    "title": "Unit",
                    "name": "units"
                }
            ]
        }
    ],
    "membership": {
        "title": "Flighty Pro",
        "status": "Member"
    },
    "appearance": ["Dark", "Light"],
    "membershipMessage": "Flighty Pro · Member"
};

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
