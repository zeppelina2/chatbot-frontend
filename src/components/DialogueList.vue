<template>
  <nav
    class="dialogue-list"
    aria-label="Список диалогов"
  >
    <q-list>
      <!-- <q-item-label
        header
        class="dialogue-list__title"
      >
        Недавние беседы
      </q-item-label> -->

      <q-item
        v-for="dialogue in dialoguesStore.dialogues"
        :key="dialogue.chat_id"
        class="dialogue-list__item"
        clickable
        exact
        :to="`/chat/${dialogue.chat_id}`"
        active-class="dialogue-list__item--active"
      >
        <q-item-section>
          <q-item-label
            class="dialogue-list__name"
            :lines="1"
          >
            {{ dialogue.name }}
          </q-item-label>
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

  // &__title {
  //   padding: 8px 10px;
  //   color: var(--text-muted);
  //   font-size: 12px;
  //   font-weight: 500;
  //   letter-spacing: 0.08em;
  //   text-transform: uppercase;
  // }

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
      // color: var(--text-accent);
      background-color: var(--surface-active);

      &:hover {
        // color: var(--text-accent);
        background-color: var(--surface-active);
      }
    }
  }

  &__name {
    overflow: hidden;
    font-size: 14px;
    line-height: 1.4;
    text-overflow: ellipsis;
    white-space: nowrap;
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
