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
import Dialogue from "@/types/dialogue";
import Message from "@/types/message";
import { apiDialogueList } from "@/api/dialogues";
import { apiGenerateWithTools } from "@/api/llm";

const route = useRoute("//chat/[chatId]");

const chatId = computed(() => route.params.chatId);

const dialogues = ref<Dialogue[]>([]);

const messages = computed<Message[]>(() => {
  const dialogue = dialogues.value.find(
    (dialogue) => dialogue.chat_id === chatId.value,
  );

  return dialogue?.messages ?? [];
});

const loadDialogues = async () => {
  try {
    const response = await apiDialogueList();

    dialogues.value = response.data.dialogues;
  } catch (error) {
    console.error("Ошибка загрузки диалогов:", error);
  }
};

watch(
  chatId,
  async () => {
    await loadDialogues();
  },
  { immediate: true },
);

const handleSendMessage = async (message: string) => {
  try {
    await apiGenerateWithTools(chatId.value, message);
    loadDialogues();
  } catch (error) {
    console.error("Ошибка загрузки диалогов:", error);
  }
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
