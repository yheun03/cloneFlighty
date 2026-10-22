<script setup>
import { computed } from "vue";

const props = defineProps({
    // Lucide 아이콘 이름 또는 import한 SVG URL입니다.
    src: { type: String, required: true },
    variant: {
        type: String,
        default: "mask",
        validator: (value) => ["mask", "image"].includes(value),
    },
});

const icons = import.meta.glob("../../assets/icons/lucide/*.svg", {
    eager: true,
    query: "?url",
    import: "default",
});
const designIcons = import.meta.glob("../../assets/figma/*.svg", {
    eager: true,
    query: "?url",
    import: "default",
});
const source = computed(
    () =>
        designIcons[`../../assets/figma/${props.src}.svg`] ||
        icons[`../../assets/icons/lucide/${props.src}.svg`] ||
        props.src,
);
</script>

<template>
    <span
        class="fc-icon"
        :class="{
            'fc-icon--empty': !source,
            'fc-icon--image': variant === 'image',
        }"
        :style="
            source
                ? { '--fc-icon-url': `url(&quot;${source}&quot;)` }
                : undefined
        "
        aria-hidden="true"
    ></span>
</template>
