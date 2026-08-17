<template>
  <q-page class="chat-page">
    <h1>Чат {{ chatId }}</h1>
  </q-page>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute("//chat/[chatId]");

const chatId = route.params.chatId;
console.log("route.params", route.params)
</script>
