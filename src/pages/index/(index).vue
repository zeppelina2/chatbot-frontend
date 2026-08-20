<template>
  <q-page class="flex flex-center">
    <div class="start-page">
      <ChatInput @send="handleSendMessage" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

import ChatInput from "@/components/ChatInput.vue";
import { apiCreateDialogue } from "@/api/dialogues";

const router = useRouter();

const handleSendMessage = async (message: string) => {
  try {
    const newChat = await apiCreateDialogue();
    const newChatId = newChat.data.chat_id;

    await router.push({
      path: `/chat/${newChatId}`,
      state: {
        initialMessage: message,
      },
    });
  } catch (error) {
    console.error("Ошибка загрузки диалогов:", error);
  }
};
</script>

<style scoped lang="scss">
.start-page {
  width: 100%;
  max-width: 900px;
  padding: 16px;
}
</style>
