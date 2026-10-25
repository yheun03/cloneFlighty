<template>
    <section class="frame-page friends-page">
        <h1 class="frame-page__title">{{ $t("Flighty Friends") }}</h1>
        <p class="frame-page__lead">
            {{
                $t(
                    "Share upcoming flights among friends and family. Invite new friends, set custom alerts, and control access here.",
                )
            }}
        </p>
        <div class="friends-page__list">
            <BaseListRow v-for="friend in pageData.friends" :key="friend.id" :title="$t(friend.title)"
                :subtitle="friend.email" :image="friend.profile" type="profile" :translate-subtitle="false"
                @click="openFriend(friend)" />
            <BaseListRow :title="$t('Invite a Friend')" accent @click="inviting = !inviting" />
        </div>
        <form v-if="inviting" class="friends-page__invite" @submit.prevent="inviteFriend">
            <label for="friend-email">{{ $t("Friend’s email") }}</label>
            <BaseInput id="friend-email" v-model="email" class="frame-page__input" type="email"
                :placeholder="$t('friend@example.com')" required />
            <BaseButton :label="$t('Prepare Invitation')" variant="text" tone="primary" @click="inviteFriend" />
        </form>
        <p v-if="message" class="frame-page__note" role="status">
            {{ $t(message) }}
        </p>
    </section>
</template>

<script setup>
import { ref } from "vue";

import { useRoute, useRouter } from "vue-router";

import BaseInput from "../component/base/BaseInput.vue";
import BaseButton from "../component/base/BaseButton.vue";
import BaseListRow from "../component/base/BaseListRow.vue";
import pageData from "../data/pages/friends.json";

import "../assets/scss/component/base/BaseButton.scss";
import "../assets/scss/component/base/BaseIcon.scss";
import "../assets/scss/component/base/BaseListRow.scss";
import "../assets/scss/pages/page_friends.scss";

const route = useRoute();
const router = useRouter();
const inviting = ref(false);
const email = ref(pageData.email);
const message = ref("");

function openFriend(friend) {
    router.push({
        name: "friend-detail",
        params: { id: friend.id },
        query: route.query,
    });
}

function inviteFriend() {
    message.value = pageData.invitationMessage;
    inviting.value = false;
    email.value = "";
}
</script>
