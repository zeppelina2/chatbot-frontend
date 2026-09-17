<template>
  <nav
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

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";

import { useDialoguesStore } from "@/stores/dialogues-store";
import OverflowTooltip from "@/components/ui/OverflowTooltip.vue";

const dialoguesStore = useDialoguesStore();

const route = useRoute("//chat/[chatId]");
const currentChatId = computed(() => route.params.chatId);

onMounted(() => {
  dialoguesStore.loadDialogues();
});
</script>

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
  }
}
</style>
