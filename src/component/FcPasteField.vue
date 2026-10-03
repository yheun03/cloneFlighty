<script setup>
import FcIcon from './FcIcon.vue'
import pasteIcon from '../assets/icons/lucide/clipboard-paste.svg'
import { ref, useId } from 'vue'
import BaseInput from './BaseInput.vue'

defineProps({ label: { type: String, default: 'Reason' } })
const value = defineModel({ type: String, default: '' })
const error = ref('')
const inputId = useId()

async function paste() {
    try {
        value.value = await navigator.clipboard.readText()
        error.value = ''
    } catch {
        error.value = '클립보드를 읽을 수 없습니다.'
    }
}
</script>

<template>
    <div class="fc-paste-field">
        <label :for="inputId">{{ label }}</label>
        <div><span aria-hidden="true">
                <FcIcon :src="pasteIcon" />
            </span>
            <BaseInput :id="inputId" v-model="value" :aria-describedby="error ? `${inputId}-error` : undefined"
                :aria-invalid="Boolean(error)" placeholder="PASTE" /><button type="button"
                @click="paste">붙여넣기</button>
        </div>
        <small v-if="error" :id="`${inputId}-error`" role="alert">{{ error }}</small>
    </div>
</template>
