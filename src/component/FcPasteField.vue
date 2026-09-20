<script setup>
import FcIcon from './FcIcon.vue'
import pasteIcon from '../assets/icons/lucide/clipboard-paste.svg'
import { ref } from 'vue'
import BaseInput from './BaseInput.vue'

defineProps({ label: { type: String, default: 'Reason' } })
const value = defineModel({ type: String, default: '' })
const error = ref('')

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
        <label>{{ label }}</label>
        <div><span aria-hidden="true">
                <FcIcon :src="pasteIcon" />
            </span>
            <BaseInput v-model="value" :aria-label="label" placeholder="PASTE" /><button type="button"
                @click="paste">PASTE</button>
        </div>
        <small v-if="error">{{ error }}</small>
    </div>
</template>
