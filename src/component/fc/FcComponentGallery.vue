<script setup>
import "../../assets/scss/FcGalleryBundle.scss";
import shareIcon from "../../assets/icons/lucide/share-2.svg";
import chipIcon from "../../assets/icons/lucide/square.svg";
import { ref } from "vue";
import BaseButton from "../base/BaseButton.vue";
import FcToggleSwitch from "./FcToggleSwitch.vue";
import FcChoiceChip from "./FcChoiceChip.vue";
import FcPeriodTabs from "./FcPeriodTabs.vue";
import FcCountBadge from "./FcCountBadge.vue";
import FcCalendarPicker from "./FcCalendarPicker.vue";
import FcListRow from "./FcListRow.vue";
import FcPasteField from "./FcPasteField.vue";
import FcConnectionStatus from "./FcConnectionStatus.vue";
import FcTerminalTimeline from "./FcTerminalTimeline.vue";
import FcFlightListItem from "./FcFlightListItem.vue";
import FcAddFlightSearch from "./FcAddFlightSearch.vue";
import FcFlightDetails from "./FcFlightDetails.vue";
import FcPassportOverview from "./FcPassportOverview.vue";
import FcDelayReport from "./FcDelayReport.vue";
import FcAircraftStats from "./FcAircraftStats.vue";
import FcAlertSettings from "./FcAlertSettings.vue";
import FcCalendarSync from "./FcCalendarSync.vue";
import FcSettingsMenu from "./FcSettingsMenu.vue";
import FcAirlinePerformance from "./FcAirlinePerformance.vue";
import FcSeatStats from "./FcSeatStats.vue";
import FcFrequentTails from "./FcFrequentTails.vue";
import FcCountriesStats from "./FcCountriesStats.vue";
import FcTopAirlines from "./FcTopAirlines.vue";
import FcFlightDistanceStats from "./FcFlightDistanceStats.vue";

const props = defineProps({ data: { type: Object, required: true } });
const enabled = ref(props.data.enabled);
const seat = ref(props.data.seat);
const period = ref(props.data.period);
const day = ref(props.data.day);
const reason = ref(props.data.reason);
const completed = ref(props.data.completed);
</script>

<template>
    <article class="fc-gallery">
        <header class="fc-gallery__intro">
            <p class="fc-gallery__eyebrow">Reusable UI System</p>
            <h1>항공편 경험을 구성하는<br />Vue 3 컴포넌트</h1>
            <p>
                복잡한 항공 정보를 빠르게 파악할 수 있도록 표시 우선순위를
                나누고, 상태와 variant를 외부에서 제어할 수 있게 구성했습니다.
                아래 예시에서 주요 상태를 직접 변경해 볼 수 있습니다.
            </p>
            <ul class="fc-gallery__meta" aria-label="컴포넌트 설계 특징">
                <li>Composition API</li>
                <li>Props 기반 variant</li>
                <li>v-model 상태 연결</li>
                <li>SCSS 컴포넌트 스타일</li>
            </ul>
        </header>

        <section class="fc-gallery__group" aria-labelledby="gallery-actions">
            <h2 id="gallery-actions">재사용 액션 버튼</h2>
            <p class="fc-gallery__description">
                강조 수준에 따라 variant를 나눈 공통 버튼입니다.
            </p>
            <div class="fc-gallery__row">
                <BaseButton label="Share" :icon="shareIcon" variant="outline" />
                <BaseButton />
                <BaseButton variant="soft" />
            </div>
        </section>
        <section class="fc-gallery__group" aria-labelledby="gallery-selection">
            <h2 id="gallery-selection">상태 선택 인터랙션</h2>
            <p class="fc-gallery__description">
                토글과 선택 칩의 활성·비활성 상태를 독립적으로 제어합니다.
            </p>
            <div class="fc-gallery__row">
                <FcToggleSwitch v-model="enabled" label="알림" />
                <FcToggleSwitch
                    :model-value="false"
                    label="비활성 상태"
                    disabled
                />
                <FcChoiceChip label="Middle" :icon="chipIcon" />
                <FcChoiceChip label="Middle" :icon="chipIcon" active filled />
            </div>
        </section>
        <section class="fc-gallery__group" aria-labelledby="gallery-filter">
            <h2 id="gallery-filter">기간 필터와 상태 배지</h2>
            <p class="fc-gallery__description">
                조회 기간 전환과 수량 표시를 작은 단위의 컴포넌트로 나눈습니다.
            </p>
            <FcPeriodTabs v-model="period" :items="data.periods" />
            <div class="fc-gallery__row">
                <FcCountBadge />
                <FcCountBadge variant="filled" />
                <FcCountBadge variant="outline" />
            </div>
        </section>
        <section class="fc-gallery__group" aria-labelledby="gallery-calendar">
            <h2 id="gallery-calendar">날짜 선택</h2>
            <p class="fc-gallery__description">
                선택한 날짜를 v-model로 연결한 달력 UI입니다.
            </p>
            <FcCalendarPicker v-model="day" v-bind="data.calendar" />
        </section>
        <section class="fc-gallery__group" aria-labelledby="gallery-preference">
            <h2 id="gallery-preference">사용자와 좌석 선호 설정</h2>
            <p class="fc-gallery__description">
                사용자 초대, 메모 입력, 좌석 선호 선택을 하나의 흐름으로
                구성했습니다.
            </p>
            <FcListRow :title="data.friend.title" />
            <FcListRow title="Invite a Friend" accent />
            <FcPasteField v-model="reason" :sample-value="data.bookingCode" />
            <div class="fc-gallery__row">
                <FcChoiceChip
                    v-for="item in data.positions"
                    :key="item"
                    :label="item"
                    :icon="chipIcon"
                    :active="seat === item"
                    @click="seat = item"
                />
            </div>
        </section>
        <section class="fc-gallery__group" aria-labelledby="gallery-connection">
            <h2 id="gallery-connection">연결편 상태와 타임라인</h2>
            <p class="fc-gallery__description">
                연결 가능 여부와 터미널 이동 과정을 시간 순서로 표현했습니다.
            </p>
            <FcConnectionStatus v-bind="data.connection" />
            <FcTerminalTimeline v-bind="data.timeline" />
        </section>
        <section
            class="fc-gallery__group"
            aria-labelledby="gallery-flight-list"
        >
            <h2 id="gallery-flight-list">항공편 목록 패턴</h2>
            <p class="fc-gallery__description">
                기본, 이력, 헤더 형태를 하나의 컴포넌트에서 variant로
                구분했습니다.
            </p>
            <FcFlightListItem v-bind="data.flight" />
            <FcFlightListItem v-bind="data.flight" variant="history" />
            <FcFlightListItem v-bind="data.flight" variant="header" />
        </section>
        <section class="fc-gallery__group" aria-labelledby="gallery-search">
            <h2 id="gallery-search">항공편 검색</h2>
            <p class="fc-gallery__description">
                항공편 추가 과정에 필요한 검색과 입력 상태를 구성했습니다.
            </p>
            <FcAddFlightSearch v-bind="data.search" />
        </section>
        <section class="fc-gallery__group" aria-labelledby="gallery-details">
            <h2 id="gallery-details">항공편 상세와 운항 일정</h2>
            <p class="fc-gallery__description">
                시간, 터미널, 지연 예측, 기종 정보를 하나의 정보 구조로
                정리했습니다.
            </p>
            <div class="fc-gallery__row fc-gallery__state-preview">
                <FcToggleSwitch v-model="completed" label="비행 종료" />
            </div>
            <FcFlightDetails :details="data.details" :completed="completed" />
        </section>
        <section class="fc-gallery__group" aria-labelledby="gallery-passport">
            <h2 id="gallery-passport">여행 기록 요약</h2>
            <p class="fc-gallery__description">
                누적 항공편, 거리, 시간, 이용 공항을 패스포트 형태로
                요약했습니다.
            </p>
            <FcPassportOverview v-bind="data.overview" />
        </section>
        <section class="fc-gallery__group" aria-labelledby="gallery-delay">
            <h2 id="gallery-delay">지연 데이터 리포트</h2>
            <p class="fc-gallery__description">
                지연 비율과 누적 시간을 비교해 운항 경험을 빠르게 파악할 수 있게
                표현했습니다.
            </p>
            <FcDelayReport v-bind="data.delayReport" />
        </section>
        <section class="fc-gallery__group" aria-labelledby="gallery-aircraft">
            <h2 id="gallery-aircraft">항공기 정보</h2>
            <p class="fc-gallery__description">
                기종별 이용 통계와 자주 탑승한 항공기 이력을 카드로
                나누었습니다.
            </p>
            <FcAircraftStats :aircraft="data.aircraft" />
            <FcFrequentTails v-bind="data.tails" />
        </section>
        <section class="fc-gallery__group" aria-labelledby="gallery-alerts">
            <h2 id="gallery-alerts">알림 정책 설정</h2>
            <p class="fc-gallery__description">
                본인과 친구의 항공편에 필요한 알림 범위를 서로 다른 상태로
                구성했습니다.
            </p>
            <FcAlertSettings
                title="My Flight Alerts"
                desc="Pick the notification types you receive for your flights."
                :options="data.myAlertOptions"
                :initial-shared="data.alerts.shared"
                :initial-selected="data.alerts.selected"
            />
            <FcAlertSettings
                mode="friend"
                title="Customize Alerts"
                desc="Customize this per friend in Flighty Friends."
                :options="data.friendAlertOptions"
                v-bind="data.friend"
                :initial-shared="data.alerts.shared"
                :initial-selected="data.alerts.selected"
            />
        </section>
        <section class="fc-gallery__group" aria-labelledby="gallery-settings">
            <h2 id="gallery-settings">캘린더 연동과 설정</h2>
            <p class="fc-gallery__description">
                외부 캘린더 연동 상태와 계정 설정 목록을 일관된 행 패턴으로
                표현했습니다.
            </p>
            <FcCalendarSync
                :calendars="data.calendarSync.calendars"
                :settings="data.calendarSync"
            />
            <FcSettingsMenu v-bind="data.settings" />
        </section>
        <section
            class="fc-gallery__group"
            aria-labelledby="gallery-performance"
        >
            <h2 id="gallery-performance">항공사 운항 성과</h2>
            <p class="fc-gallery__description">
                항공사별 운항 기록과 정시성 지표를 비교할 수 있게 구성했습니다.
            </p>
            <FcAirlinePerformance :report="data.performance" />
        </section>
        <section class="fc-gallery__group" aria-labelledby="gallery-seats">
            <h2 id="gallery-seats">좌석 이용 통계</h2>
            <p class="fc-gallery__description">
                좌석 위치와 등급별 이용 기록을 각각의 통계 상태로 표현했습니다.
            </p>
            <FcSeatStats v-bind="data.seats.seat" />
            <FcSeatStats v-bind="data.seats.class" />
        </section>
        <section class="fc-gallery__group" aria-labelledby="gallery-statistics">
            <h2 id="gallery-statistics">여행 데이터 시각화</h2>
            <p class="fc-gallery__description">
                방문 국가, 주요 항공사, 비행 거리를 카드와 비교 지표로
                구성했습니다.
            </p>
            <FcCountriesStats v-bind="data.countries" />
            <FcTopAirlines v-bind="data.airlines" />
            <FcFlightDistanceStats v-bind="data.distance" />
        </section>
    </article>
</template>
