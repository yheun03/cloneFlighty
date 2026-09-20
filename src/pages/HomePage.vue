<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseInput from '../component/BaseInput.vue'

const airports = JSON.parse(document.querySelector('#airports').textContent)
const route = useRoute()
const router = useRouter()
const from = ref(typeof route.query.from === 'string' ? route.query.from : 'ICN')
const to = ref(typeof route.query.to === 'string' ? route.query.to : 'SFO')
const message = ref('')
const normalize = (value) => value.trim().toUpperCase()

async function paste(field) {
    try {
        const target = field === 'from' ? from : to
        target.value = normalize(await navigator.clipboard.readText()).slice(0, 3)
        message.value = ''
    } catch {
        message.value = '클립보드를 읽을 수 없습니다.'
    }
}

async function copy(value) {
    try {
        await navigator.clipboard.writeText(value)
        message.value = '복사했습니다.'
    } catch {
        message.value = '클립보드에 복사할 수 없습니다.'
    }
}

function showMap() {
    const start = normalize(from.value)
    const end = normalize(to.value)
    if (!airports[start] || !airports[end]) {
        message.value = '등록된 공항 코드를 입력해 주세요.'
        return
    }
    router.push({ name: 'map', query: { from: start, to: end } })
}
</script>

<template>
    <section>
        <h1>어디로 날아가나요?</h1>
        <p>공항 코드 두 개를 입력해 경로를 확인하세요.</p>

        <form @submit.prevent="showMap">
            <label for="from">출발 공항</label>
            <div class="field">
                <BaseInput id="from" v-model="from" maxlength="3" placeholder="ICN" />
                <button type="button" @click="paste('from')">붙여넣기</button>
                <button type="button" @click="copy(from)">복사</button>
            </div>

            <label for="to">도착 공항</label>
            <div class="field">
                <BaseInput id="to" v-model="to" maxlength="3" placeholder="SFO" />
                <button type="button" @click="paste('to')">붙여넣기</button>
                <button type="button" @click="copy(to)">복사</button>
            </div>

            <button class="primary" type="submit">경로 보기</button>
        </form>
        <p class="hint">사용 가능: {{ Object.keys(airports).join(', ') }}</p>
        <p v-if="message" class="message">{{ message }}</p>
    </section>
</template>
