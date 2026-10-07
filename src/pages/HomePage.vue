<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseInput from "../component/BaseInput.vue";

const airports = JSON.parse(document.querySelector("#airports").textContent);
const route = useRoute();
const router = useRouter();
const normalize = (value) => value.trim().toUpperCase();
const from = ref(
    typeof route.query.from === "string"
        ? normalize(route.query.from).slice(0, 3)
        : "ICN",
);
const to = ref(
    typeof route.query.to === "string"
        ? normalize(route.query.to).slice(0, 3)
        : "SFO",
);
const statusMessage = ref("");
const errorMessage = ref("");
const invalidFields = ref([]);

function clearMessages() {
    statusMessage.value = "";
    errorMessage.value = "";
    invalidFields.value = [];
}

async function paste(field) {
    try {
        const target = field === "from" ? from : to;
        target.value = normalize(await navigator.clipboard.readText()).slice(
            0,
            3,
        );
        clearMessages();
    } catch {
        statusMessage.value = "";
        invalidFields.value = [];
        errorMessage.value = "클립보드를 읽을 수 없습니다.";
    }
}

async function copy(value) {
    try {
        await navigator.clipboard.writeText(normalize(value));
        errorMessage.value = "";
        invalidFields.value = [];
        statusMessage.value = "공항 코드를 복사했습니다.";
    } catch {
        statusMessage.value = "";
        invalidFields.value = [];
        errorMessage.value = "클립보드에 복사할 수 없습니다.";
    }
}

function showMap() {
    const start = normalize(from.value);
    const end = normalize(to.value);
    if (!airports[start] || !airports[end]) {
        statusMessage.value = "";
        invalidFields.value = [
            !airports[start] && "from",
            !airports[end] && "to",
        ].filter(Boolean);
        errorMessage.value =
            invalidFields.value.length === 2
                ? "등록된 출발·도착 공항 코드를 입력해 주세요."
                : `등록된 ${invalidFields.value[0] === "from" ? "출발" : "도착"} 공항 코드를 입력해 주세요.`;
        document.getElementById(invalidFields.value[0])?.focus();
        return;
    }
    clearMessages();
    router.push({ name: "map", query: { from: start, to: end } });
}
</script>

<template>
    <article class="home">
        <header class="home__hero">
            <p class="home__eyebrow">Vue 3 UI Clone Project</p>
            <h1>항공편 사용자 경험을<br />Vue 3로 재구성했습니다.</h1>
            <p class="home__lead">
                Flighty의 정보 구조와 인터랙션을 분석해 공항 검색, 항로 시각화,
                상태 기반 UI 컴포넌트로 구현한 개인 프로젝트입니다.
            </p>
            <ul class="home__stack" aria-label="사용 기술">
                <li>Vue 3</li>
                <li>Vue Router</li>
                <li>Vite</li>
                <li>SCSS</li>
                <li>MapLibre GL</li>
            </ul>
            <dl class="home__facts">
                <div>
                    <dt>담당 범위</dt>
                    <dd>UI 분석 · 웹 퍼블리싱 · Vue 프론트엔드 구현</dd>
                </div>
                <div>
                    <dt>구현 결과</dt>
                    <dd>
                        검색부터 지도, 재사용 컴포넌트까지 이어지는 인터랙티브
                        데모
                    </dd>
                </div>
            </dl>
            <div class="home__actions">
                <a class="home__action-primary" href="#interactive-demo"
                    >데모 실행하기</a
                >
                <RouterLink to="/component">UI 컴포넌트 보기</RouterLink>
            </div>
            <p class="home__notice">
                Flighty의 UI를 참고해 학습 목적으로 제작한 비공식 클론이며,
                Flighty와 제휴·승인 관계가 없습니다.
            </p>
        </header>

        <section class="home__highlights" aria-labelledby="highlights-title">
            <div class="home__section-heading">
                <p class="home__eyebrow">Implementation</p>
                <h2 id="highlights-title">핵심 구현 포인트</h2>
            </div>
            <ul class="home__cards">
                <li>
                    <strong>검색 상태 연결</strong>
                    <p>
                        공항 코드를 정규화·검증하고 URL 쿼리로 전달해 검색과
                        지도 화면의 상태를 연결했습니다.
                    </p>
                </li>
                <li>
                    <strong>항로 시각화</strong>
                    <p>
                        두 공항의 좌표를 보간하고 경도를 보정해 장거리 항로를
                        지도 위에 자연스럽게 표현했습니다.
                    </p>
                </li>
                <li>
                    <strong>재사용 UI 설계</strong>
                    <p>
                        선택, 완료, 변형 상태를 props와 v-model로 제어하는
                        항공편 UI 컴포넌트를 구성했습니다.
                    </p>
                </li>
            </ul>
        </section>

        <section
            id="interactive-demo"
            class="home__search"
            aria-labelledby="search-title"
        >
            <div class="home__section-heading">
                <p class="home__eyebrow">Interactive Demo</p>
                <h2 id="search-title">공항 코드로 경로 찾기</h2>
                <p>
                    출발지와 도착지의 IATA 코드를 입력해 지도에서 항로를 확인해
                    보세요.
                </p>
            </div>

            <form @submit.prevent="showMap">
                <label for="from">출발 공항</label>
                <div class="field">
                    <BaseInput
                        id="from"
                        v-model="from"
                        maxlength="3"
                        placeholder="ICN"
                        autocomplete="off"
                        autocapitalize="characters"
                        spellcheck="false"
                        :aria-invalid="invalidFields.includes('from')"
                        :aria-describedby="
                            invalidFields.includes('from')
                                ? 'route-error airport-help'
                                : 'airport-help'
                        "
                        @input="clearMessages"
                    />
                    <button type="button" @click="paste('from')">
                        붙여넣기
                    </button>
                    <button type="button" @click="copy(from)">복사</button>
                </div>

                <label for="to">도착 공항</label>
                <div class="field">
                    <BaseInput
                        id="to"
                        v-model="to"
                        maxlength="3"
                        placeholder="SFO"
                        autocomplete="off"
                        autocapitalize="characters"
                        spellcheck="false"
                        :aria-invalid="invalidFields.includes('to')"
                        :aria-describedby="
                            invalidFields.includes('to')
                                ? 'route-error airport-help'
                                : 'airport-help'
                        "
                        @input="clearMessages"
                    />
                    <button type="button" @click="paste('to')">붙여넣기</button>
                    <button type="button" @click="copy(to)">복사</button>
                </div>

                <button class="primary" type="submit">항로 지도 보기</button>
            </form>
            <p id="airport-help" class="hint">
                사용 가능한 공항 코드: {{ Object.keys(airports).join(", ") }}
            </p>
            <p v-if="statusMessage" class="message" role="status">
                {{ statusMessage }}
            </p>
            <p
                v-if="errorMessage"
                id="route-error"
                class="message is-error"
                role="alert"
            >
                {{ errorMessage }}
            </p>
        </section>
    </article>
</template>
