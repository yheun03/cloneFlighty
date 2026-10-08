<script setup>
import { computed } from "vue";

const props = defineProps({
    // Lucide 아이콘 이름 또는 import한 SVG URL입니다.
    src: { type: String, required: true },
});

const icons = import.meta.glob("../../assets/icons/lucide/*.svg", {
    eager: true,
    query: "?url",
    import: "default",
});
const source = computed(
    () => icons[`../../assets/icons/lucide/${props.src}.svg`] || props.src,
);
</script>

<template>
    <span
        class="fc-icon"
        :style="{ '--fc-icon-url': `url(&quot;${source}&quot;)` }"
        aria-hidden="true"
    ></span>
</template>
