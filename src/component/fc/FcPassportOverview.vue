<script setup>
import { ref } from "vue";

import FcIcon from "./FcIcon.vue";
import FcTabItem from "./FcTabItem.vue";

import planeIcon from "../../assets/icons/lucide/plane.svg";
import earthIcon from "../../assets/icons/lucide/earth.svg";

const props = defineProps({
    flights: { type: Number, required: true },
    distance: { type: String, required: true },
    flightTime: { type: String, required: true },
    airports: { type: Number, required: true },
    airlines: { type: Number, required: true },
    // 최근 항공편: { id, code, route, title, date }
    recent: { type: Array, default: () => [] },
    periods: { type: Array, required: true },
    mapFrom: { type: String, required: true },
    mapTo: { type: String, required: true },
    flags: { type: String, required: true },
    historyTitle: { type: String, required: true },
    historyCount: { type: String, required: true },
    // 표시할 요약 영역입니다.
    showPeriod: { type: Boolean, default: true },
    showMap: { type: Boolean, default: true },
    showHistory: { type: Boolean, default: true },
});

defineEmits(["select"]);

const period = ref(props.periods[0]);
</script>

<template>
    <div class="fc-passport">
        <FcTabItem v-if="showPeriod" v-model="period" :items="periods" />
        <div v-if="showMap" class="fc-passport__map">
            <span>{{ mapFrom }}</span>
            <span>
                <FcIcon :src="earthIcon" />
            </span>
            <span>{{ mapTo }}</span>
        </div>
        <div v-if="showMap" class="fc-passport__flags">
            {{ flags }}
        </div>
        <h2>MY FLIGHTY PASSPORT</h2>
        <small>PASSPORT · PASS · PASPORTE</small>
        <div class="fc-passport__numbers">
            <div>
                <span>FLIGHTS</span>
                <strong>{{ flights }}</strong>
            </div>
            <div>
                <span>FLIGHTS DISTANCE</span>
                <strong>{{ distance }}</strong>
            </div>
            <div>
                <span>FLIGHT TIME</span>
                <strong>{{ flightTime }}</strong>
            </div>
            <div>
                <span>AIRPORTS</span>
                <strong>{{ airports }}</strong>
            </div>
            <div>
                <span>AIRLINES</span>
                <strong>{{ airlines }}</strong>
            </div>
        </div>
        <template v-if="showHistory">
            <h3>
                {{ historyTitle }}
                <small>{{ historyCount }}</small>
            </h3>
            <button v-for="flight in recent" :key="flight.id" class="fc-passport__flight" type="button"
                @click="$emit('select', flight)">
                <span>
                    <FcIcon :src="planeIcon" />
                </span>
                <div>
                    <small>{{ flight.code }} &nbsp;{{ flight.route }}</small>
                    <strong>{{ flight.title }}</strong>
                </div>
                <small>{{ flight.date }}</small>
            </button>
        </template>
    </div>
</template>
