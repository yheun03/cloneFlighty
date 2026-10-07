<template>
    <div
        class="app"
        :class="{
            'app--dark': $route.name === 'component',
            'app--map': $route.name === 'map',
        }"
    >
        <a class="skip-link" href="#main-content">본문 바로가기</a>
        <header class="app__header">
            <div class="app__identity">
                <RouterLink class="app__brand" to="/"
                    >Flighty UI Clone</RouterLink
                >
                <span>비공식 개인 포트폴리오</span>
            </div>
            <nav aria-label="주요 메뉴">
                <RouterLink to="/">항공편 검색</RouterLink>
                <RouterLink to="/map">비행 경로 지도</RouterLink>
                <RouterLink to="/component">UI 컴포넌트</RouterLink>
            </nav>
        </header>
        <main id="main-content" class="app__main" tabindex="-1">
            <RouterView />
        </main>
    </div>
</template>
