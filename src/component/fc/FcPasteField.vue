<script setup>
import { useId } from "vue";

import FcIcon from "./FcIcon.vue";
import BaseInput from "../base/BaseInput.vue";

import pasteIcon from "../../assets/icons/lucide/clipboard-paste.svg";

const props = defineProps({
    sampleValue: { type: String, default: "" },
    label: { type: String, default: "Reason" },
    placeholder: { type: String, default: "PASTE" },
    pasteLabel: { type: String, default: "붙여넣기" },
});

const value = defineModel({ type: String, default: "" });

const inputId = useId();

function paste() {
    value.value = props.sampleValue;
}
</script>

<template>
    <div class="fc-paste-field">
        <label :for="inputId">{{ label }}</label>
        <div>
            <span aria-hidden="true">
                <FcIcon :src="pasteIcon" />
            </span>
            <BaseInput
                :id="inputId"
                v-model="value"
                :placeholder="placeholder"
            />
            <button
                type="button"
                @click="paste"
            >
                {{ pasteLabel }}
            </button>
        </div>
    </div>
</template>
