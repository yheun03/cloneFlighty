<script setup>
import { computed } from "vue";

import BaseButton from "./BaseButton.vue";
import FcIcon from "../fc/FcIcon.vue";

defineOptions({ inheritAttrs: false });

const props = defineProps({
    type: { type: String, default: "text" },
    placeholder: { type: String, default: "" },
    icon: { type: String, default: "" },
    actionLabel: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["action"]);
const value = defineModel({ type: String, default: "" });
const isComposed = computed(() => Boolean(props.icon || props.actionLabel));
</script>

<template>
    <input v-if="!isComposed" v-model="value" v-bind="$attrs" class="fc-input fc-input--plain" :type="type"
        :placeholder="placeholder" :disabled="disabled" />
    <div v-else class="fc-input fc-input--composed" :class="{ 'is-disabled': disabled }">
        <span v-if="icon" class="fc-input__icon">
            <FcIcon :src="icon" />
        </span>
        <input v-model="value" v-bind="$attrs" class="fc-input__control" :type="type" :placeholder="placeholder"
            :disabled="disabled" />
        <BaseButton v-if="actionLabel" :label="actionLabel" size="sm" variant="fill" tone="gray" :disabled="disabled"
            @click="emit('action')" />
    </div>
</template>
