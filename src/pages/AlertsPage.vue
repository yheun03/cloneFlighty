<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import FcAlertSettings from "../component/fc/FcAlertSettings.vue";
import FcToggleSwitch from "../component/fc/FcToggleSwitch.vue";
import FcIcon from "../component/fc/FcIcon.vue";
import bellIcon from "../assets/icons/lucide/bell.svg";
import pageData from "./data/AlertsPage.json";

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
            <template v-if="mode === 'friends'" #intro>
                <h3 class="alerts-page__intro">
                    Customize this per friend in Flighty Friends.
                </h3>
            </template>
            <template v-if="mode === 'friend'" #after-options>
                <div class="alerts-page__new-flights">
                    <FcIcon :src="bellIcon" />
                    <strong>New Flights</strong>
                    <FcToggleSwitch v-model="newFlights" label="New Flights" />
                </div>
                <p class="frame-page__note">
                    Receive an alert when this friend adds new flights to
                    Flighty
                </p>
            </template>
        </FcAlertSettings>
        <p
            v-if="mode === 'friends'"
            class="frame-page__note alerts-page__footer"
        >
            To adjust Live Activity preferences for Friends’ Flights, visit
            Setting &gt; Live Activities
        </p>
        <p v-if="message" class="frame-page__note" role="status">
            {{ message }}
        </p>
    </section>
</template>
