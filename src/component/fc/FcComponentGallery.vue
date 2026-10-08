<script setup>
import { computed, ref } from "vue";

import BaseButton from "../base/BaseButton.vue";
import BaseInput from "../base/BaseInput.vue";
import FcIcon from "./FcIcon.vue";
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

import chipIcon from "../../assets/icons/lucide/square.svg";

import "../../assets/scss/FcGalleryBundle.scss";

const props = defineProps({
    // ComponentPage.json의 갤러리 설명과 각 컴포넌트 미리보기 데이터입니다.
    data: { type: Object, required: true },
});

const gallery = ref(null);
const category = ref(props.data.gallery.category);
const inputValue = ref(props.data.input.value);
const performanceSection = ref(props.data.performanceSection);
const seatMode = ref(props.data.seatMode);
const alertMode = ref(props.data.alerts.mode);
const enabled = ref(props.data.enabled);
const secondaryEnabled = ref(props.data.secondaryEnabled);
const seat = ref(props.data.seat);
const period = ref(props.data.period);
const day = ref(props.data.day);
const reason = ref(props.data.reason);
const completed = ref(props.data.completed);

const catalog = computed(() => props.data.gallery.catalog);
const visibleSections = computed(() => {
    const sections = {};
    for (const [name, item] of Object.entries(catalog.value)) {
        sections[name] =
            category.value === "all" || category.value === item.category;
    }
    return sections;
});

function selectCategory(item) {
    category.value = item.id;
    gallery.value?.scrollIntoView({ block: "start" });
}
</script>

<template>
    <article
        ref="gallery"
        class="fc-gallery"
    >
        <header class="fc-gallery__intro">
            <div>
                <p class="fc-gallery__eyebrow">{{ data.gallery.eyebrow }}</p>
                <h1>{{ data.gallery.title }}</h1>
                <p class="fc-gallery__description">
                    {{ data.gallery.description }}
                </p>
            </div>
            <ul
                class="fc-gallery__meta"
                aria-label="갤러리 구성"
            >
                <!-- prettier-ignore -->
                <li><strong>{{ data.gallery.total }}</strong>개 컴포넌트</li>
                <li
                    v-for="tag in data.gallery.tags"
                    :key="tag"
                >
                    {{ tag }}
                </li>
            </ul>
        </header>

        <div
            class="fc-gallery__filters"
            role="group"
            aria-label="컴포넌트 분류"
        >
            <button
                v-for="item in data.gallery.categories"
                :key="item.id"
                type="button"
                :class="{ 'is-active': category === item.id }"
                :aria-pressed="category === item.id"
                @click="selectCategory(item)"
            >
                {{ item.label }}
                <span>{{ item.count }}</span>
            </button>
        </div>

        <div class="fc-gallery__grid">
            <section
                v-show="visibleSections.buttons"
                class="fc-gallery__group"
                aria-labelledby="gallery-buttons"
            >
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        {{ catalog.buttons.component }}
                    </p>
                    <h2 id="gallery-buttons">
                        {{ catalog.buttons.title }}
                    </h2>
                    <p class="fc-gallery__description">
                        {{ catalog.buttons.description }}
                    </p>
                </header>
                <div
                    class="fc-gallery__preview"
                    role="region"
                    aria-labelledby="gallery-buttons"
                    tabindex="0"
                >
                    <div class="fc-gallery__row">
                        <BaseButton
                            v-for="button in data.buttons"
                            :key="button.label"
                            v-bind="button"
                        />
                    </div>
                </div>
            </section>
            <section
                v-show="visibleSections.input"
                class="fc-gallery__group"
                aria-labelledby="gallery-input"
            >
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        {{ catalog.input.component }}
                    </p>
                    <h2 id="gallery-input">
                        {{ catalog.input.title }}
                    </h2>
                    <p class="fc-gallery__description">
                        {{ catalog.input.description }}
                    </p>
                </header>
                <div
                    class="fc-gallery__preview"
                    role="region"
                    aria-labelledby="gallery-input"
                    tabindex="0"
                >
                    <div class="fc-gallery__field">
                        <label for="gallery-flight-number">
                            {{ data.input.label }}
                        </label>
                        <BaseInput
                            id="gallery-flight-number"
                            v-model="inputValue"
                            class="fc-gallery__input"
                            :placeholder="data.input.placeholder"
                        />
                        <label for="gallery-input-disabled">
                            {{ data.input.disabledLabel }}
                        </label>
                        <BaseInput
                            id="gallery-input-disabled"
                            class="fc-gallery__input"
                            :model-value="data.input.disabledValue"
                            disabled
                        />
                    </div>
                </div>
            </section>
            <section
                v-show="visibleSections.icons"
                class="fc-gallery__group"
                aria-labelledby="gallery-icons"
            >
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        {{ catalog.icons.component }}
                    </p>
                    <h2 id="gallery-icons">
                        {{ catalog.icons.title }}
                    </h2>
                    <p class="fc-gallery__description">
                        {{ catalog.icons.description }}
                    </p>
                </header>
                <div
                    class="fc-gallery__preview"
                    role="region"
                    aria-labelledby="gallery-icons"
                    tabindex="0"
                >
                    <div class="fc-gallery__icons">
                        <div
                            v-for="icon in data.icons"
                            :key="icon.src"
                        >
                            <FcIcon :src="icon.src" />
                            <small>{{ icon.label }}</small>
                        </div>
                    </div>
                </div>
            </section>
            <section
                v-show="visibleSections.toggle"
                class="fc-gallery__group"
                aria-labelledby="gallery-toggle"
            >
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        {{ catalog.toggle.component }}
                    </p>
                    <h2 id="gallery-toggle">
                        {{ catalog.toggle.title }}
                    </h2>
                    <p class="fc-gallery__description">
                        {{ catalog.toggle.description }}
                    </p>
                </header>
                <div
                    class="fc-gallery__preview"
                    role="region"
                    aria-labelledby="gallery-toggle"
                    tabindex="0"
                >
                    <div class="fc-gallery__row">
                        <FcToggleSwitch
                            v-model="enabled"
                            label="알림"
                        />
                        <FcToggleSwitch
                            v-model="secondaryEnabled"
                            label="꺼짐"
                        />
                        <FcToggleSwitch
                            :model-value="false"
                            label="비활성 상태"
                            disabled
                        />
                    </div>
                </div>
            </section>
            <section
                v-show="visibleSections.choice"
                class="fc-gallery__group"
                aria-labelledby="gallery-choice"
            >
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        {{ catalog.choice.component }}
                    </p>
                    <h2 id="gallery-choice">
                        {{ catalog.choice.title }}
                    </h2>
                    <p class="fc-gallery__description">
                        {{ catalog.choice.description }}
                    </p>
                </header>
                <div
                    class="fc-gallery__preview"
                    role="region"
                    aria-labelledby="gallery-choice"
                    tabindex="0"
                >
                    <div class="fc-gallery__row">
                        <FcChoiceChip
                            v-for="item in data.positions"
                            :key="item"
                            :label="item"
                            :icon="chipIcon"
                            :active="seat === item"
                            :filled="seat === item"
                            @click="seat = item"
                        />
                    </div>
                </div>
            </section>
            <section
                v-show="visibleSections.periods"
                class="fc-gallery__group"
                aria-labelledby="gallery-periods"
            >
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        {{ catalog.periods.component }}
                    </p>
                    <h2 id="gallery-periods">
                        {{ catalog.periods.title }}
                    </h2>
                    <p class="fc-gallery__description">
                        {{ catalog.periods.description }}
                    </p>
                </header>
                <div
                    class="fc-gallery__preview"
                    role="region"
                    aria-labelledby="gallery-periods"
                    tabindex="0"
                >
                    <FcPeriodTabs
                        v-model="period"
                        :items="data.periods"
                    />
                </div>
            </section>
            <section
                v-show="visibleSections.badges"
                class="fc-gallery__group"
                aria-labelledby="gallery-badges"
            >
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        {{ catalog.badges.component }}
                    </p>
                    <h2 id="gallery-badges">
                        {{ catalog.badges.title }}
                    </h2>
                    <p class="fc-gallery__description">
                        {{ catalog.badges.description }}
                    </p>
                </header>
                <div
                    class="fc-gallery__preview"
                    role="region"
                    aria-labelledby="gallery-badges"
                    tabindex="0"
                >
                    <div class="fc-gallery__row">
                        <FcCountBadge
                            v-for="badge in data.badges"
                            :key="badge.variant"
                            v-bind="badge"
                        />
                    </div>
                </div>
            </section>
            <section
                v-show="visibleSections.calendar"
                class="fc-gallery__group"
                aria-labelledby="gallery-calendar"
            >
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        {{ catalog.calendar.component }}
                    </p>
                    <h2 id="gallery-calendar">
                        {{ catalog.calendar.title }}
                    </h2>
                    <p class="fc-gallery__description">
                        {{ catalog.calendar.description }}
                    </p>
                </header>
                <div
                    class="fc-gallery__preview"
                    role="region"
                    aria-labelledby="gallery-calendar"
                    tabindex="0"
                >
                    <FcCalendarPicker
                        v-model="day"
                        v-bind="data.calendar"
                    />
                </div>
            </section>
            <section
                v-show="visibleSections.rows"
                class="fc-gallery__group"
                aria-labelledby="gallery-rows"
            >
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        {{ catalog.rows.component }}
                    </p>
                    <h2 id="gallery-rows">
                        {{ catalog.rows.title }}
                    </h2>
                    <p class="fc-gallery__description">
                        {{ catalog.rows.description }}
                    </p>
                </header>
                <div
                    class="fc-gallery__preview"
                    role="region"
                    aria-labelledby="gallery-rows"
                    tabindex="0"
                >
                    <FcListRow
                        v-for="row in data.rows"
                        :key="row.title"
                        v-bind="row"
                    />
                </div>
            </section>
            <section
                v-show="visibleSections.paste"
                class="fc-gallery__group"
                aria-labelledby="gallery-paste"
            >
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        {{ catalog.paste.component }}
                    </p>
                    <h2 id="gallery-paste">
                        {{ catalog.paste.title }}
                    </h2>
                    <p class="fc-gallery__description">
                        {{ catalog.paste.description }}
                    </p>
                </header>
                <div
                    class="fc-gallery__preview"
                    role="region"
                    aria-labelledby="gallery-paste"
                    tabindex="0"
                >
                    <FcPasteField
                        v-model="reason"
                        label="Booking Code"
                        :sample-value="data.bookingCode"
                    />
                </div>
            </section>
            <section
                v-show="visibleSections.flights"
                class="fc-gallery__group"
                aria-labelledby="gallery-flights"
            >
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        {{ catalog.flights.component }}
                    </p>
                    <h2 id="gallery-flights">
                        {{ catalog.flights.title }}
                    </h2>
                    <p class="fc-gallery__description">
                        {{ catalog.flights.description }}
                    </p>
                </header>
                <div
                    class="fc-gallery__preview"
                    role="region"
                    aria-labelledby="gallery-flights"
                    tabindex="0"
                >
                    <div
                        v-for="sample in data.flightVariants"
                        :key="sample.variant"
                    >
                        <p class="fc-gallery__sample-label">
                            {{ sample.label }}
                        </p>
                        <FcFlightListItem
                            v-bind="data.flight"
                            :variant="sample.variant"
                        />
                    </div>
                </div>
            </section>
            <section
                v-show="visibleSections.search"
                class="fc-gallery__group"
                aria-labelledby="gallery-search"
            >
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        {{ catalog.search.component }}
                    </p>
                    <h2 id="gallery-search">
                        {{ catalog.search.title }}
                    </h2>
                    <p class="fc-gallery__description">
                        {{ catalog.search.description }}
                    </p>
                </header>
                <div
                    class="fc-gallery__preview"
                    role="region"
                    aria-labelledby="gallery-search"
                    tabindex="0"
                >
                    <FcAddFlightSearch v-bind="data.search" />
                </div>
            </section>
            <section
                v-show="visibleSections.connection"
                class="fc-gallery__group"
                aria-labelledby="gallery-connection"
            >
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        {{ catalog.connection.component }}
                    </p>
                    <h2 id="gallery-connection">
                        {{ catalog.connection.title }}
                    </h2>
                    <p class="fc-gallery__description">
                        {{ catalog.connection.description }}
                    </p>
                </header>
                <div
                    class="fc-gallery__preview"
                    role="region"
                    aria-labelledby="gallery-connection"
                    tabindex="0"
                >
                    <FcConnectionStatus v-bind="data.connection" />
                </div>
            </section>
            <section
                v-show="visibleSections.timeline"
                class="fc-gallery__group"
                aria-labelledby="gallery-timeline"
            >
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        {{ catalog.timeline.component }}
                    </p>
                    <h2 id="gallery-timeline">
                        {{ catalog.timeline.title }}
                    </h2>
                    <p class="fc-gallery__description">
                        {{ catalog.timeline.description }}
                    </p>
                </header>
                <div
                    class="fc-gallery__preview"
                    role="region"
                    aria-labelledby="gallery-timeline"
                    tabindex="0"
                >
                    <FcTerminalTimeline v-bind="data.timeline" />
                </div>
            </section>
            <section
                v-show="visibleSections.details"
                class="fc-gallery__group"
                aria-labelledby="gallery-details"
            >
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        {{ catalog.details.component }}
                    </p>
                    <h2 id="gallery-details">
                        {{ catalog.details.title }}
                    </h2>
                    <p class="fc-gallery__description">
                        {{ catalog.details.description }}
                    </p>
                </header>
                <div
                    class="fc-gallery__preview"
                    role="region"
                    aria-labelledby="gallery-details"
                    tabindex="0"
                >
                    <div class="fc-gallery__row fc-gallery__state-preview">
                        <FcToggleSwitch
                            v-model="completed"
                            label="비행 종료"
                        />
                    </div>
                    <FcFlightDetails
                        :details="data.details"
                        :completed="completed"
                    />
                </div>
            </section>
            <section
                v-show="visibleSections.passport"
                class="fc-gallery__group"
                aria-labelledby="gallery-passport"
            >
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        {{ catalog.passport.component }}
                    </p>
                    <h2 id="gallery-passport">
                        {{ catalog.passport.title }}
                    </h2>
                    <p class="fc-gallery__description">
                        {{ catalog.passport.description }}
                    </p>
                </header>
                <div
                    class="fc-gallery__preview"
                    role="region"
                    aria-labelledby="gallery-passport"
                    tabindex="0"
                >
                    <FcPassportOverview
                        v-bind="data.overview"
                        :show-period="false"
                        :show-map="false"
                    />
                </div>
            </section>
            <section
                v-show="visibleSections.delays"
                class="fc-gallery__group"
                aria-labelledby="gallery-delays"
            >
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        {{ catalog.delays.component }}
                    </p>
                    <h2 id="gallery-delays">
                        {{ catalog.delays.title }}
                    </h2>
                    <p class="fc-gallery__description">
                        {{ catalog.delays.description }}
                    </p>
                </header>
                <div
                    class="fc-gallery__preview"
                    role="region"
                    aria-labelledby="gallery-delays"
                    tabindex="0"
                >
                    <FcDelayReport v-bind="data.delayReport" />
                </div>
            </section>
            <section
                v-show="visibleSections.aircraft"
                class="fc-gallery__group"
                aria-labelledby="gallery-aircraft"
            >
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        {{ catalog.aircraft.component }}
                    </p>
                    <h2 id="gallery-aircraft">
                        {{ catalog.aircraft.title }}
                    </h2>
                    <p class="fc-gallery__description">
                        {{ catalog.aircraft.description }}
                    </p>
                </header>
                <div
                    class="fc-gallery__preview"
                    role="region"
                    aria-labelledby="gallery-aircraft"
                    tabindex="0"
                >
                    <FcAircraftStats
                        :aircraft="data.aircraft"
                        :show-period="false"
                    />
                </div>
            </section>
            <section
                v-show="visibleSections.performance"
                class="fc-gallery__group"
                aria-labelledby="gallery-performance"
            >
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        {{ catalog.performance.component }}
                    </p>
                    <h2 id="gallery-performance">
                        {{ catalog.performance.title }}
                    </h2>
                    <p class="fc-gallery__description">
                        {{ catalog.performance.description }}
                    </p>
                </header>
                <div
                    class="fc-gallery__preview"
                    role="region"
                    aria-labelledby="gallery-performance"
                    tabindex="0"
                >
                    <FcPeriodTabs
                        v-model="performanceSection"
                        :items="data.performanceSections"
                        label="운항 성과 예시"
                    />
                    <FcAirlinePerformance
                        :key="performanceSection"
                        :report="data.performance"
                        :section="performanceSection"
                    />
                </div>
            </section>
            <section
                v-show="visibleSections.seats"
                class="fc-gallery__group"
                aria-labelledby="gallery-seats"
            >
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        {{ catalog.seats.component }}
                    </p>
                    <h2 id="gallery-seats">
                        {{ catalog.seats.title }}
                    </h2>
                    <p class="fc-gallery__description">
                        {{ catalog.seats.description }}
                    </p>
                </header>
                <div
                    class="fc-gallery__preview"
                    role="region"
                    aria-labelledby="gallery-seats"
                    tabindex="0"
                >
                    <FcPeriodTabs
                        v-model="seatMode"
                        :items="data.seatModes"
                        label="좌석 통계 예시"
                    />
                    <FcSeatStats
                        v-bind="data.seats[seatMode]"
                        :show-title="false"
                    />
                </div>
            </section>
            <section
                v-show="visibleSections.tails"
                class="fc-gallery__group"
                aria-labelledby="gallery-tails"
            >
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        {{ catalog.tails.component }}
                    </p>
                    <h2 id="gallery-tails">
                        {{ catalog.tails.title }}
                    </h2>
                    <p class="fc-gallery__description">
                        {{ catalog.tails.description }}
                    </p>
                </header>
                <div
                    class="fc-gallery__preview"
                    role="region"
                    aria-labelledby="gallery-tails"
                    tabindex="0"
                >
                    <FcFrequentTails v-bind="data.tails" />
                </div>
            </section>
            <section
                v-show="visibleSections.countries"
                class="fc-gallery__group"
                aria-labelledby="gallery-countries"
            >
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        {{ catalog.countries.component }}
                    </p>
                    <h2 id="gallery-countries">
                        {{ catalog.countries.title }}
                    </h2>
                    <p class="fc-gallery__description">
                        {{ catalog.countries.description }}
                    </p>
                </header>
                <div
                    class="fc-gallery__preview"
                    role="region"
                    aria-labelledby="gallery-countries"
                    tabindex="0"
                >
                    <FcCountriesStats v-bind="data.countries" />
                </div>
            </section>
            <section
                v-show="visibleSections.airlines"
                class="fc-gallery__group"
                aria-labelledby="gallery-airlines"
            >
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        {{ catalog.airlines.component }}
                    </p>
                    <h2 id="gallery-airlines">
                        {{ catalog.airlines.title }}
                    </h2>
                    <p class="fc-gallery__description">
                        {{ catalog.airlines.description }}
                    </p>
                </header>
                <div
                    class="fc-gallery__preview"
                    role="region"
                    aria-labelledby="gallery-airlines"
                    tabindex="0"
                >
                    <FcTopAirlines v-bind="data.airlines" />
                </div>
            </section>
            <section
                v-show="visibleSections.distance"
                class="fc-gallery__group"
                aria-labelledby="gallery-distance"
            >
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        {{ catalog.distance.component }}
                    </p>
                    <h2 id="gallery-distance">
                        {{ catalog.distance.title }}
                    </h2>
                    <p class="fc-gallery__description">
                        {{ catalog.distance.description }}
                    </p>
                </header>
                <div
                    class="fc-gallery__preview"
                    role="region"
                    aria-labelledby="gallery-distance"
                    tabindex="0"
                >
                    <FcFlightDistanceStats v-bind="data.distance" />
                </div>
            </section>
            <section
                v-show="visibleSections.alerts"
                class="fc-gallery__group"
                aria-labelledby="gallery-alerts"
            >
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        {{ catalog.alerts.component }}
                    </p>
                    <h2 id="gallery-alerts">
                        {{ catalog.alerts.title }}
                    </h2>
                    <p class="fc-gallery__description">
                        {{ catalog.alerts.description }}
                    </p>
                </header>
                <div
                    class="fc-gallery__preview"
                    role="region"
                    aria-labelledby="gallery-alerts"
                    tabindex="0"
                >
                    <FcPeriodTabs
                        v-model="alertMode"
                        :items="data.alerts.modes"
                        label="항공편 알림 예시"
                    />
                    <FcAlertSettings
                        :key="alertMode"
                        :mode="alertMode"
                        v-bind="data.alerts.previews[alertMode]"
                        :options="
                            alertMode === 'mine'
                                ? data.myAlertOptions
                                : data.friendAlertOptions
                        "
                        :friend-name="data.friend.friendName"
                        :friend-email="data.friend.friendEmail"
                        :initial-shared="data.alerts.shared"
                        :initial-selected="data.alerts.selected"
                    />
                </div>
            </section>
            <section
                v-show="visibleSections.sync"
                class="fc-gallery__group"
                aria-labelledby="gallery-sync"
            >
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        {{ catalog.sync.component }}
                    </p>
                    <h2 id="gallery-sync">
                        {{ catalog.sync.title }}
                    </h2>
                    <p class="fc-gallery__description">
                        {{ catalog.sync.description }}
                    </p>
                </header>
                <div
                    class="fc-gallery__preview"
                    role="region"
                    aria-labelledby="gallery-sync"
                    tabindex="0"
                >
                    <FcCalendarSync
                        :calendars="data.calendarSync.calendars"
                        :settings="data.calendarSync"
                    />
                </div>
            </section>
            <section
                v-show="visibleSections.settings"
                class="fc-gallery__group"
                aria-labelledby="gallery-settings"
            >
                <header class="fc-gallery__group-heading">
                    <p class="fc-gallery__component-name">
                        {{ catalog.settings.component }}
                    </p>
                    <h2 id="gallery-settings">
                        {{ catalog.settings.title }}
                    </h2>
                    <p class="fc-gallery__description">
                        {{ catalog.settings.description }}
                    </p>
                </header>
                <div
                    class="fc-gallery__preview"
                    role="region"
                    aria-labelledby="gallery-settings"
                    tabindex="0"
                >
                    <FcSettingsMenu v-bind="data.settings" />
                </div>
            </section>
        </div>
    </article>
</template>
