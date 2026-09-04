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
import { computed, ref, watch, nextTick } from "vue";
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

const animateAssistantMessage = async (
  currentChatId: string,
  content: string,
) => {
  const streamingMessage =
    messagesStore.addStreamingMessage(currentChatId);

  const characters = Array.from(content);

  // Ограничиваем количество обновлений примерно до 300,
  // чтобы длинные ответы не печатались несколько минут.
  const chunkSize = Math.max(
    1,
    Math.ceil(characters.length / 300),
  );

  for (let index = chunkSize; index <= characters.length; index += chunkSize) {
    const shouldScroll = isNearBottom.value;

    messagesStore.updateMessageContent(
      currentChatId,
      streamingMessage.message_id,
      characters.slice(0, index).join(""),
    );

    await nextTick();

    if (shouldScroll) {
      await scrollToBottom();
    }

    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 16);
    });
  }

  // Последнее обновление необходимо, если длина текста
  // не делится на chunkSize без остатка.
  messagesStore.updateMessageContent(
    currentChatId,
    streamingMessage.message_id,
    content,
  );
};

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
  try {
    await scrollToBottom("smooth");

    const response = await apiGenerateWithTools(
      currentChatId,
      optimisticMessage.content,
    );

    // Ответ уже получен, генерация закончилась —
    // вместо лоадера начинаем показывать текст.
    loaderStore.stopGeneration(currentChatId);

    await animateAssistantMessage(
      currentChatId,
      response.data.content,
    );

    // После анимации заменяем временные сообщения
    // реальными сообщениями с сервера.
    await loadMessages(currentChatId);
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

  messagesStore.setMessageStatus(
    currentChatId,
    optimisticMessage.message_id,
    "sending",
  );

  loaderStore.startGeneration(currentChatId);

  try {
    await sendMessage(currentChatId, optimisticMessage);
  } catch (error) {
    console.error("Ошибка отправки сообщения:", error);
  }
};

const handleInitialMessage = async (
  currentChatId: string,
  pendingMessage: ClientMessage
): Promise<boolean> => {
  // если пользователь пришел со страницы создания нового диалога,
  // в сторе будет сообщение со статусом "pending"
  try {
    loaderStore.startGeneration(currentChatId);

    messagesStore.setMessageStatus(
      currentChatId,
      pendingMessage.message_id,
      "sending",
    );

    await dialoguesStore.generateDialogueName(
      pendingMessage.content,
      currentChatId,
    );

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

    const pendingMessage = messagesStore.getPendingMessage(currentChatId);
    const sendingMessage = messagesStore.getSendingMessage(currentChatId);
    const hasInitialMessage = !!pendingMessage;
    const hasSendingMessage = !!sendingMessage;

    if (hasInitialMessage) {
      await handleInitialMessage(currentChatId, pendingMessage);
    } else if (!hasSendingMessage) {
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
