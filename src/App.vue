<template>
    <main class="app" :class="{ 'app--dark': $route.name === 'component', 'app--map': $route.name === 'map' }">
        <header>
            <strong>Flighty</strong>
            <nav>
                <RouterLink to="/">입력</RouterLink>
                <RouterLink to="/map">지도</RouterLink>
                <RouterLink to="/component">컴포넌트</RouterLink>
            </nav>
        </header>
        <RouterView />
    </main>
</template>
