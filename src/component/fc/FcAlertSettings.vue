<script setup>
import { computed, reactive, ref } from "vue";

import FcIcon from "./FcIcon.vue";
import FcToggleSwitch from "./FcToggleSwitch.vue";

const props = defineProps({
    mode: {
        type: String,
        default: "mine",
        validator: (value) => ["mine", "friends", "friend"].includes(value),
    },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    // 알림 항목: { title, desc, icon, color, enabled }
    options: { type: Array, required: true },
    // 최초 표시 상태입니다. 선택과 토글은 컴포넌트 내부에서 변경합니다.
    initialShared: { type: Boolean, default: false },
    initialSelected: { type: String, default: "" },
    friendName: { type: String, default: "" },
    friendEmail: { type: String, default: "" },
});

defineEmits(["remove"]);

const shared = ref(props.initialShared);
const selected = ref(props.initialSelected);
const alertOptions = reactive(props.options.map((option) => ({ ...option })));

const isRadioMode = computed(() => props.mode !== "mine");

function selectOption(option) {
    if (isRadioMode.value) selected.value = option.title;
}
</script>

<template>
    <div class="fc-alerts">
        <template v-if="mode === 'friend'">
            <div class="fc-alerts__friend">
                <span></span>
                <div>
                    <strong>{{ friendName }}</strong>
                    <small>{{ friendEmail }}</small>
                </div>
            </div>
            <div class="fc-alerts__share">
                Share My Flights
                <FcToggleSwitch
                    v-model="shared"
                    label="Share My Flights"
                />
            </div>
        </template>
        <h2>{{ title }}</h2>
        <p>{{ desc }}</p>
        <slot name="intro"></slot>
        <div
            :role="isRadioMode ? 'radiogroup' : undefined"
            :aria-label="isRadioMode ? title : undefined"
        >
            <div
                v-for="option in alertOptions"
                :key="option.title"
                class="fc-alerts__option"
                :class="{
                    'is-selected': isRadioMode && selected === option.title,
                }"
                :role="isRadioMode ? 'radio' : undefined"
                :tabindex="isRadioMode ? 0 : undefined"
                :aria-checked="
                    isRadioMode ? selected === option.title : undefined
                "
                @keydown.enter.prevent="selectOption(option)"
                @keydown.space.prevent="selectOption(option)"
                @click="selectOption(option)"
            >
                <div>
                    <span :style="{ color: option.color }">
                        <FcIcon :src="option.icon" />
                    </span>
                    <strong>{{ option.title }}</strong>
                    <FcToggleSwitch
                        v-if="mode === 'mine'"
                        v-model="option.enabled"
                        :label="option.title"
                        @click.stop
                    />
                </div>
                <p>{{ option.desc }}</p>
            </div>
        </div>
        <slot name="after-options"></slot>
        <button
            v-if="mode === 'friend'"
            type="button"
            class="fc-alerts__remove"
            @click="$emit('remove')"
        >
            Remove Friend
        </button>
    </div>
</template>
