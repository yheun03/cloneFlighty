<script setup>
import FcIcon from './FcIcon.vue'
import airlineIcon from '../assets/icons/lucide/circle.svg'
import departureIcon from '../assets/icons/lucide/plane-takeoff.svg'
import arrivalIcon from '../assets/icons/lucide/plane-landing.svg'
import routeIcon from '../assets/icons/lucide/arrow-right.svg'
defineProps({
    variant: { type: String, default: 'upcoming' },
    airline: { type: String, default: 'KE' },
    flight: { type: String, default: '24' },
    title: { type: String, default: 'San Francisco to Seoul' },
    date: { type: String, default: 'Sat, 20 Jun' },
    departure: { type: String, default: 'ICN 09:25' },
    arrival: { type: String, default: 'YNJ 10:50⁺¹' },
    days: { type: Number, default: 21 }
})
defineEmits(['remove'])
</script>

<template>
    <div class="fc-flight-list" :class="`fc-flight-list--${variant}`">
        <div v-if="variant === 'upcoming'" class="fc-flight-list__days"><strong>{{ days }}</strong><small>DAYS</small>
        </div>
        <div v-else class="fc-flight-list__logo">
            <FcIcon :src="airlineIcon" />
        </div>
        <div class="fc-flight-list__content">
            <div class="fc-flight-list__meta"><span>{{ airline }} {{ flight }}<template v-if="variant === 'header'"> ·
                        WED, 28
                        JAN</template><template v-else-if="variant === 'history'"> &nbsp; {{ departure.split(' ')[0] }}
                        <FcIcon :src="routeIcon" /> {{
                            arrival.split(' ')[0] }}
                    </template></span><span v-if="variant !== 'header'">{{ date
                    }}</span></div>
            <strong>{{ title }}</strong>
            <div v-if="variant === 'upcoming'" class="fc-flight-list__sub">
                <FcIcon :src="departureIcon" /> {{ departure }}
                &nbsp;&nbsp;
                <FcIcon :src="arrivalIcon" /> {{ arrival
                }}
            </div>
            <div v-else-if="variant === 'history'" class="fc-flight-list__sub"><span>2h 50m</span><span>2h 50m</span>
            </div>
        </div>
        <button v-if="variant === 'header'" type="button" class="fc-flight-list__close" aria-label="닫기"
            @click="$emit('remove')">×</button>
    </div>
</template>
