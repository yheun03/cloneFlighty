<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";

import BaseButton from "./BaseButton.vue";
import FcCalendarPicker from "../fc/FcCalendarPicker.vue";
import FcIcon from "../fc/FcIcon.vue";

defineOptions({ inheritAttrs: false });

const props = defineProps({
    type: { type: String, default: "text" },
    placeholder: { type: String, default: "" },
    icon: { type: String, default: "" },
    actionLabel: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    calendar: { type: Boolean, default: false },
    calendarOptions: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["action"]);
const value = defineModel({ type: String, default: "" });
const isComposed = computed(() => Boolean(props.icon || props.actionLabel));
const isCalendarOpen = ref(false);
const calendarAnchor = ref(null);
const calendarPopover = ref(null);
const calendarPosition = ref({ visibility: "hidden" });
let calendarResizeObserver;
const calendarIcon = computed(() => props.icon || "calendar-days");
const resolvedCalendarOptions = computed(() => {
    const matched = value.value.match(/^(\d{4})-(\d{2})-\d{2}$/);
    const today = new Date();

    return {
        ...props.calendarOptions,
        year:
            (matched ? Number(matched[1]) : null) ??
            props.calendarOptions.year ??
            today.getFullYear(),
        month:
            (matched ? Number(matched[2]) : null) ??
            props.calendarOptions.month ??
            today.getMonth() + 1,
    };
});

async function openCalendar() {
    if (props.disabled) return;

    isCalendarOpen.value = true;
    await nextTick();
    updateCalendarPosition();
}

function selectCalendarDate(date) {
    value.value = date;
    isCalendarOpen.value = false;
}

function updateCalendarPosition() {
    if (!calendarAnchor.value || !calendarPopover.value) return;

    const gap = 8;
    const viewportPadding = 16;
    const anchorRect = calendarAnchor.value.getBoundingClientRect();
    const popoverRect = calendarPopover.value.getBoundingClientRect();
    const width = Math.min(360, window.innerWidth - viewportPadding * 2);
    const left = Math.min(
        Math.max(anchorRect.left, viewportPadding),
        window.innerWidth - width - viewportPadding,
    );
    const hasBottomSpace =
        window.innerHeight - anchorRect.bottom >= popoverRect.height + gap;
    const top = hasBottomSpace
        ? anchorRect.bottom + gap
        : Math.max(viewportPadding, anchorRect.top - popoverRect.height - gap);

    calendarPosition.value = {
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        visibility: "visible",
    };
}

function closeCalendarOnOutside(event) {
    if (
        calendarAnchor.value?.contains(event.target) ||
        calendarPopover.value?.contains(event.target)
    ) {
        return;
    }

    isCalendarOpen.value = false;
}

function removeCalendarListeners() {
    calendarResizeObserver?.disconnect();
    calendarResizeObserver = undefined;
    window.removeEventListener("resize", updateCalendarPosition);
    window.removeEventListener("scroll", updateCalendarPosition, true);
    document.removeEventListener("pointerdown", closeCalendarOnOutside);
}

watch(isCalendarOpen, async (isOpen) => {
    if (!isOpen) {
        removeCalendarListeners();
        return;
    }

    calendarPosition.value = { visibility: "hidden" };
    await nextTick();
    updateCalendarPosition();
    calendarResizeObserver = new ResizeObserver(updateCalendarPosition);
    calendarResizeObserver.observe(calendarPopover.value);
    window.addEventListener("resize", updateCalendarPosition);
    window.addEventListener("scroll", updateCalendarPosition, true);
    document.addEventListener("pointerdown", closeCalendarOnOutside);
});

onBeforeUnmount(removeCalendarListeners);
</script>

<template>
    <div v-if="calendar" ref="calendarAnchor" class="fc-input-calendar" @keydown.esc="isCalendarOpen = false">
        <div class="fc-input fc-input--composed" :class="{ 'is-disabled': disabled }">
            <span class="fc-input__icon">
                <FcIcon :src="calendarIcon" />
            </span>
            <input v-model="value" v-bind="$attrs" class="fc-input__control" type="text" :placeholder="placeholder"
                :disabled="disabled" readonly aria-haspopup="dialog" :aria-expanded="isCalendarOpen"
                @click="openCalendar" @focus="openCalendar" />
        </div>
        <Teleport to=".app">
            <div v-if="isCalendarOpen" ref="calendarPopover" class="fc-input-calendar__popover"
                :style="calendarPosition" role="dialog" :aria-label="`${placeholder || '날짜'} 선택`"
                @keydown.esc="isCalendarOpen = false">
                <FcCalendarPicker :model-value="value" v-bind="resolvedCalendarOptions"
                    @update:model-value="selectCalendarDate" />
            </div>
        </Teleport>
    </div>
    <input v-else-if="!isComposed" v-model="value" v-bind="$attrs" class="fc-input fc-input--plain" :type="type"
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
