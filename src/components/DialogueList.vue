<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";

import { useDialoguesStore } from "@/stores/dialogues-store";
import DialogueActions from "./DialogueActions.vue";
import OverflowTooltip from "@/components/ui/OverflowTooltip.vue";

const emit = defineEmits<{
  delete: [chatId: string];
}>();

const dialoguesStore = useDialoguesStore();

const route = useRoute("//chat/[chatId]");
const currentChatId = computed(() => route.params.chatId);

const listRef = ref<HTMLElement | null>(null);

onMounted(() => {
  const initialChatId = currentChatId.value;

  if (!initialChatId) return;

  const scrollToInitialDialogue = () => {
    const item = listRef.value?.querySelector<HTMLElement>(
      ".dialogue-list__item--active",
    );

    item?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  const hasInitialDialogue = () =>
    dialoguesStore.dialogues.some(
      (dialogue) => dialogue.chat_id === initialChatId,
    );

  // Если список уже отрисован, можно прокрутить сразу.
  if (hasInitialDialogue()) {
    scrollToInitialDialogue();
    return;
  }

  // После обновления страницы список обычно ещё загружается.
  const stop = watch(
    [hasInitialDialogue, currentChatId],
    ([hasDialogue, chatId]) => {
      if (chatId !== initialChatId) {
        stop();
        return;
      }

      if (hasDialogue) {
        scrollToInitialDialogue();
        stop();
      }
    },
    { flush: "post" },
  );
});

onMounted(() => {
  dialoguesStore.loadDialogues();
});
</script>

<template>
  <nav
    ref="listRef"
    class="dialogue-list"
    aria-label="Список диалогов"
  >
    <q-list>
      <q-item
        v-for="dialogue in dialoguesStore.dialogues"
        :key="dialogue.chat_id"
        class="dialogue-list__item"
        clickable
        exact
        :to="`/chat/${dialogue.chat_id}`"
        active-class="dialogue-list__item--active"
      >
        <q-item-section class="dialogue-list__name-section">
          <OverflowTooltip
            class="dialogue-list__name"
            :text="dialogue.name"
          />
        </q-item-section>

        <q-item-section
          v-if="currentChatId === dialogue.chat_id"
          side
          class="dialogue-list__active-icon"
        >
          <img
            src="/icons/dialogue-sparkle-32.svg"
            width="23"
            height="23"
            alt="active-dialogue-star"
            aria-hidden="true"
          />
        </q-item-section>
        <DialogueActions
          context-menu
          :actions="['delete']"
          @delete="emit('delete', dialogue.chat_id)"
        />
      </q-item>

      <div
        v-if="!dialoguesStore.dialogues.length"
        class="dialogue-list__empty"
      >
        Здесь появятся ваши беседы
      </div>
    </q-list>
  </nav>
</template>

<style scoped lang="scss">
.dialogue-list {
  width: 100%;

  &__item {
    min-height: 40px;
    margin-bottom: 3px;
    padding: 0 11px;
    border-radius: 9px;
    color: var(--text-secondary);
    transition:
      color 0.2s ease,
      background-color 0.2s ease;

    &:hover {
      color: var(--text-primary);
      background-color: var(--surface-hover);
    }

    &--active {
      background-color: var(--surface-active);

      &:hover {
        background-color: var(--surface-active);
      }
    }
  }

  &__name-section {
    min-width: 0;
  }

  &__name {
    font-size: 14px;
    line-height: 1.4;
  }

  &__active-icon {
    padding-left: 8px;
    color: var(--q-primary);

    :deep(.q-icon) {
      font-size: 17px;
    }
  }

  &__empty {
    padding: 16px 10px;
    color: var(--text-muted);
    font-size: 13px;
    line-height: 1.5;
    text-align: center;
  }
}
</style>
