<script setup>
import FcIcon from "./FcIcon.vue";
import planeIcon from "../../assets/icons/lucide/plane.svg";
import { ref } from "vue";
import FcPeriodTabs from "./FcPeriodTabs.vue";

const props = defineProps({
    aircraft: { type: Object, required: true },
    showPeriod: { type: Boolean, default: true },
    showAge: { type: Boolean, default: true },
    showAgeTitle: { type: Boolean, default: true },
    showTail: { type: Boolean, default: true },
    showOverview: { type: Boolean, default: true },
});
const period = ref(props.aircraft.periods[0]);
</script>

<template>
    <div class="fc-aircraft-stats">
        <FcPeriodTabs
            v-if="showPeriod"
            v-model="period"
            :items="aircraft.periods"
        />
        <template v-if="showOverview">
            <div class="fc-aircraft-stats__numbers">
                <div>
                    <span>Total Aircraft</span
                    ><strong>{{ aircraft.total }}</strong
                    ><small>{{ aircraft.manufacturer }}</small>
                </div>
                <div>
                    <span>Newest Aircraft</span
                    ><strong>{{ aircraft.newest.age }}</strong
                    ><small>{{ aircraft.newest.model }}</small>
                </div>
                <div>
                    <span>Oldest Aircraft</span
                    ><strong>{{ aircraft.oldest.age }}</strong
                    ><small>{{ aircraft.oldest.model }}</small>
                </div>
            </div>
            <h3>Most flown aircraft</h3>
            <div class="fc-aircraft-stats__featured">
                <strong>{{ aircraft.mostFlown }}</strong
                ><span>{{ aircraft.summary }}</span>
                <div>
                    <FcIcon :src="planeIcon" />
                </div>
            </div>
        </template>
        <template v-if="showAge">
            <h3 v-if="showAgeTitle">Aircraft Age</h3>
            <p>{{ aircraft.median }} <small>median age</small></p>
            <div class="fc-aircraft-stats__ages">
                <div v-for="age in aircraft.ages" :key="age.label">
                    <i :style="{ height: `${age.value * 5}px` }"></i
                    ><span>{{ age.label }}</span>
                </div>
            </div>
            <div class="fc-aircraft-stats__cards">
                <div>
                    <strong>Newest Aircraft</strong
                    ><b>{{ aircraft.newest.age }} old</b
                    ><span>{{ aircraft.newest.date }}</span>
                </div>
                <div>
                    <strong>Oldest Aircraft</strong
                    ><b>{{ aircraft.oldest.age }} old</b
                    ><span>{{ aircraft.oldest.date }}</span>
                </div>
            </div>
        </template>
        <template v-if="showTail">
            <h3>Frequented Tail No.</h3>
            <p>{{ aircraft.tailFlights }} flights · {{ aircraft.tail }}</p>
        </template>
    </div>
</template>
