<template>
  <q-list class="message-list" :aria-busy="isGenerationLoading">
    <div class="message-list__messages">
      <div v-for="message in messages" :id="`message-${message.message_id}`" :key="message.message_id"
        class="message-list__message">
        <MessageItem :message="message" />
      </div>

      <div v-if="isGenerationLoading" id="message-loader" class="message-list__loader" role="status">
        <q-avatar class="message-list__loader-avatar" aria-hidden="true">
          <q-icon name="auto_awesome" />
        </q-avatar>

        <div class="message-list__loader-content">
          <div class="message-list__loader-author">
            Магнус Фортий Ирриматис
          </div>

          <TypingLoader />

          <span class="q-sr-only">
            Магнус готовит ответ
          </span>
        </div>
      </div>
    </div>
  </q-list>
</template>

<script setup lang="ts">
import { computed } from "vue";

import MessageItem from "@/components/MessageItem.vue";
import TypingLoader from "@/components/ui/TypingLoader.vue";
import { useLoaderStore } from "@/stores/loader-store";

import type MessageType from "@/types/message";

const props = defineProps<{
  messages: MessageType[];
  chatId: string;
}>();

const loaderStore = useLoaderStore();

const isGenerationLoading = computed(() =>
  loaderStore.isGenerationLoading(props.chatId),
);
</script>

<style scoped lang="scss">
.message-list {
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
  padding: 24px 0 32px;
  box-sizing: border-box;

  &__messages {
    display: flex;
    flex-direction: column;
    gap: 28px;
    width: 100%;
  }

  &__message {
    width: 100%;
  }

  &__loader {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    width: 100%;
  }

  &__loader-avatar {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    color: var(--avatar-text);
    background-color: var(--avatar-background);
    box-shadow: var(--avatar-shadow);

    :deep(.q-icon) {
      font-size: 17px;
    }
  }

  &__loader-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    min-width: 0;
  }

  &__loader-author {
    font-family: var(--font-accent);
    color: var(--text-accent);
    font-size: 16px;
    font-weight: var(--font-accent-weight);
  }
}

@media (max-width: 600px) {
  .message-list {
    padding: 20px 16px 28px;

    &__messages {
      gap: 24px;
    }

    &__loader {
      gap: 9px;
    }
  }
}
</style>
