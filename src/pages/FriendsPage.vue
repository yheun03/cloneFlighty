<script setup>
import { ref } from "vue";

import { useRoute, useRouter } from "vue-router";

import BaseInput from "../component/base/BaseInput.vue";
import BaseButton from "../component/base/BaseButton.vue";
import FcListRow from "../component/fc/FcListRow.vue";

import pageData from "./data/FriendsPage.json";

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

<template>
    <section class="frame-page friends-page">
        <h1 class="frame-page__title">Flighty Friends</h1>
        <p class="frame-page__lead">
            Share upcoming flights among friends and family. Invite new friends,
            set custom alerts, and control access here.
        </p>
        <div class="friends-page__list">
            <FcListRow
                v-for="friend in pageData.friends"
                :key="friend.id"
                :title="friend.title"
                @click="openFriend(friend)"
            />
            <FcListRow
                title="Invite a Friend"
                accent
                @click="inviting = !inviting"
            />
        </div>
        <form
            v-if="inviting"
            class="friends-page__invite"
            @submit.prevent="inviteFriend"
        >
            <label for="friend-email">Friend’s email</label>
            <BaseInput
                id="friend-email"
                v-model="email"
                class="frame-page__input"
                type="email"
                placeholder="friend@example.com"
                required
            />
            <BaseButton
                label="Prepare Invitation"
                @click="inviteFriend"
            />
        </form>
        <p
            v-if="message"
            class="frame-page__note"
            role="status"
        >
            {{ message }}
        </p>
    </section>
</template>
