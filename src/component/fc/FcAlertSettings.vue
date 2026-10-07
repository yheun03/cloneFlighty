<script setup>
import FcIcon from "./FcIcon.vue";
import { reactive, ref } from "vue";
import FcToggleSwitch from "./FcToggleSwitch.vue";

const props = defineProps({
    mode: { type: String, default: "mine" },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    options: { type: Array, required: true },
    initialShared: { type: Boolean, default: false },
    initialSelected: { type: String, default: "" },
    friendName: { type: String, default: "" },
    friendEmail: { type: String, default: "" },
});
defineEmits(["remove"]);
const shared = ref(props.initialShared);
const selected = ref(props.initialSelected);
const options = reactive(props.options.map((option) => ({ ...option })));
</script>

<template>
    <div class="fc-alerts">
        <template v-if="mode === 'friend'">
            <div class="fc-alerts__friend">
                <span></span>
                <div>
                    <strong>{{ friendName }}</strong
                    ><small>{{ friendEmail }}</small>
                </div>
            </div>
            <div class="fc-alerts__share">
                Share My Flights
                <FcToggleSwitch v-model="shared" label="Share My Flights" />
            </div>
        </template>
        <h2>{{ title }}</h2>
        <p>{{ desc }}</p>
        <slot name="intro"></slot>
        <div
            :role="mode !== 'mine' ? 'radiogroup' : undefined"
            :aria-label="mode !== 'mine' ? title : undefined"
        >
            <div
                v-for="option in options"
                :key="option.title"
                class="fc-alerts__option"
                :class="{
                    'is-selected': mode !== 'mine' && selected === option.title,
                }"
                :role="mode !== 'mine' ? 'radio' : undefined"
                :tabindex="mode !== 'mine' ? 0 : undefined"
                :aria-checked="
                    mode !== 'mine' ? selected === option.title : undefined
                "
                @keydown.enter.prevent="
                    mode !== 'mine' && (selected = option.title)
                "
                @keydown.space.prevent="
                    mode !== 'mine' && (selected = option.title)
                "
                @click="mode !== 'mine' && (selected = option.title)"
            >
                <div>
                    <span :style="{ color: option.color }">
                        <FcIcon :src="option.icon" /> </span
                    ><strong>{{ option.title }}</strong>
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
