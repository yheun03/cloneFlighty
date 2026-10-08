<script setup>
import FcIcon from "./FcIcon.vue";

import nextIcon from "../../assets/icons/lucide/chevron-right.svg";

defineProps({
    // 메뉴 그룹: { label, items: [{ name, title, icon }] }
    groups: { type: Array, required: true },
    // 멤버십 안내: { title, status }
    membership: { type: Object, required: true },
});

defineEmits(["select"]);
</script>

<template>
    <div class="fc-settings">
        <h2>Settings</h2>
        <button
            class="fc-settings__pro"
            type="button"
            @click="$emit('select', 'pro')"
        >
            <b>PRO</b>
            <span>
                <strong>{{ membership.title }}</strong>
                <small>{{ membership.status }}</small>
            </span>
            <FcIcon :src="nextIcon" />
        </button>
        <div
            v-for="group in groups"
            :key="group.label"
            class="fc-settings__group"
        >
            <h3>{{ group.label }}</h3>
            <button
                v-for="item in group.items"
                :key="item.title"
                type="button"
                @click="$emit('select', item)"
            >
                <span><FcIcon :src="item.icon" /></span>
                {{ item.title }}
                <b>
                    <FcIcon :src="nextIcon" />
                </b>
            </button>
        </div>
    </div>
</template>
