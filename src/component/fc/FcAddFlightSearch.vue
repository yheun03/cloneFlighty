<script setup>
import FcIcon from "./FcIcon.vue";
import nextIcon from "../../assets/icons/lucide/arrow-right.svg";
import { computed, ref, useId } from "vue";
import BaseInput from "../base/BaseInput.vue";

const query = defineModel({ type: String, default: "" });
const props = defineProps({
    items: { type: Array, required: true },
    placeholder: { type: String, default: "Korean Air, ICN, or KE123" },
    sectionLabel: { type: String, default: "" },
});
const emit = defineEmits(["select"]);
const selected = ref("");
const inputId = useId();
const filtered = computed(() =>
    props.items.filter((item) =>
        `${item.title} ${item.subtitle}`
            .toLowerCase()
            .includes(query.value.toLowerCase()),
    ),
);
</script>

<template>
    <div class="fc-search">
        <h2>Add Flight</h2>
        <label :for="inputId">Enter airline, airport, or flight</label>
        <BaseInput
            :id="inputId"
            v-model="query"
            type="search"
            autocomplete="off"
            :placeholder="placeholder"
        />
        <h3 v-if="sectionLabel" class="fc-search__section-label">
            {{ sectionLabel }}
        </h3>
        <button
            v-for="item in filtered"
            :key="item.title"
            type="button"
            class="fc-search__result"
            @click="
                selected = item.title;
                emit('select', item);
            "
        >
            <span class="fc-search__avatar">
                <FcIcon :src="item.avatar" /> </span
            ><span
                ><strong>{{ item.title }}</strong
                ><small>{{ item.subtitle }}</small></span
            ><span>
                <FcIcon :src="nextIcon" />
            </span>
        </button>
        <small v-if="selected" class="fc-search__selected" role="status"
            >{{ selected }} 선택됨</small
        >
    </div>
</template>
