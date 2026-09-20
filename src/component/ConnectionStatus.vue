<script setup>
defineProps({
    title: { type: String, default: 'Relaxed Connection' },
    duration: { type: String, default: '4h 30m' },
    extra: { type: String, default: '3h 10m' }
})
</script>

<template>
    <div class="fc-connection">
        <h2>{{ title }}</h2>
        <p>You have <strong>{{ duration }} between flights.</strong> That's {{ extra }}<br /> more than the suggested
            minimum.</p>
    </div>
</template>
