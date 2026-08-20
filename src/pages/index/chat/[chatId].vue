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
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

import MessageList from "@/components/MessageList.vue";
import ChatInput from "@/components/ChatInput.vue";
import Message from "@/types/message";

import { apiMessageList } from "@/api/messages";
import { apiGenerateWithTools } from "@/api/llm";

const route = useRoute("//chat/[chatId]");

const chatId = computed(() => route.params.chatId);

const messages = ref<Message[]>([]);

const loadMessages = async (chatId: string) => {
  try {
    const response = await apiMessageList(chatId);

    messages.value = response.data.messages;
  } catch (error) {
    console.error("Ошибка загрузки диалогов:", error);
  }
};

const sendMessage = async (message: string) => {
  await apiGenerateWithTools(chatId.value, message);
  await loadMessages(chatId.value);
};

const handleSendMessage = async (message: string) => {
  try {
    await sendMessage(message);
  } catch (error) {
    console.error("Ошибка отправки сообщения:", error);
  }
};


const handleInitialMessage = async () => {
  // в initialMessage придет сообщение,
  // если пользователь пришел со страницы создания нового диалога
  const initialMessage = history.state.initialMessage as string | undefined;

  if (!initialMessage) {
    return;
  }

  // Убираем сообщение из history.state,
  // чтобы не отправить его повторно
  history.replaceState(
    {
      ...history.state,
      initialMessage: undefined,
    },
    "",
  );

  try {
    await sendMessage(initialMessage);
  } catch (error) {
    console.error("Ошибка отправки первоначального сообщения:", error);
  }
};

watch(
  chatId,
  async () => {
    await loadMessages(chatId.value);
    await handleInitialMessage();
  },
  { immediate: true },
);
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
