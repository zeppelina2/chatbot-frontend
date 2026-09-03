<template>
  <q-page class="chat-page">
    <BaseScrollArea
      ref="scrollAreaRef"
      class="chat-page__scroll-area"
      @scroll="updateScrollPosition"
    >
      <div class="chat-page__messages">
        <MessageList
          :messages="messages"
          :chat-id="chatId"
        />
      </div>
    </BaseScrollArea>

    <div class="chat-page__input">
      <ChatInput @send="handleSendMessage" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

import MessageList from "@/components/MessageList.vue";
import ChatInput from "@/components/ui/ChatInput.vue";
import BaseScrollArea from "@/components/ui/BaseScrollArea.vue";
import { useMessagesStore, ClientMessage } from "@/stores/messages-store";
import { apiMessageList } from "@/api/messages";
import { apiGenerateWithTools } from "@/api/llm";
import { useDialoguesStore } from "@/stores/dialogues-store";
import { useChatScroll } from "@/composables/useChatScroll";
import { useLoaderStore } from "@/stores/loader-store";

const route = useRoute("//chat/[chatId]");
const chatId = computed(() => route.params.chatId);
const messagesStore = useMessagesStore();
const messages = computed(() => {
  return messagesStore.getMessages(chatId.value);
});
const scrollAreaRef = ref<InstanceType<typeof BaseScrollArea> | null>(null);
const containerRef = computed<HTMLElement | null>(() => {
  return scrollAreaRef.value?.getContainer() ?? null;
});

const {
  isNearBottom,
  updateScrollPosition,
  scrollToBottom,
} = useChatScroll(containerRef);

const dialoguesStore = useDialoguesStore();

const loaderStore = useLoaderStore();

const loadMessages = async (currentChatId: string) => {
  try {
    const response = await apiMessageList(currentChatId);

    messagesStore.setMessages(
      currentChatId,
      response.data.messages,
    );
  } catch (error) {
    console.error("Ошибка загрузки сообщений:", error);
  }
};

const sendMessage = async (
  currentChatId: string,
  optimisticMessage: ClientMessage,
) => {
  messagesStore.setMessageStatus(
    currentChatId,
    optimisticMessage.message_id,
    "sending",
  );

  loaderStore.startGeneration(currentChatId);

  try {
    await scrollToBottom("smooth");

    await dialoguesStore.generateDialogueName(
      optimisticMessage.content,
      currentChatId,
    );

    await apiGenerateWithTools(
      currentChatId,
      optimisticMessage.content,
    );

    await loadMessages(currentChatId);

    if (isNearBottom.value) {
      await scrollToBottom("smooth");
    }
  } catch (error) {
    messagesStore.setMessageStatus(
      currentChatId,
      optimisticMessage.message_id,
      "error",
    );

    throw error;
  } finally {
    loaderStore.stopGeneration(currentChatId);
  }
};

const handleSendMessage = async (content: string) => {
  const currentChatId = chatId.value;

  const optimisticMessage =
    messagesStore.addOptimisticMessage(currentChatId, content);

  try {
    await sendMessage(currentChatId, optimisticMessage);
  } catch (error) {
    console.error("Ошибка отправки сообщения:", error);
  }
};

const handleInitialMessage = async (
  currentChatId: string,
): Promise<boolean> => {
  // если пользователь пришел со страницы создания нового диалога,
  // в сторе будет сообщение со статусом "pending"
  const pendingMessage =
    messagesStore.getPendingMessage(currentChatId);

  if (!pendingMessage) {
    return false;
  }

  try {
    await sendMessage(currentChatId, pendingMessage);
  } catch (error) {
    console.error(
      "Ошибка отправки первоначального сообщения:",
      error,
    );
  }

  return true;
};

watch(
  chatId,
  async (currentChatId) => {
    if (!currentChatId) {
      return;
    }

    const hasInitialMessage =
      await handleInitialMessage(currentChatId);

    if (!hasInitialMessage) {
      await loadMessages(currentChatId);
    }

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

  &__scroll-area {
    flex: 1;
  }

  &__messages {
    padding: 0 0 20px;
  }

  &__input {
    position: sticky;
    bottom: 0;
    flex-shrink: 0;
    padding-bottom: 24px;
    background-color: white;
  }
}
</style>
