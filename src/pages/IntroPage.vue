<script setup>
import { ref } from "vue";

import { useRoute, useRouter } from "vue-router";

import BaseInput from "../component/base/BaseInput.vue";

import pageData from "./data/IntroPage.json";

import "../assets/scss/pages/IntroPage.scss";

const airports = pageData.airports;
const route = useRoute();
const router = useRouter();
const normalize = (value) => value.trim().toUpperCase();
const from = ref(
    typeof route.query.from === "string"
        ? normalize(route.query.from).slice(0, 3)
        : pageData.from,
);
const to = ref(
    typeof route.query.to === "string"
        ? normalize(route.query.to).slice(0, 3)
        : pageData.to,
);
const statusMessage = ref("");
const errorMessage = ref("");
const invalidFields = ref([]);

function clearMessages() {
    statusMessage.value = "";
    errorMessage.value = "";
    invalidFields.value = [];
}

function paste(field) {
    const target = field === "from" ? from : to;
    target.value = pageData[field];
    clearMessages();
}

function copy() {
    clearMessages();
    statusMessage.value = pageData.copiedMessage;
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
    router.push({ name: "home", query: { from: start, to: end } });
}
</script>

<template>
    <article class="intro">
        <header class="intro__hero">
            <p class="intro__eyebrow">Vue 3 UI Clone Project</p>
            <h1>
                항공편 사용자 경험을
                <br />
                Vue 3로 재구성했습니다.
            </h1>
            <p class="intro__lead">
                Flighty의 화면을 Vue와 SCSS로 구성한 웹 퍼블리싱 프로젝트입니다.
                각 페이지의 JSON 더미 데이터로 레이아웃과 다양한 UI 상태를
                확인합니다.
            </p>
            <ul
                class="intro__stack"
                aria-label="사용 기술"
            >
                <li>Vue 3</li>
                <li>Vue Router</li>
                <li>Vite</li>
                <li>SCSS</li>
                <li>MapLibre GL</li>
            </ul>
            <dl class="intro__facts">
                <div>
                    <dt>담당 범위</dt>
                    <dd>UI 분석 · 웹 퍼블리싱</dd>
                </div>
                <div>
                    <dt>구현 결과</dt>
                    <dd>
                        항공편, 통계, 설정 화면과 선택·토글·모달 상태 미리보기
                    </dd>
                </div>
            </dl>
            <div class="intro__actions">
                <RouterLink
                    class="intro__action-primary"
                    :to="{
                        name: 'intro',
                        query: route.query,
                        hash: '#interactive-demo',
                    }"
                >
                    데모 실행하기
                </RouterLink>
                <RouterLink to="/component">UI 컴포넌트 보기</RouterLink>
            </div>
            <p class="intro__notice">
                Flighty의 UI를 참고해 학습 목적으로 제작한 비공식 클론이며,
                Flighty와 제휴·승인 관계가 없습니다.
            </p>
        </header>

        <section
            class="intro__highlights"
            aria-labelledby="highlights-title"
        >
            <div class="intro__section-heading">
                <p class="intro__eyebrow">Implementation</p>
                <h2 id="highlights-title">핵심 구현 포인트</h2>
            </div>
            <ul class="intro__cards">
                <li>
                    <strong>검색 상태 연결</strong>
                    <p>
                        페이지별 JSON 더미 데이터로 검색 목록과 빈 결과 화면을
                        확인할 수 있도록 구성했습니다.
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
                        기존 공통 컴포넌트를 재사용하고 선택, 완료, 변형 상태를
                        화면에서 확인할 수 있도록 구성했습니다.
                    </p>
                </li>
            </ul>
        </section>

        <section
            id="interactive-demo"
            class="intro__search"
            aria-labelledby="search-title"
        >
            <div class="intro__section-heading">
                <p class="intro__eyebrow">Interactive Demo</p>
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
                    <button
                        type="button"
                        @click="paste('from')"
                    >
                        붙여넣기
                    </button>
                    <button
                        type="button"
                        @click="copy(from)"
                    >
                        복사
                    </button>
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
                    <button
                        type="button"
                        @click="paste('to')"
                    >
                        붙여넣기
                    </button>
                    <button
                        type="button"
                        @click="copy(to)"
                    >
                        복사
                    </button>
                </div>

                <button
                    class="primary"
                    type="submit"
                >
                    항로 지도 보기
                </button>
            </form>
            <p
                id="airport-help"
                class="hint"
            >
                사용 가능한 공항 코드: {{ Object.keys(airports).join(", ") }}
            </p>
            <p
                v-if="statusMessage"
                class="message"
                role="status"
            >
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
