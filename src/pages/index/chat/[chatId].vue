<template>
  <q-page class="chat-page">
    <div
      ref="containerRef"
      class="chat-page__messages"
      @scroll="updateScrollPosition"
    >
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
import MessageType from "@/types/message";
import { useMessagesStore } from "@/stores/messages-store";
import { apiMessageList } from "@/api/messages";
import { apiGenerateWithTools } from "@/api/llm";
import { useChatScroll } from "@/composables/useChatScroll";
import { useLoaderStore } from "@/stores/loader-store";
import { LoadingType } from "@/types/loading";

const route = useRoute("//chat/[chatId]");

const chatId = computed(() => route.params.chatId);

const messages = ref<MessageType[]>([]);

const {
  containerRef,
  isNearBottom,
  updateScrollPosition,
  scrollToBottom,
} = useChatScroll();

const loaderStore = useLoaderStore();

const loadMessages = async (chatId: string) => {
  try {
    const response = await apiMessageList(chatId);

    messages.value = response.data.messages;
  } catch (error) {
    console.error("Ошибка загрузки диалогов:", error);
  }
};

const sendMessage = async (message: string) => {
  await scrollToBottom("smooth");
  loaderStore.start(LoadingType.GENERATION);

  await apiGenerateWithTools(chatId.value, message);
  await loadMessages(chatId.value);
  loaderStore.stop(LoadingType.GENERATION);

  if (isNearBottom.value) {
    await scrollToBottom("smooth");
  }
};

const handleSendMessage = async (message: string) => {
  try {
    await sendMessage(message);
  } catch (error) {
    console.error("Ошибка отправки сообщения:", error);
  }
};

const handleInitialMessage = async () => {
  // если пользователь пришел со страницы создания нового диалога, в сторе будет сообщение
  const messagesStore = useMessagesStore();
  const initialMessage = messagesStore.consumeInitialMessage();

  if (!initialMessage) {
    return;
  }

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

    await scrollToBottom();
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  padding: 74px 24px 0 24px;

  &__messages {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 0 0 20px;
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
