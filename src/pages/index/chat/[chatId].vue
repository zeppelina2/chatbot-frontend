<template>
  <q-page class="chat-page">
    <h1>Чат {{ chatId }}</h1>
  </q-page>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute("//chat/[chatId]");

const chatId = computed(() => route.params.chatId);

</script>
