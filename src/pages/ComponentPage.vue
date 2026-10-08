<script setup>
import FcComponentGallery from "../component/fc/FcComponentGallery.vue";

import pageData from "./data/ComponentPage.json";
</script>

<template>
    <FcComponentGallery :data="pageData" />
</template>
