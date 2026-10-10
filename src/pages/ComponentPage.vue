<template>
    <article ref="gallery" class="fc-gallery">
        <header class="fc-gallery__intro">
            <div>
                <p class="fc-gallery__eyebrow">COMPONENT GALLERY</p>
                <h1>컴포넌트 모아보기</h1>
                <p class="fc-gallery__description">
                    공통 컴포넌트의 모양과 상태를 한곳에서 확인하세요. 긴 예시는 카드 안에서 스크롤할 수 있습니다.
                </p>
            </div>
            <ul class="fc-gallery__meta" aria-label="갤러리 구성">
                <!-- prettier-ignore -->
                <li><strong>26</strong>개 컴포넌트</li>
                <li>JSON 더미 데이터</li>
                <li>상태 미리보기</li>
            </ul>
        </header>

        <div class="fc-gallery__filters" role="group" aria-label="컴포넌트 분류">
            <button v-for="item in componentData.categories" :key="item.id" type="button"
                :class="{ 'is-active': category === item.id }" :aria-pressed="category === item.id"
                @click="selectCategory(item)">
                {{ item.label }}
                <span>{{ item.count }}</span>
            </button>
        </div>

        <div class="fc-gallery__grid">
            <section v-show="category === 'all' || category === 'basic'" class="fc-gallery__group"
                aria-labelledby="gallery-buttons">
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        BaseButton
                    </p>
                    <h2 id="gallery-buttons">
                        버튼
                    </h2>
                    <p class="fc-gallery__description">
                        사이즈 · 타입 · 톤 · 비활성 상태
                    </p>
                </header>
                <div class="fc-gallery__preview" role="region" aria-labelledby="gallery-buttons" tabindex="0">
                    <template v-for="buttonType in componentData.buttons.types" :key="buttonType.id">
                        <div v-for="size in componentData.buttons.sizes" :key="`${buttonType.id}-${size.id}`">
                            <p class="fc-gallery__sample-label">
                                {{ buttonType.label }} · {{ size.label }}
                            </p>
                            <div class="fc-gallery__row">
                                <BaseButton v-for="tone in componentData.buttons.tones" :key="tone.id"
                                    :label="tone.label" :size="size.id" :variant="buttonType.id" :tone="tone.id" />
                            </div>
                        </div>
                    </template>
                    <p class="fc-gallery__sample-label">
                        상태
                    </p>
                    <div class="fc-gallery__row">
                        <BaseButton label="Share" icon="share-2" size="md" variant="fill" tone="default" />
                        <BaseButton label="Disabled" size="md" variant="fill" tone="default" disabled />
                    </div>
                </div>
            </section>
            <section v-show="category === 'all' || category === 'basic'" class="fc-gallery__group"
                aria-labelledby="gallery-input">
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        BaseInput
                    </p>
                    <h2 id="gallery-input">
                        입력창
                    </h2>
                    <p class="fc-gallery__description">
                        단일 텍스트 · 아이콘 · SM 버튼 조합
                    </p>
                </header>
                <div class="fc-gallery__preview" role="region" aria-labelledby="gallery-input" tabindex="0">
                    <div class="fc-gallery__field">
                        <div v-for="item in componentData.inputs" :key="item.id">
                            <label :for="`gallery-input-${item.id}`">
                                {{ item.label }}
                            </label>
                            <BaseInput :id="`gallery-input-${item.id}`" v-model="inputValues[item.id]"
                                :placeholder="item.placeholder" :icon="item.icon" :action-label="item.actionLabel"
                                @action="applyInputAction(item)" />
                        </div>
                    </div>
                </div>
            </section>
            <section v-show="category === 'all' || category === 'basic'" class="fc-gallery__group"
                aria-labelledby="gallery-icons">
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        FcIcon
                    </p>
                    <h2 id="gallery-icons">
                        아이콘
                    </h2>
                    <p class="fc-gallery__description">
                        항공편과 설정에 사용하는 공통 아이콘
                    </p>
                </header>
                <div class="fc-gallery__preview" role="region" aria-labelledby="gallery-icons" tabindex="0">
                    <div class="fc-gallery__icons">
                        <div v-for="icon in componentData.icons" :key="icon.src">
                            <FcIcon :src="icon.src" />
                            <small>{{ icon.label }}</small>
                        </div>
                    </div>
                </div>
            </section>
            <section v-show="category === 'all' || category === 'basic'" class="fc-gallery__group"
                aria-labelledby="gallery-toggle">
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        FcToggleSwitch
                    </p>
                    <h2 id="gallery-toggle">
                        토글 스위치
                    </h2>
                    <p class="fc-gallery__description">
                        버튼 · 체크박스 · 라디오 · 비활성 상태
                    </p>
                </header>
                <div class="fc-gallery__preview" role="region" aria-labelledby="gallery-toggle" tabindex="0">
                    <div class="fc-gallery__row">
                        <FcToggleSwitch v-model="enabled" label="알림" />
                        <FcToggleSwitch v-model="secondaryEnabled" type="checkbox" label="체크박스" />
                        <FcToggleSwitch v-model="switchRadio" type="radio" value="selected" label="라디오" />
                        <FcToggleSwitch :model-value="false" label="비활성 상태" disabled />
                    </div>
                </div>
            </section>
            <section v-show="category === 'all' || category === 'basic'" class="fc-gallery__group"
                aria-labelledby="gallery-tab-item">
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        FcTabItem
                    </p>
                    <h2 id="gallery-tab-item">
                        탭 아이템
                    </h2>
                    <p class="fc-gallery__description">
                        MD · SM / Fill · Stroke / Tab · Checkbox · Radio
                    </p>
                </header>
                <div class="fc-gallery__preview" role="region" aria-labelledby="gallery-tab-item" tabindex="0">
                    <div v-for="item in componentData.tabItems" :key="item.id">
                        <p class="fc-gallery__sample-label">
                            {{ item.label }}
                        </p>
                        <FcTabItem v-model="tabSelections[item.id]" :items="componentData.positions" :icon="item.icon"
                            :size="item.size" :variant="item.variant" :type="item.type" :label="item.label" />
                    </div>
                </div>
            </section>
            <section v-show="category === 'all' || category === 'basic'" class="fc-gallery__group"
                aria-labelledby="gallery-badges">
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        FcCountBadge
                    </p>
                    <h2 id="gallery-badges">
                        수량 배지
                    </h2>
                    <p class="fc-gallery__description">
                        기본 · 채움 · 테두리 스타일
                    </p>
                </header>
                <div class="fc-gallery__preview" role="region" aria-labelledby="gallery-badges" tabindex="0">
                    <div class="fc-gallery__row">
                        <FcCountBadge :value="1" variant="plain" />
                        <FcCountBadge :value="8" variant="filled" />
                        <FcCountBadge :value="20" variant="outline" />
                    </div>
                </div>
            </section>
            <section v-show="category === 'all' || category === 'basic'" class="fc-gallery__group"
                aria-labelledby="gallery-calendar">
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        FcCalendarPicker
                    </p>
                    <h2 id="gallery-calendar">
                        달력
                    </h2>
                    <p class="fc-gallery__description">
                        선택일과 항공편이 있는 날짜
                    </p>
                </header>
                <div class="fc-gallery__preview" role="region" aria-labelledby="gallery-calendar" tabindex="0">
                    <FcCalendarPicker v-model="day" :year="2026" :month="1" :marked="componentData.calendar.marked" />
                </div>
            </section>
            <section v-show="category === 'all' || category === 'basic'" class="fc-gallery__group"
                aria-labelledby="gallery-rows">
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        FcListRow
                    </p>
                    <h2 id="gallery-rows">
                        목록 행
                    </h2>
                    <p class="fc-gallery__description">
                        사용자 정보와 강조 액션
                    </p>
                </header>
                <div class="fc-gallery__preview" role="region" aria-labelledby="gallery-rows" tabindex="0">
                    <FcListRow title="김민지" subtitle="friend@example.com" avatar="M" />
                    <FcListRow title="Invite a Friend" accent />
                </div>
            </section>
            <section v-show="category === 'all' || category === 'basic'" class="fc-gallery__group"
                aria-labelledby="gallery-paste">
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        FcPasteField
                    </p>
                    <h2 id="gallery-paste">
                        붙여넣기 입력
                    </h2>
                    <p class="fc-gallery__description">
                        버튼을 누르면 예시 예약 코드 입력
                    </p>
                </header>
                <div class="fc-gallery__preview" role="region" aria-labelledby="gallery-paste" tabindex="0">
                    <FcPasteField v-model="reason" label="Booking Code" sample-value="ABC123" />
                </div>
            </section>
            <section v-show="category === 'all' || category === 'flight'" class="fc-gallery__group"
                aria-labelledby="gallery-flights">
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        FcFlightListItem
                    </p>
                    <h2 id="gallery-flights">
                        항공편 목록
                    </h2>
                    <p class="fc-gallery__description">
                        예정 · 지난 항공편 · 상세 헤더
                    </p>
                </header>
                <div class="fc-gallery__preview" role="region" aria-labelledby="gallery-flights" tabindex="0">
                    <div v-for="sample in componentData.flightVariants" :key="sample.variant">
                        <p class="fc-gallery__sample-label">
                            {{ sample.label }}
                        </p>
                        <FcFlightListItem :airline="airlines.KE.iata" flight="24" title="San Francisco to Seoul"
                            date="Sat, 20 Jun" departure="SFO 11:40" arrival="ICN 17:40⁺¹" :days="21" :avatar="false"
                            duration="2h 50m" flight-time="2h 50m" :variant="sample.variant" />
                    </div>
                </div>
            </section>
            <section v-show="category === 'all' || category === 'flight'" class="fc-gallery__group"
                aria-labelledby="gallery-search">
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        FcAddFlightSearch
                    </p>
                    <h2 id="gallery-search">
                        항공편 검색
                    </h2>
                    <p class="fc-gallery__description">
                        검색어에 따른 더미 목록 필터
                    </p>
                </header>
                <div class="fc-gallery__preview" role="region" aria-labelledby="gallery-search" tabindex="0">
                    <FcAddFlightSearch placeholder="Korean Air, ICN, or KE123" :items="componentData.searchItems" />
                </div>
            </section>
            <section v-show="category === 'all' || category === 'flight'" class="fc-gallery__group"
                aria-labelledby="gallery-connection">
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        FcConnectionStatus
                    </p>
                    <h2 id="gallery-connection">
                        연결편 상태
                    </h2>
                    <p class="fc-gallery__description">
                        환승 시간과 여유 시간 안내
                    </p>
                </header>
                <div class="fc-gallery__preview" role="region" aria-labelledby="gallery-connection" tabindex="0">
                    <FcConnectionStatus title="Relaxed Connection" duration="4h 30m" extra="3h 10m" />
                </div>
            </section>
            <section v-show="category === 'all' || category === 'flight'" class="fc-gallery__group"
                aria-labelledby="gallery-timeline">
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        FcTerminalTimeline
                    </p>
                    <h2 id="gallery-timeline">
                        터미널 타임라인
                    </h2>
                    <p class="fc-gallery__description">
                        도착 · 터미널 이동 · 출발 정보
                    </p>
                </header>
                <div class="fc-gallery__preview" role="region" aria-labelledby="gallery-timeline" tabindex="0">
                    <FcTerminalTimeline arrival="05:20" departure="09:50" terminal="Terminal Main" gate="A4" />
                </div>
            </section>
            <section v-show="category === 'all' || category === 'flight'" class="fc-gallery__group"
                aria-labelledby="gallery-details">
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        FcFlightDetails
                    </p>
                    <h2 id="gallery-details">
                        항공편 상세
                    </h2>
                    <p class="fc-gallery__description">
                        운항 일정과 비행 종료 상태
                    </p>
                </header>
                <div class="fc-gallery__preview" role="region" aria-labelledby="gallery-details" tabindex="0">
                    <div class="fc-gallery__row fc-gallery__state-preview">
                        <FcToggleSwitch v-model="completed" label="비행 종료" />
                    </div>
                    <FcFlightDetails :details="componentData.details" :completed="completed" />
                </div>
            </section>
            <section v-show="category === 'all' || category === 'stats'" class="fc-gallery__group"
                aria-labelledby="gallery-passport">
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        FcPassportOverview
                    </p>
                    <h2 id="gallery-passport">
                        패스포트 요약
                    </h2>
                    <p class="fc-gallery__description">
                        항공편 · 거리 · 시간 · 최근 기록
                    </p>
                </header>
                <div class="fc-gallery__preview" role="region" aria-labelledby="gallery-passport" tabindex="0">
                    <FcPassportOverview :flights="20" distance="73,650 km" flight-time="4d 13h" :airports="16"
                        :airlines="5" :periods="componentData.periods" map-from="ICN" map-to="ICN"
                        flags="🇰🇷 🇲🇾 🇯🇵 🇩🇪 🇨🇳 🇸🇬 🇳🇱 🇫🇮 🇩🇰 🇸🇪 🇲🇳" history-title="2025"
                        history-count="9 FLIGHTS" :recent="componentData.overview.recent" :show-period="false"
                        :show-map="false" />
                </div>
            </section>
            <section v-show="category === 'all' || category === 'stats'" class="fc-gallery__group"
                aria-labelledby="gallery-delays">
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        FcDelayReport
                    </p>
                    <h2 id="gallery-delays">
                        지연 리포트
                    </h2>
                    <p class="fc-gallery__description">
                        지연 비율과 누적 지연 시간
                    </p>
                </header>
                <div class="fc-gallery__preview" role="region" aria-labelledby="gallery-delays" tabindex="0">
                    <FcDelayReport :delayed="8" :total="20" :lost-minutes="180" worst-delay="KE 24 · 1h 05m late"
                        :worst-airline="`${airlines.KE.name} · 2h 10m late in total`" />
                </div>
            </section>
            <section v-show="category === 'all' || category === 'stats'" class="fc-gallery__group"
                aria-labelledby="gallery-aircraft">
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        FcAircraftStats
                    </p>
                    <h2 id="gallery-aircraft">
                        항공기 통계
                    </h2>
                    <p class="fc-gallery__description">
                        기종별 요약과 항공기 연령
                    </p>
                </header>
                <div class="fc-gallery__preview" role="region" aria-labelledby="gallery-aircraft" tabindex="0">
                    <FcAircraftStats :aircraft="aircraft" :show-period="false" />
                </div>
            </section>
            <section v-show="category === 'all' || category === 'stats'" class="fc-gallery__group"
                aria-labelledby="gallery-performance">
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        FcAirlinePerformance
                    </p>
                    <h2 id="gallery-performance">
                        운항 성과
                    </h2>
                    <p class="fc-gallery__description">
                        개인 · 지연 · 항공사 · 공항 통계
                    </p>
                </header>
                <div class="fc-gallery__preview" role="region" aria-labelledby="gallery-performance" tabindex="0">
                    <FcTabItem v-model="performanceSection" :items="componentData.performanceSections"
                        label="운항 성과 예시" />
                    <FcAirlinePerformance :key="performanceSection" :report="componentData.performance"
                        :section="performanceSection" />
                </div>
            </section>
            <section v-show="category === 'all' || category === 'stats'" class="fc-gallery__group"
                aria-labelledby="gallery-seats">
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        FcSeatStats
                    </p>
                    <h2 id="gallery-seats">
                        좌석 통계
                    </h2>
                    <p class="fc-gallery__description">
                        좌석 위치 · 등급 · 여행 목적
                    </p>
                </header>
                <div class="fc-gallery__preview" role="region" aria-labelledby="gallery-seats" tabindex="0">
                    <FcTabItem v-model="seatMode" :items="componentData.seatModes" label="좌석 통계 예시" />
                    <FcSeatStats :mode="componentData.seats[seatMode].mode"
                        :top-label="componentData.seats[seatMode].topLabel"
                        :top-value="componentData.seats[seatMode].topValue" :rows="componentData.seats[seatMode].rows"
                        :show-title="false" />
                </div>
            </section>
            <section v-show="category === 'all' || category === 'stats'" class="fc-gallery__group"
                aria-labelledby="gallery-tails">
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        FcFrequentTails
                    </p>
                    <h2 id="gallery-tails">
                        자주 탑승한 항공기
                    </h2>
                    <p class="fc-gallery__description">
                        항공기 등록 번호와 탑승 횟수
                    </p>
                </header>
                <div class="fc-gallery__preview" role="region" aria-labelledby="gallery-tails" tabindex="0">
                    <FcFrequentTails tail="HL-8078" :flights="2" model="A359" :airline="airlines.OZ.iata" flag="🇰🇷" />
                </div>
            </section>
            <section v-show="category === 'all' || category === 'stats'" class="fc-gallery__group"
                aria-labelledby="gallery-countries">
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        FcCountriesStats
                    </p>
                    <h2 id="gallery-countries">
                        방문 국가
                    </h2>
                    <p class="fc-gallery__description">
                        국가 목록과 지역별 비행 횟수
                    </p>
                </header>
                <div class="fc-gallery__preview" role="region" aria-labelledby="gallery-countries" tabindex="0">
                    <FcCountriesStats :total="11" :countries="componentData.countries.countries"
                        :regions="componentData.countries.regions" />
                </div>
            </section>
            <section v-show="category === 'all' || category === 'stats'" class="fc-gallery__group"
                aria-labelledby="gallery-airlines">
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        FcTopAirlines
                    </p>
                    <h2 id="gallery-airlines">
                        주요 항공사
                    </h2>
                    <p class="fc-gallery__description">
                        비행 횟수와 거리 기준 비교
                    </p>
                </header>
                <div class="fc-gallery__preview" role="region" aria-labelledby="gallery-airlines" tabindex="0">
                    <FcTopAirlines title="Top Airlines" :total="9" unit="total airlines"
                        :items="componentData.airlineItems" />
                </div>
            </section>
            <section v-show="category === 'all' || category === 'stats'" class="fc-gallery__group"
                aria-labelledby="gallery-distance">
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        FcFlightDistanceStats
                    </p>
                    <h2 id="gallery-distance">
                        비행 거리
                    </h2>
                    <p class="fc-gallery__description">
                        요약과 상세 내역 전환
                    </p>
                </header>
                <div class="fc-gallery__preview" role="region" aria-labelledby="gallery-distance" tabindex="0">
                    <FcFlightDistanceStats title="Flight Distance" share-label="Share" share-icon="share-2"
                        distance="73,650" distance-unit="km" miles="45,764" miles-unit="mi"
                        :breakdown="componentData.distance.breakdown" average-label="Average distance: 3,682 km"
                        :comparisons="componentData.distance.comparisons" summary-label="Show Summary"
                        breakdown-label="Show Breakdown" :shortest-flight="componentData.distance.shortestFlight"
                        :longest-flight="componentData.distance.longestFlight" />
                </div>
            </section>
            <section v-show="category === 'all' || category === 'settings'" class="fc-gallery__group"
                aria-labelledby="gallery-alerts">
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        FcAlertSettings
                    </p>
                    <h2 id="gallery-alerts">
                        항공편 알림
                    </h2>
                    <p class="fc-gallery__description">
                        내 항공편과 친구 알림 선택 상태
                    </p>
                </header>
                <div class="fc-gallery__preview" role="region" aria-labelledby="gallery-alerts" tabindex="0">
                    <FcTabItem v-model="alertMode" :items="componentData.alertModes" label="항공편 알림 예시" />
                    <FcAlertSettings :key="alertMode" :mode="alertMode"
                        :title="alertMode === 'mine' ? 'My Flight Alerts' : 'Customize Alerts'" :desc="alertMode === 'mine'
                            ? 'Pick the notification types you receive for your flights.'
                            : 'Customize this per friend in Flighty Friends.'
                            " :options="componentData.alertOptions[alertMode]" friend-name="김민지"
                        friend-email="friend@example.com" initial-shared initial-selected="Basics" />
                </div>
            </section>
            <section v-show="category === 'all' || category === 'settings'" class="fc-gallery__group"
                aria-labelledby="gallery-sync">
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        FcCalendarSync
                    </p>
                    <h2 id="gallery-sync">
                        캘린더 동기화
                    </h2>
                    <p class="fc-gallery__description">
                        가져오기 · 내보내기 · 달력 선택
                    </p>
                </header>
                <div class="fc-gallery__preview" role="region" aria-labelledby="gallery-sync" tabindex="0">
                    <FcCalendarSync :calendars="componentData.calendars" :settings="{
                        importEnabled: false,
                        exportEnabled: false,
                        importCalendars: [],
                        exportCalendar: '',
                    }" />
                </div>
            </section>
            <section v-show="category === 'all' || category === 'settings'" class="fc-gallery__group"
                aria-labelledby="gallery-settings">
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        FcSettingsMenu
                    </p>
                    <h2 id="gallery-settings">
                        설정 메뉴
                    </h2>
                    <p class="fc-gallery__description">
                        멤버십과 설정 목록
                    </p>
                </header>
                <div class="fc-gallery__preview" role="region" aria-labelledby="gallery-settings" tabindex="0">
                    <FcSettingsMenu :groups="componentData.settingsGroups"
                        :membership="{ title: 'Flighty Pro', status: 'Member' }" />
                </div>
            </section>
        </div>
    </article>
</template>

<script setup>
import { ref } from "vue";

import BaseButton from "../component/base/BaseButton.vue";
import BaseInput from "../component/base/BaseInput.vue";
import FcIcon from "../component/fc/FcIcon.vue";
import FcToggleSwitch from "../component/fc/FcToggleSwitch.vue";
import FcTabItem from "../component/fc/FcTabItem.vue";
import FcCountBadge from "../component/fc/FcCountBadge.vue";
import FcCalendarPicker from "../component/fc/FcCalendarPicker.vue";
import FcListRow from "../component/fc/FcListRow.vue";
import FcPasteField from "../component/fc/FcPasteField.vue";
import FcConnectionStatus from "../component/fc/FcConnectionStatus.vue";
import FcTerminalTimeline from "../component/fc/FcTerminalTimeline.vue";
import FcFlightListItem from "../component/fc/FcFlightListItem.vue";
import FcAddFlightSearch from "../component/fc/FcAddFlightSearch.vue";
import FcFlightDetails from "../component/fc/FcFlightDetails.vue";
import FcPassportOverview from "../component/fc/FcPassportOverview.vue";
import FcDelayReport from "../component/fc/FcDelayReport.vue";
import FcAircraftStats from "../component/fc/FcAircraftStats.vue";
import FcAlertSettings from "../component/fc/FcAlertSettings.vue";
import FcCalendarSync from "../component/fc/FcCalendarSync.vue";
import FcSettingsMenu from "../component/fc/FcSettingsMenu.vue";
import FcAirlinePerformance from "../component/fc/FcAirlinePerformance.vue";
import FcSeatStats from "../component/fc/FcSeatStats.vue";
import FcFrequentTails from "../component/fc/FcFrequentTails.vue";
import FcCountriesStats from "../component/fc/FcCountriesStats.vue";
import FcTopAirlines from "../component/fc/FcTopAirlines.vue";
import FcFlightDistanceStats from "../component/fc/FcFlightDistanceStats.vue";

import airports from "../common/airports.js";
import airlines from "../common/airlines.js";

import "../assets/scss/component/fc/FcComponentGallery.scss";
import "../assets/scss/component/base/BaseButton.scss";
import "../assets/scss/component/base/BaseInput.scss";
import "../assets/scss/component/fc/FcIcon.scss";
import "../assets/scss/component/fc/FcToggleSwitch.scss";
import "../assets/scss/component/fc/FcTabItem.scss";
import "../assets/scss/component/fc/FcCountBadge.scss";
import "../assets/scss/component/fc/FcCalendarPicker.scss";
import "../assets/scss/component/fc/FcListRow.scss";
import "../assets/scss/component/fc/FcPasteField.scss";
import "../assets/scss/component/fc/FcConnectionStatus.scss";
import "../assets/scss/component/fc/FcTerminalTimeline.scss";
import "../assets/scss/component/fc/FcFlightListItem.scss";
import "../assets/scss/component/fc/FcAddFlightSearch.scss";
import "../assets/scss/component/fc/FcFlightDetails.scss";
import "../assets/scss/component/fc/_stats.scss";
import "../assets/scss/component/fc/FcPassportOverview.scss";
import "../assets/scss/component/fc/FcDelayReport.scss";
import "../assets/scss/component/fc/FcAircraftStats.scss";
import "../assets/scss/component/fc/FcAlertSettings.scss";
import "../assets/scss/component/fc/FcCalendarSync.scss";
import "../assets/scss/component/fc/FcSettingsMenu.scss";
import "../assets/scss/component/fc/FcAirlinePerformance.scss";
import "../assets/scss/component/fc/FcSeatStats.scss";
import "../assets/scss/component/fc/FcFrequentTails.scss";
import "../assets/scss/component/fc/FcCountriesStats.scss";
import "../assets/scss/component/fc/FcTopAirlines.scss";
import "../assets/scss/component/fc/FcFlightDistanceStats.scss";

// 이 페이지에서 사용하는 샘플 데이터입니다.
// prettier-ignore
const componentData = {
    "categories": [
        {
            "id": "all",
            "label": "전체",
            "count": 26
        },
        {
            "id": "basic",
            "label": "기본 UI",
            "count": 9
        },
        {
            "id": "flight",
            "label": "항공편",
            "count": 5
        },
        {
            "id": "stats",
            "label": "통계",
            "count": 9
        },
        {
            "id": "settings",
            "label": "설정",
            "count": 3
        }
    ],
    "buttons": {
        "sizes": [
            {
                "id": "sm",
                "label": "SM"
            },
            {
                "id": "md",
                "label": "MD"
            },
            {
                "id": "lg",
                "label": "LG"
            }
        ],
        "types": [
            {
                "id": "fill",
                "label": "면"
            },
            {
                "id": "text",
                "label": "텍스트"
            }
        ],
        "tones": [
            {
                "id": "default",
                "label": "Default"
            },
            {
                "id": "red",
                "label": "Red"
            },
            {
                "id": "gray",
                "label": "Gray"
            },
            {
                "id": "primary",
                "label": "Primary"
            }
        ]
    },
    "inputs": [
        {
            "id": "text",
            "label": "단일 텍스트",
            "placeholder": "10/5 or Friday",
            "value": ""
        },
        {
            "id": "icon",
            "label": "아이콘 + 단일 텍스트",
            "placeholder": "10/5 or Friday",
            "value": "10/5 or Friday",
            "icon": "calendar-days"
        },
        {
            "id": "action",
            "label": "아이콘 + 텍스트 + SM 버튼",
            "placeholder": "10/5 or Friday",
            "value": "10/5 or Friday",
            "icon": "clipboard-paste",
            "actionLabel": "PASTE",
            "actionValue": "10/5 or Friday"
        }
    ],
    "tabItems": [
        {
            "id": "md-stroke",
            "label": "MD · Stroke · Icon",
            "size": "md",
            "variant": "stroke",
            "type": "checkbox",
            "icon": "square",
            "selected": ["Aisle"]
        },
        {
            "id": "md-fill",
            "label": "MD · Fill",
            "size": "md",
            "variant": "fill",
            "type": "tab",
            "icon": "",
            "selected": "Aisle"
        },
        {
            "id": "sm-stroke",
            "label": "SM · Stroke · Icon",
            "size": "sm",
            "variant": "stroke",
            "type": "radio",
            "icon": "square",
            "selected": "Aisle"
        },
        {
            "id": "sm-fill",
            "label": "SM · Fill",
            "size": "sm",
            "variant": "fill",
            "type": "tab",
            "icon": "",
            "selected": "Aisle"
        }
    ],
    "icons": [
        {
            "src": "plane",
            "label": "plane"
        },
        {
            "src": "route",
            "label": "route"
        },
        {
            "src": "bell",
            "label": "bell"
        },
        {
            "src": "calendar-days",
            "label": "calendar"
        },
        {
            "src": "users",
            "label": "users"
        },
        {
            "src": "earth",
            "label": "earth"
        }
    ],
    "positions": ["Aisle", "Middle", "Window", "Pilot", "Captain", "Jumpseat"],
    "periods": ["ALL-TIME", "2025", "2024", "2023", "2017"],
    "performanceSections": ["mine", "delays", "airline", "airport"],
    "seatModes": ["seat", "class", "reason"],
    "alertModes": ["mine", "friend"],
    "calendar": {
        "marked": [11, 13]
    },
    "flightVariants": [
        {
            "label": "Upcoming",
            "variant": "upcoming"
        },
        {
            "label": "History",
            "variant": "history"
        },
        {
            "label": "Header",
            "variant": "header"
        }
    ],
    "searchItems": [
        {
            "title": airlines.KE.name,
            "subtitle": `${airlines.KE.iata}  ·  ${airlines.KE.icao}`,
            "avatar": airlines.KE.logo
        },
        {
            "title": airports.JFK.fullName,
            "subtitle": `${airports.JFK.iata}  ·  ${airports.JFK.icao}  ·  ${airports.JFK.city}`,
            "avatar": "plane"
        },
        {
            "title": airports.EWR.fullName,
            "subtitle": `${airports.EWR.iata}  ·  ${airports.EWR.icao}  ·  ${airports.EWR.city}`,
            "avatar": "plane"
        },
        {
            "title": airports.BLR.fullName,
            "subtitle": `${airports.BLR.iata}  ·  ${airports.BLR.icao}  ·  ${airports.BLR.city}`,
            "avatar": "plane"
        }
    ],
    "details": {
        "airline": airlines.KE.name,
        "plane": "Airbus A330-300",
        "from": "SFO",
        "to": "ICN",
        "departure": "11:40",
        "arrival": "17:40",
        "departureAirport": airports.SFO.fullName,
        "arrivalAirport": airports.ICN.fullName,
        "scheduledDeparture": "11:40",
        "scheduledArrival": "18:00",
        "departureGate": "F4",
        "arrivalGate": "F4",
        "baggage": "14",
        "departureStatus": "20m Late",
        "arrivalStatus": "20m Early",
        "departureTerminal": "Terminal 1",
        "arrivalTerminal": "Terminal 1",
        "duration": "13h",
        "distance": "9,086 km",
        "arrivalDayOffset": "+1",
        "overnight": true,
        "timezoneTitle": "+17 Hours Timezone Change",
        "timezoneDescription": "17:40 arrival is 00:40 San Francisco time",
        "forecastDescription": "KE 24 performance over the last 60 days",
        "forecastStats": [
            {
                "label": "Late",
                "value": "22%"
            },
            {
                "label": "Average of Late",
                "value": "17m"
            },
            {
                "label": "Observed",
                "value": "59"
            }
        ],
        "forecast": [
            {
                "label": "Early",
                "value": 81,
                "color": "var(--fc-success, #00ae57)"
            },
            {
                "label": "On Time",
                "value": 80,
                "color": "#56d76a"
            },
            {
                "label": "15m late",
                "value": 60,
                "color": "#ffcb31"
            },
            {
                "label": "30m late",
                "value": 40,
                "color": "#ff9d20"
            },
            {
                "label": "45m+ late",
                "value": 20,
                "color": "var(--fc-danger, #ff4d4d)"
            }
        ],
        "features": [
            {
                "title": "Booking Code",
                "action": "Tap to Edit",
                "field": "bookingCode"
            },
            {
                "title": "Seat Information",
                "action": "Add Seat",
                "field": "seat"
            }
        ],
        "tail": "HL-7587",
        "firstFlight": "Nov 8, 2000",
        "age": "25 years old",
        "alliance": airlines.KE.alliance,
        "callsign": airlines.KE.callsign,
        "icao": airlines.KE.icao,
        "iata": airlines.KE.iata,
        "historyStats": [
            {
                "label": "Flights",
                "value": "1"
            },
            {
                "label": "Distance",
                "value": "9,086 km"
            },
            {
                "label": "Flight Time",
                "value": "13h"
            }
        ],
        "recentFlight": "20 Aug 2025 · KE 647"
    },
    "overview": {
        "recent": [
            {
                "id": 1,
                "code": "KE 5926",
                "route": "AMS → ICN",
                "title": "Amsterdam to Seoul",
                "date": "Dec 29, 2025"
            },
            {
                "id": 2,
                "code": "AY 041",
                "route": "HEL → ICN",
                "title": "Helsinki to Seoul",
                "date": "Nov 14, 2025"
            },
            {
                "id": 3,
                "code": "KE 703",
                "route": "ICN → NRT",
                "title": "Seoul to Tokyo",
                "date": "Sep 8, 2025"
            },
            {
                "id": 4,
                "code": "SQ 607",
                "route": "ICN → SIN",
                "title": "Seoul to Singapore",
                "date": "Aug 20, 2025"
            },
            {
                "id": 5,
                "code": "OZ 202",
                "route": "ICN → LAX",
                "title": "Seoul to Los Angeles",
                "date": "Jun 2, 2025"
            }
        ]
    },
    "aircraft": {
        "total": 12,
        "mostFlown": "A330-300",
        "tail": "HL-8078",
        "manufacturer": "55% Airbus",
        "newest": {
            "age": "2 years",
            "model": "Embraer 175",
            "date": "5/25/2024"
        },
        "oldest": {
            "age": "25 years",
            "model": "B737-800",
            "date": "11/8/2000"
        },
        "summary": "4 flights · 12 hours",
        "median": "9 years old",
        "ages": [
            {
                "label": "2000's",
                "value": 25
            },
            {
                "label": "2010's",
                "value": 19
            },
            {
                "label": "2020's",
                "value": 6
            }
        ],
        "tailFlights": 2
    },
    "alertOptions": {
        "mine": [
            {
                "icon": "bell",
                "title": "Basics",
                "desc": "The most critical alerts like gate changes, delays, & Cancellations.",
                "color": "var(--fc-link, #1685ff)",
                "enabled": true
            },
            {
                "icon": "circle-check",
                "title": "Above & Beyond",
                "desc": "Get alerts on inbound aircraft status, connection assistance, and aircraft changes",
                "color": "var(--fc-success, #00ae70)",
                "enabled": false
            },
            {
                "icon": "route",
                "title": "Flight Plans",
                "desc": "Get a map of the flight path when the pilot files it with authorities.",
                "color": "#ffca2d",
                "enabled": false
            },
            {
                "icon": "plane-landing",
                "title": "Arrival Information",
                "desc": "Get alerts for landing, gate arrival, and baggage claim.",
                "color": "#ff9d20",
                "enabled": false
            }
        ],
        "friend": [
            {
                "icon": "users",
                "title": "None",
                "desc": "No alerts please. I’ll just view their flights in the app.",
                "color": "var(--fc-danger, #ff5049)"
            },
            {
                "icon": "plane-landing",
                "title": "Just Landed",
                "desc": "Only notify me when they land.",
                "color": "var(--fc-success, #00ae70)"
            },
            {
                "icon": "users",
                "title": "Basics",
                "desc": "Add alerts for major disruptions, takeoff, 1h until arrival, and on morning of travel.",
                "color": "var(--fc-link, #1685ff)"
            },
            {
                "icon": "users",
                "title": "Everything",
                "desc": "Every alert. Check-in, gate change, disruptions, landing, baggage, etc",
                "color": "#ff9d20"
            }
        ]
    },
    "calendars": ["Personal", "Work", "Flighty"],
    "settingsGroups": [
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
    "performance": {
        "airports": [
            {
                "name": "🇰🇷 ICN",
                "percent": 100,
                "count": "1/1"
            },
            {
                "name": "🇫🇷 CDG",
                "percent": 50,
                "count": "1/2"
            },
            {
                "name": "🇺🇸 LAX",
                "percent": 33,
                "count": "1/3"
            },
            {
                "name": "🇯🇵 NRT",
                "percent": 25,
                "count": "1/4"
            },
            {
                "name": "🇳🇱 AMS",
                "percent": 10,
                "count": "1/1"
            },
            {
                "name": "🇫🇮 HEL",
                "percent": 10,
                "count": "1/1"
            }
        ],
        "airlines": [
            {
                "name": airlines.AY.name,
                "percent": 100,
                "count": "1/1"
            },
            {
                "name": airlines.KL.name,
                "percent": 50,
                "count": "1/2"
            },
            {
                "name": airlines.OZ.name,
                "percent": 33,
                "count": "1/3"
            },
            {
                "name": airlines.KE.name,
                "percent": 25,
                "count": "1/4"
            },
            {
                "name": airlines.AS.name,
                "percent": 10,
                "count": "1/1"
            },
            {
                "name": airlines.SQ.name,
                "percent": 10,
                "count": "1/1"
            }
        ],
        "performance": [
            {
                "label": "Early",
                "value": 81,
                "color": "var(--fc-success, #00ae70)"
            },
            {
                "label": "On Time",
                "value": 80,
                "color": "#53d96c"
            },
            {
                "label": "15m late",
                "value": 60,
                "color": "#ffca2d"
            },
            {
                "label": "30m late",
                "value": 40,
                "color": "#ff9d20"
            },
            {
                "label": "45m+ late",
                "value": 20,
                "color": "var(--fc-danger, #ff5049)"
            }
        ],
        "airportHeadline": "75%",
        "airlineHeadline": "50%",
        "cumulative": "11m",
        "delayTotal": 8,
        "delays": [
            {
                "flight": "KL 1251",
                "duration": "10h 47m",
                "route": "AMS-HEL",
                "date": "Dec 24, 2025"
            },
            {
                "flight": "KL 6410",
                "duration": "47m",
                "route": "AMS-HEL",
                "date": "Dec 24, 2025"
            },
            {
                "flight": "KL 703",
                "duration": "47m",
                "route": "AMS-HEL",
                "date": "Dec 24, 2025"
            },
            {
                "flight": "AY 911",
                "duration": "47m",
                "route": "AMS-HEL",
                "date": "Dec 24, 2025"
            },
            {
                "flight": "KE 24",
                "duration": "47m",
                "route": "AMS-HEL",
                "date": "Dec 24, 2025"
            },
            {
                "flight": "OZ 202",
                "duration": "47m",
                "route": "AMS-HEL",
                "date": "Dec 24, 2025"
            },
            {
                "flight": "AY 41",
                "duration": "47m",
                "route": "AMS-HEL",
                "date": "Dec 24, 2025"
            },
            {
                "flight": "KL 5926",
                "duration": "47m",
                "route": "AMS-HEL",
                "date": "Dec 24, 2025"
            }
        ]
    },
    "seats": {
        "seat": {
            "mode": "seat",
            "topLabel": "Top Seat",
            "topValue": "32K",
            "rows": [
                {
                    "name": "Aisle",
                    "count": 0,
                    "percent": 0,
                    "color": "var(--fc-success, #00ae70)"
                },
                {
                    "name": "Middle",
                    "count": 2,
                    "percent": 10,
                    "color": "#ff9d20"
                },
                {
                    "name": "Window",
                    "count": 18,
                    "percent": 90,
                    "color": "var(--fc-blue, #087bfa)"
                }
            ]
        },
        "class": {
            "mode": "class",
            "topLabel": "Top Class",
            "topValue": "Economy",
            "rows": [
                {
                    "name": "Economy",
                    "count": 20,
                    "percent": 100,
                    "color": "var(--fc-economy)"
                },
                {
                    "name": "Premium Economy",
                    "count": 0,
                    "percent": 0,
                    "color": "var(--fc-premium-economy)"
                },
                {
                    "name": "Business",
                    "count": 0,
                    "percent": 0,
                    "color": "var(--fc-business)"
                },
                {
                    "name": "First Class",
                    "count": 0,
                    "percent": 0,
                    "color": "var(--fc-first-class)"
                }
            ]
        },
        "reason": {
            "mode": "reason",
            "topLabel": "Top Reason",
            "topValue": "Personal",
            "rows": [
                {
                    "name": "Personal",
                    "count": 20,
                    "percent": 100,
                    "color": "var(--fc-success, #00ae70)"
                },
                {
                    "name": "Business",
                    "count": 0,
                    "percent": 0,
                    "color": "var(--fc-blue, #087bfa)"
                }
            ]
        }
    },
    "countries": {
        "countries": [
            {
                "flag": "🇰🇷",
                "name": "South Korea",
                "count": 16
            },
            {
                "flag": "🇳🇱",
                "name": "Netherlands",
                "count": 16
            },
            {
                "flag": "🇺🇸",
                "name": "United States",
                "count": 16
            },
            {
                "flag": "🇯🇵",
                "name": "Japan",
                "count": 7
            },
            {
                "flag": "🇸🇬",
                "name": "Singapore",
                "count": 5
            }
        ],
        "regions": [
            {
                "name": "Asia",
                "count": 5,
                "percent": "14%"
            },
            {
                "name": "Europe",
                "count": 5,
                "percent": "14%"
            },
            {
                "name": "N. America",
                "count": 5,
                "percent": "14%"
            },
            {
                "name": "Africa",
                "count": 5,
                "percent": "14%"
            },
            {
                "name": "C. America",
                "count": 5,
                "percent": "14%"
            },
            {
                "name": "Caribbean",
                "count": 5,
                "percent": "14%"
            },
            {
                "name": "Middle East",
                "count": 5,
                "percent": "14%"
            },
            {
                "name": "Oceania",
                "count": 5,
                "percent": "14%"
            },
            {
                "name": "S. America",
                "count": 5,
                "percent": "14%"
            }
        ]
    },
    "airlineItems": [
        {
            "name": airlines.KE.name,
            "flights": 13,
            "distance": 48600
        },
        {
            "name": airlines.OZ.name,
            "flights": 3,
            "distance": 12000
        },
        {
            "name": airlines.KL.name,
            "flights": 2,
            "distance": 7800
        },
        {
            "name": airlines.AY.name,
            "flights": 2,
            "distance": 5250
        }
    ],
    "distance": {
        "breakdown": [
            {
                "label": "Days",
                "value": "4.6"
            },
            {
                "label": "Weeks",
                "value": "0.7"
            },
            {
                "label": "Months",
                "value": "0.15"
            },
            {
                "label": "Years",
                "value": "0.01"
            },
            {
                "label": "Avg. Flight Time",
                "value": "5h 28m"
            },
            {
                "label": "In Air",
                "value": "0.8%"
            }
        ],
        "comparisons": [
            {
                "icon": "earth",
                "text": "1.8x Around Earth"
            },
            {
                "icon": "moon",
                "text": "0.2x To the Moon"
            },
            {
                "icon": "sun",
                "text": "0.02x Around the Sun"
            }
        ],
        "shortestFlight": {
            "title": "Shortest flight",
            "route": "Jeju → Seoul",
            "distance": "451 km",
            "detail": "KE 1238 · 2 Jun 2017"
        },
        "longestFlight": {
            "title": "Longest flight",
            "route": "Seoul → Los Angeles",
            "distance": "9,647 km",
            "detail": "OZ 202 · 2 Jun 2017"
        }
    }
};

const gallery = ref(null);
const category = ref("all");
const inputValues = ref(
    Object.fromEntries(
        componentData.inputs.map((item) => [item.id, item.value]),
    ),
);
const tabSelections = ref(
    Object.fromEntries(
        componentData.tabItems.map((item) => [item.id, item.selected]),
    ),
);
const performanceSection = ref("mine");
const seatMode = ref("seat");
const alertMode = ref("mine");
const enabled = ref(true);
const secondaryEnabled = ref(false);
const switchRadio = ref("");
const day = ref(20);
const reason = ref("");
const completed = ref(false);
const aircraft = {
    ...componentData.aircraft,
    periods: componentData.periods,
};

function selectCategory(item) {
    category.value = item.id;
    gallery.value?.scrollIntoView({ block: "start" });
}

function applyInputAction(item) {
    inputValues.value[item.id] = item.actionValue;
}
</script>
