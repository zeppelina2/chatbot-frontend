<template>
  <q-page class="chat-page">
    <div class="chat-page__messages">
      <MessageList :messages="messages" />
    </div>

    <div class="chat-page__input">
      <ChatInput @send="handleSendMessage" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import MessageList from "@/components/MessageList.vue";
import ChatInput from "@/components/ChatInput.vue";

import { mockDialogues } from "@/mocks/dialogues";

const route = useRoute("//chat/[chatId]");

const chatId = computed(() => route.params.chatId);

const dialogue = computed(() =>
  mockDialogues.find((dialogue) => dialogue.chat_id === chatId.value),
);

const messages = computed(() => dialogue.value?.messages ?? []);

const handleSendMessage = (message: string) => {
  console.log("Отправляем сообщение:", message);
};
</script>

<style scoped lang="scss">
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px 24px 0 24px;

  &__messages {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    margin: 0 0 20px;
  }

  &__input {
    flex-shrink: 0;
    position: sticky;
    bottom: 0;
    padding: 0 0 24px;
    background-color: white;
  }
}
</style>
