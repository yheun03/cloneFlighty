<script setup>
defineProps({
    title: { type: String, required: true },
    duration: { type: String, required: true },
    extra: { type: String, required: true },
});
</script>

<template>
    <div class="fc-connection">
        <h2>{{ $t(title) }}</h2>
        <p>
            {{ $t("You have") }}
            <strong>{{ $t(duration) }} {{ $t("between flights.") }}</strong>
            {{ $t("That's") }} {{ $t(extra) }}
            {{ $t("more than the suggested minimum.") }}
        </p>
    </div>
</template>
