<script setup>
import { reactive, ref } from 'vue'
import ToggleSwitch from './ToggleSwitch.vue'

const props = defineProps({
    mode: { type: String, default: 'mine' },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    options: { type: Array, required: true },
    friendName: { type: String, default: '전승민' },
    friendEmail: { type: String, default: 'jsm5401@gmail.com' }
})
const shared = ref(true)
const selected = ref('Basics')
const options = reactive(props.options.map((option) => ({ ...option })))
</script>

<template>
    <div class="fc-alerts">
        <template v-if="mode === 'friend'">
            <div class="fc-alerts__friend"><span></span>
                <div><strong>{{ friendName }}</strong><small>{{ friendEmail }}</small></div>
            </div>
            <div class="fc-alerts__share">Share My Flights
                <ToggleSwitch v-model="shared" label="Share My Flights" />
            </div>
        </template>
        <h2>{{ title }}</h2>
        <p>{{ desc }}</p>
        <div v-for="option in options" :key="option.title" class="fc-alerts__option"
            :class="{ 'is-selected': mode === 'friend' && selected === option.title }"
            @click="mode === 'friend' && (selected = option.title)">
            <div><span :style="{ color: option.color }">{{ option.icon }}</span><strong>{{ option.title }}</strong>
                <ToggleSwitch v-if="mode === 'mine'" v-model="option.enabled" :label="option.title" @click.stop />
            </div>
            <p>{{ option.desc }}</p>
        </div>
        <button v-if="mode === 'friend'" type="button" class="fc-alerts__remove">Remove Friend</button>
    </div>
</template>
