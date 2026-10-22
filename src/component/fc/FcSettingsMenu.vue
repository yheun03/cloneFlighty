<script setup>
import BaseIcon from "../base/BaseIcon.vue";
import BaseListRow from "../base/BaseListRow.vue";

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
        <h2>{{ $t("Settings") }}</h2>
        <button
            class="fc-settings__pro"
            type="button"
            @click="$emit('select', 'pro')"
        >
            <b>{{ $t("PRO") }}</b>
            <span>
                <strong>{{ $t(membership.title) }}</strong>
                <small>{{ $t(membership.status) }}</small>
            </span>
            <BaseIcon :src="nextIcon" />
        </button>
        <div
            v-for="group in groups"
            :key="group.label"
            class="fc-settings__group"
        >
            <h3>{{ $t(group.label) }}</h3>
            <div class="fc-settings__items">
                <BaseListRow
                    v-for="item in group.items"
                    :key="item.title"
                    :title="$t(item.title)"
                    :icon="item.icon"
                    @click="$emit('select', item)"
                />
            </div>
        </div>
    </div>
</template>
