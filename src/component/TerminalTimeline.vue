<script setup>
defineProps({
    arrival: { type: String, default: '05:20' },
    departure: { type: String, default: '09:50' },
    terminal: { type: String, default: 'Terminal Main' },
    gate: { type: String, default: 'A4' }
})
</script>

<template>
    <div class="fc-terminal">
        <div class="fc-terminal__stop"><b>{{ gate }}</b><span><strong>{{ terminal }}</strong><small>Awaiting
                    Gate</small></span><span>Arrive {{ arrival }}<small>Scheduled</small></span></div>
        <div class="fc-terminal__change">■ &nbsp;No Terminal Change</div>
        <div class="fc-terminal__stop"><b>{{ gate }}</b><span><strong>{{ terminal }}</strong><small>Awaiting
                    Gate</small></span><span>Depart {{ departure }}<small>Scheduled</small></span></div>
    </div>
</template>
