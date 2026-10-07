<script setup>
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseInput from "../component/base/BaseInput.vue";
import FcPasteField from "../component/fc/FcPasteField.vue";
import FcChoiceChip from "../component/fc/FcChoiceChip.vue";
import chipIcon from "../assets/icons/lucide/square.svg";
import pageData from "./data/FlightBookingPage.json";

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

<template>
    <Teleport defer to="#main-content">
        <div
            class="booking-dialog"
            @click.self="close"
            @keydown="handleKeydown"
        >
            <section
                ref="dialog"
                class="booking-dialog__panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="booking-title"
                tabindex="-1"
            >
                <h2 id="booking-title" class="sr-only">
                    Edit flight information
                </h2>
                <button
                    type="button"
                    class="booking-dialog__close"
                    aria-label="Close booking editor"
                    @click="close"
                >
                    ×
                </button>
                <FcPasteField
                    v-model="booking.code"
                    label="Booking Code"
                    :placeholder="pageData.bookingCode"
                    paste-label="PASTE"
                    :sample-value="pageData.bookingCode"
                />
                <label class="booking-dialog__label" for="flight-seat"
                    >Seat</label
                >
                <BaseInput
                    id="flight-seat"
                    v-model="booking.seat"
                    class="frame-page__input"
                    :placeholder="pageData.seatPlaceholder"
                />
                <div
                    class="booking-dialog__choices"
                    role="group"
                    aria-label="Seat position"
                >
                    <FcChoiceChip
                        v-for="item in pageData.positions"
                        :key="item"
                        :label="item"
                        :icon="chipIcon"
                        :active="booking.position === item"
                        filled
                        @click="booking.position = item"
                    />
                </div>
                <h3 class="booking-dialog__label">Class</h3>
                <div
                    class="booking-dialog__choices"
                    role="group"
                    aria-label="Travel class"
                >
                    <FcChoiceChip
                        v-for="item in pageData.cabins"
                        :key="item"
                        :label="item"
                        :icon="chipIcon"
                        :active="booking.cabin === item"
                        filled
                        @click="booking.cabin = item"
                    />
                </div>
                <h3 class="booking-dialog__label">Reason</h3>
                <div
                    class="booking-dialog__choices"
                    role="group"
                    aria-label="Travel reason"
                >
                    <FcChoiceChip
                        v-for="item in pageData.reasons"
                        :key="item"
                        :label="item"
                        :icon="chipIcon"
                        :active="booking.reason === item"
                        filled
                        @click="booking.reason = item"
                    />
                </div>
                <button
                    type="button"
                    class="frame-page__primary"
                    @click="close"
                >
                    Done
                </button>
            </section>
        </div>
    </Teleport>
</template>
