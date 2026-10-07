<script setup>
defineProps({
    title: { type: String, required: true },
    duration: { type: String, required: true },
    extra: { type: String, required: true },
});
</script>

<template>
    <div class="fc-connection">
        <h2>{{ title }}</h2>
        <p>
            You have <strong>{{ duration }} between flights.</strong> That's
            {{ extra }} more than the suggested minimum.
        </p>
    </div>
</template>
