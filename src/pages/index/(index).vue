<template>
  <q-page class="flex flex-center">
    <div class="start-page">
      <TypingLoader
        v-if="loaderStore.isLoading(LoadingType.GENERATION)"
      />
      <ChatInput @send="handleSendMessage" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

import ChatInput from "@/components/ChatInput.vue";
import { useDialoguesStore } from "@/stores/dialogues-store";
import { useMessagesStore } from "@/stores/messages-store";
import { useLoaderStore } from "@/stores/loader-store";
import { LoadingType } from "@/types/loading";
import TypingLoader from "@/components/ui/TypingLoader.vue";

const loaderStore = useLoaderStore();

const dialoguesStore = useDialoguesStore();

const router = useRouter();

const handleSendMessage = async (message: string) => {
  try {
    loaderStore.start(LoadingType.GENERATION);
    const newChat = await dialoguesStore.createDialogue(message);
    const newChatId = newChat.chat_id;
    const messagesStore = useMessagesStore();
    messagesStore.setInitialMessage(message);
    loaderStore.stop(LoadingType.GENERATION);

    await router.push(`/chat/${newChatId}`);
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
