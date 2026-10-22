<template>
    <section class="frame-page alerts-page">
        <FcAlertSettings
            :key="route.name + String(route.params.id || '')"
            :mode="mode"
            v-bind="alert"
            :initial-shared="pageData.shared"
            :initial-selected="pageData.selected"
            :friend-name="friend.friendName"
            :friend-email="friend.friendEmail"
            @remove="removeFriend"
        >
            <template
                v-if="mode === 'friends'"
                #intro
            >
                <h3 class="alerts-page__intro">
                    {{ $t("Customize this per friend in Flighty Friends.") }}
                </h3>
            </template>
            <template
                v-if="mode === 'friend'"
                #after-options
            >
                <div class="alerts-page__new-flights">
                    <BaseIcon :src="bellIcon" />
                    <strong>{{ $t("New Flights") }}</strong>
                    <BaseToggleSwitch
                        v-model="newFlights"
                        :label="$t('New Flights')"
                    />
                </div>
                <p class="frame-page__note">
                    {{
                        $t(
                            "Receive an alert when this friend adds new flights to Flighty",
                        )
                    }}
                </p>
            </template>
        </FcAlertSettings>
        <p
            v-if="mode === 'friends'"
            class="frame-page__note alerts-page__footer"
        >
            {{
                $t(
                    "To adjust Live Activity preferences for Friends’ Flights, visit Setting > Live Activities",
                )
            }}
        </p>
        <p
            v-if="message"
            class="frame-page__note"
            role="status"
        >
            {{ $t(message) }}
        </p>
    </section>
</template>

<script setup>
import { computed, ref } from "vue";

import { useRoute } from "vue-router";

import FcAlertSettings from "../component/fc/FcAlertSettings.vue";
import BaseToggleSwitch from "../component/base/BaseToggleSwitch.vue";
import BaseIcon from "../component/base/BaseIcon.vue";

import bellIcon from "../assets/figma/alert-off.svg";

import "../assets/scss/component/base/BaseIcon.scss";
import "../assets/scss/component/base/BaseToggleSwitch.scss";
import "../assets/scss/component/fc/FcAlertSettings.scss";
import "../assets/scss/pages/page_alerts.scss";

// 이 페이지에서 사용하는 예제 JSON 데이터입니다.
// prettier-ignore
const pageData = {
    "newFlights": true,
    "shared": true,
    "selected": "Basics",
    "mine": {
        "title": "My Flight Alerts",
        "desc": "Pick the notification types you receive for your flights.",
        "options": [
            {
                "icon": "alert-basics",
                "title": "Basics",
                "desc": "The most critical alerts like gate changes, delays, & Cancellations.",
                "color": "var(--fc-blue, #087bfa)",
                "enabled": false
            },
            {
                "icon": "alert-check",
                "title": "Above & Beyond",
                "desc": "Want more? Get alerts on inbound aircraft status, connection assistance, and aircraft changes",
                "color": "var(--fc-success, #00ae70)",
                "enabled": true
            },
            {
                "icon": "alert-map",
                "title": "Flight Plans",
                "desc": "Get a map of the flight path when the pilot files it with authorities.",
                "color": "#ffca2d",
                "enabled": false
            },
            {
                "icon": "alert-landing",
                "title": "Arrival Information",
                "desc": "Get alerts for landing, gate arrival, and baggage claim.",
                "color": "#ff9d20",
                "enabled": false
            }
        ]
    },
    "friends": {
        "title": "Friends’ Flight Alerts",
        "desc": "Pick the default notifications you receive about friends’ flights.",
        "options": [
            {
                "icon": "alert-off",
                "title": "None",
                "desc": "No alerts please. I’ll just view their flights in the app.",
                "color": "var(--fc-danger, #ff3b30)"
            },
            {
                "icon": "alert-landed",
                "title": "Just Landed",
                "desc": "Only notify me when they land.",
                "color": "var(--fc-success, #00ae70)"
            },
            {
                "icon": "alert-bell",
                "title": "Basics",
                "desc": "Add alerts for major disruptions, takeoff, 1h until arrival, and on morning of travel.",
                "color": "var(--fc-blue, #087bfa)"
            },
            {
                "icon": "alert-ring",
                "title": "Everything",
                "desc": "Every alert. Check-in, gate change, disruptions, landing, baggage, etc",
                "color": "#ff9d20"
            }
        ]
    },
    "friend": {
        "title": "Customize Alerts",
        "desc": "Customize this per friend in Flighty Friends.",
        "options": [
            {
                "icon": "alert-off",
                "title": "None",
                "desc": "No alerts please. I’ll just view their flights in the app.",
                "color": "var(--fc-danger, #ff3b30)"
            },
            {
                "icon": "alert-landed",
                "title": "Just Landed",
                "desc": "Only notify me when they land.",
                "color": "var(--fc-success, #00ae70)"
            },
            {
                "icon": "alert-bell",
                "title": "Basics",
                "desc": "Add alerts for major disruptions, takeoff, 1h until arrival, and on morning of travel.",
                "color": "var(--fc-blue, #087bfa)"
            },
            {
                "icon": "alert-ring",
                "title": "Everything",
                "desc": "Every alert. Check-in, gate change, disruptions, landing, baggage, etc",
                "color": "#ff9d20"
            }
        ]
    },
    "profiles": {
        "1": {
            "friendName": "Kimhj",
            "friendEmail": "kimhj@example.com"
        },
        "2": {
            "friendName": "Kimhj",
            "friendEmail": "kimhj2@example.com"
        }
    },
    "removeMessage": "Remove Friend preview."
};

const route = useRoute();
const mode = computed(() => route.meta.alertMode);
const newFlights = ref(pageData.newFlights);
const message = ref("");
const alert = computed(() => pageData[mode.value]);
const friend = computed(
    () => pageData.profiles[String(route.params.id)] || pageData.profiles["1"],
);

function removeFriend() {
    message.value = pageData.removeMessage;
}
</script>
