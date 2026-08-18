<template>
  <q-page class="flex flex-center">
    <div class="start-page">
      <ChatInput @send="onSend" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import ChatInput from "@/components/ChatInput.vue";

const onSend = (message: string) => {
  console.log("Отправлено:", message);
};
</script>

<style scoped lang="scss">
.start-page {
  width: 100%;
  max-width: 900px;
  padding: 16px;
}
</style>
