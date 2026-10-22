<script setup>
import { provide, readonly, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { locale, t } from "./common/preferences.js";

const route = useRoute();
watchEffect(() => {
    document.documentElement.lang = locale.value;
    const title = String(route.meta.title || "Flighty").split(" | ")[0];
    document.title = `${t(title)} | Flighty`;
});

// 테마는 현재 퍼블리싱 미리보기에서만 변경합니다.
const theme = ref("dark");

function setTheme(value) {
    if (value === "dark" || value === "light") theme.value = value;
}

provide("appearance", { theme: readonly(theme), setTheme });

function focusMainContent() {
    document.getElementById("main-content")?.focus();
}
</script>

<template>
    <div
        class="app"
        :data-theme="theme"
        :class="{
            'app--map': $route.meta.layout === 'map',
        }"
    >
        <a
            class="skip-link"
            href="#main-content"
            @click.prevent="focusMainContent"
        >
            {{ $t("본문 바로가기") }}
        </a>
        <header
            v-if="$route.name === 'intro'"
            class="app__header"
        >
            <div class="app__identity">
                <RouterLink
                    class="app__brand"
                    to="/"
                >
                    {{ $t("Flighty UI Clone") }}
                </RouterLink>
                <span>{{ $t("비공식 개인 포트폴리오") }}</span>
            </div>
            <nav :aria-label="$t('주요 메뉴')">
                <RouterLink to="/intro">{{ $t("프로젝트 소개") }}</RouterLink>
                <RouterLink to="/home">{{ $t("내 항공편") }}</RouterLink>
                <RouterLink to="/component">{{ $t("UI 컴포넌트") }}</RouterLink>
            </nav>
        </header>
        <main
            v-if="$route.name === 'intro'"
            id="main-content"
            class="app__main"
            tabindex="-1"
        >
            <RouterView />
        </main>
        <RouterView v-else />
    </div>
</template>
