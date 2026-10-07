<script setup>
function focusMainContent() {
    document.getElementById("main-content")?.focus();
}
</script>

<template>
    <div
        class="app"
        :class="{
            'app--map': $route.meta.layout === 'map',
        }"
    >
        <a
            class="skip-link"
            href="#main-content"
            @click.prevent="focusMainContent"
            >본문 바로가기</a
        >
        <header v-if="$route.name === 'intro'" class="app__header">
            <div class="app__identity">
                <RouterLink class="app__brand" to="/"
                    >Flighty UI Clone</RouterLink
                >
                <span>비공식 개인 포트폴리오</span>
            </div>
            <nav aria-label="주요 메뉴">
                <RouterLink to="/intro">프로젝트 소개</RouterLink>
                <RouterLink to="/home">내 항공편</RouterLink>
                <RouterLink to="/component">UI 컴포넌트</RouterLink>
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
