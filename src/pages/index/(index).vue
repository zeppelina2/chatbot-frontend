<template>
  <q-page class="flex flex-center page-wr">
    <div class="start-page">
      <div
        class="loader-content"
        v-if="loaderStore.isLoading(LoadingType.CREATE_DIALOGUES)"
      >
        <TypingLoader />
        <span class="q-sr-only">
          Магнус готовит ответ
        </span>
      </div>
      <ChatInput
        @send="handleCreateDialogue"
        :disabled="loaderStore.isLoading(LoadingType.CREATE_DIALOGUES)"
      />
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
    messagesStore.addOptimisticMessage(newChat.chat_id, message);
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
  max-width: 780px;
  padding: 16px;
}

.page-wr {
  padding-top: 66px;
}

.loader-content {
  margin: 0 0 10px;
}

</style>
