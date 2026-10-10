<template>
    <Teleport defer to="#main-content">
        <div class="booking-dialog" @click.self="close" @keydown="handleKeydown">
            <section ref="dialog" class="booking-dialog__panel" role="dialog" aria-modal="true"
                aria-labelledby="booking-title" tabindex="-1">
                <h2 id="booking-title" class="sr-only">
                    Edit flight information
                </h2>
                <button type="button" class="booking-dialog__close" aria-label="Close booking editor" @click="close">
                    ×
                </button>
                <FcPasteField v-model="booking.code" label="Booking Code" :placeholder="pageData.bookingCode"
                    paste-label="PASTE" :sample-value="pageData.bookingCode" />
                <label class="booking-dialog__label" for="flight-seat">
                    Seat
                </label>
                <BaseInput id="flight-seat" v-model="booking.seat" class="frame-page__input"
                    :placeholder="pageData.seatPlaceholder" />
                <FcTabItem v-model="booking.position" class="booking-dialog__choices" label="Seat position"
                    :items="pageData.positions" :icon="chipIcon" size="md" variant="stroke" />
                <h3 class="booking-dialog__label">Class</h3>
                <FcTabItem v-model="booking.cabin" class="booking-dialog__choices" label="Travel class"
                    :items="pageData.cabins" :icon="chipIcon" size="md" variant="stroke" />
                <h3 class="booking-dialog__label">Reason</h3>
                <FcTabItem v-model="booking.reason" class="booking-dialog__choices" label="Travel reason"
                    :items="pageData.reasons" :icon="chipIcon" size="md" variant="stroke" />
                <button type="button" class="frame-page__primary" @click="close">
                    Done
                </button>
            </section>
        </div>
    </Teleport>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from "vue";

import { useRoute, useRouter } from "vue-router";

import BaseInput from "../component/base/BaseInput.vue";
import FcPasteField from "../component/fc/FcPasteField.vue";
import FcTabItem from "../component/fc/FcTabItem.vue";

import chipIcon from "../assets/icons/lucide/square.svg";

import "../assets/scss/component/fc/FcIcon.scss";
import "../assets/scss/component/fc/FcTabItem.scss";
import "../assets/scss/component/fc/FcPasteField.scss";
import "../assets/scss/pages/FlightBookingPage.scss";

// 이 페이지에서 사용하는 예제 JSON 데이터입니다.
// prettier-ignore
const pageData = {
    "bookingCode": "ABC123",
    "seatPlaceholder": "32K",
    "positions": ["Aisle", "Middle", "Window", "Pilot", "Captain", "Jumpseat"],
    "cabins": ["Economy", "Premium Economy", "Business", "First Class"],
    "reasons": ["Personal", "Business", "Crew"]
};

const booking = defineModel({ type: Object, required: true });
const route = useRoute();
const router = useRouter();
const dialog = ref(null);
const previousFocus = document.activeElement;

function close() {
    router.push({
        name: "flight-detail",
        params: { id: route.params.id },
        query: route.query,
    });
}

function handleKeydown(event) {
    if (event.key === "Escape") close();
    if (event.key !== "Tab") return;
    const controls = [
        ...dialog.value.querySelectorAll(
            'button, input, a[href], [tabindex="0"]',
        ),
    ];
    const first = controls[0];
    const last = controls.at(-1);
    if (
        event.shiftKey &&
        (document.activeElement === first ||
            document.activeElement === dialog.value)
    ) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

onMounted(async () => {
    await nextTick();
    dialog.value.focus();
});
onUnmounted(() => previousFocus?.focus());
</script>
