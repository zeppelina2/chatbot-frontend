<template>
  <q-page class="flex flex-center">
    <div class="start-page">
      <TypingLoader
        v-if="loaderStore.isLoading(LoadingType.CREATE_DIALOGUES)"
      />
      <ChatInput @send="handleCreateDialogue" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

import ChatInput from "@/components/ui/ChatInput.vue";
import { useDialoguesStore } from "@/stores/dialogues-store";
import { useMessagesStore } from "@/stores/messages-store";
import { useLoaderStore } from "@/stores/loader-store";
import { LoadingType } from "@/types/loading";
import TypingLoader from "@/components/ui/TypingLoader.vue";

const loaderStore = useLoaderStore();

const dialoguesStore = useDialoguesStore();

const router = useRouter();

const handleCreateDialogue = async (message: string) => {
  try {
    loaderStore.start(LoadingType.CREATE_DIALOGUES);
    const newChat = await dialoguesStore.createDialogue();
    const newChatId = newChat.chat_id;
    const messagesStore = useMessagesStore();
    messagesStore.setInitialMessage(message);
    loaderStore.stop(LoadingType.CREATE_DIALOGUES);

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
