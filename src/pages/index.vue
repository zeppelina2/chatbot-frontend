<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      bordered
      class="app-header"
    >
      <q-toolbar class="app-header__toolbar">
        <q-btn
          class="app-header__menu lt-md"
          flat
          round
          dense
          icon="menu"
          aria-label="Открыть меню"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="app-header__title">
          <span class="app-header__dialogue-name">
            {{ currentDialogueName }}
          </span>

          <span class="app-header__status">
            <span class="app-header__status-dot"></span>
            Магнус готов отвечать
          </span>
        </q-toolbar-title>
        <ThemeSwitcher />
        <img
          src="/icons/dialogue-sparkle-32.svg"
          width="25"
          height="25"
          alt="active-dialogue-star"
          aria-hidden="true"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      class="app-drawer"
      show-if-above
      bordered
      :width="260"
    >
      <div class="drawer">
        <div class="drawer__brand">
          <q-avatar
            class="drawer__avatar"
            size="38px"
          >
            <img
              src="/icons/favicon-96x96.png"
              alt=""
            />
          </q-avatar>

          <div class="drawer__brand-text">
            <div class="drawer__brand-name">
              Магнус Фортий
            </div>

            <div class="drawer__brand-caption">
              Архив Академии
            </div>
          </div>
        </div>

        <div class="drawer__new-chat-wr">
          <button
            class="drawer__new-chat"
            outline
            @click="createChat"
          >Новый разговор</button>
        </div>

        <BaseScrollArea class="drawer__dialogues">
          <DialogueList />
        </BaseScrollArea>

        <div class="drawer__footer_wr">
          <div class="drawer__footer">
            <q-btn
              class="drawer__settings"
              flat
              no-caps
              icon="settings"
              align="left"
              label="Настройки"
            />
          </div>
        </div>
      </div>
    </q-drawer>

    <q-page-container class="page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import BaseScrollArea from "@/components/ui/BaseScrollArea.vue";
import DialogueList from "@/components/DialogueList.vue";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher.vue";
import { useDialoguesStore } from "@/stores/dialogues-store";

const router = useRouter();

const dialoguesStore = useDialoguesStore();

const leftDrawerOpen = ref(false);

const route = useRoute("//chat/[chatId]");
const currentChatId = computed(() => route.params.chatId);

const currentDialogueName = computed(() => {
  if (!currentChatId.value) {
    return "Новый разговор";
  }

  const currentDialogue = dialoguesStore.dialogues.find(
    (dialogue) => dialogue.chat_id === currentChatId.value,
  );

  return currentDialogue?.name ?? "Диалог";
});

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const createChat = async () => {
  await router.push("/");

  // leftDrawerOpen.value = false;
};
</script>

<style scoped lang="scss">
.app-header {
  color: var(--text-primary);
  background-color: var(--surface-page);
  border-color: var(--border-divider);
  box-shadow: none;

  &__toolbar {
    min-height: 66px;
    padding: 0 24px;
  }

  &__menu {
    margin-right: 8px;
    color: var(--text-secondary);
  }

  &__title {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 0;
  }

  &__dialogue-name {
    overflow: hidden;
    color: var(--text-primary);
    font-family: var(--font-accent);
    font-size: 16px;
    font-weight: var(--font-accent-weight);
    line-height: 1.3;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__status {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-muted);
    font-size: 12px;
    line-height: 1.3;
  }

  &__status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: var(--surface-positive);
  }

  &__decoration {
    margin-left: 16px;
    color: var(--q-primary);
    font-size: 21px;
  }
}

.app-drawer {
  color: var(--text-primary);
  background-color: var(--surface-sidebar);
  border-color: var(--border-divider);
}

.drawer {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px 0 14px;
  background-color: var(--surface-sidebar);

  &__brand {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 0 20px 20px;
  }

  &__avatar {
    flex-shrink: 0;
    background-color: var(--avatar-main-background);
    box-shadow: var(--avatar-main-shadow);
  }

  &__brand-text {
    min-width: 0;
  }

  &__brand-name {
    overflow: hidden;
    color: var(--text-primary);
    font-size: 17px;
    font-weight: var(--font-accent-weight);
    line-height: 1.3;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__brand-caption {
    margin-top: 2px;
    color: var(--text-muted);
    font-size: 12px;
    line-height: 1.3;
  }

  &__new-chat {
    flex-shrink: 0;
    width: 100%;
    min-height: 42px;
    border-radius: 11px;
    border: 1px solid var(--border-accent);
    color: var(--q-primary);
    outline: 0;
    background-color: var(--surface-sidebar);
    cursor: pointer;

    &:hover {
      background-color: var(--surface-page);
      border-color: var(--border-hover);
    }

    :deep(.q-btn__content) {
      gap: 4px;
    }

    &-wr {
      padding: 12px;
    }
  }

  &__dialogues {
    flex: 1;
    min-height: 0;
    margin-top: 5px;
    padding: 0 12px;
  }

  &__footer {
    flex-shrink: 0;
    padding-top: 10px;
    border-top: 1px solid var(--border-divider);

    &_wr {
      padding: 0 12px;
    }
  }

  &__settings {
    width: 100%;
    min-height: 42px;
    padding: 0 10px;
    border-radius: 9px;
    color: var(--text-secondary);

    &:hover {
      color: var(--text-primary);
      background-color: var(--surface-hover);
    }
  }
}

.page-container {
  height: 100vh;
  overflow: hidden;
  background-color: var(--surface-page);
}

:deep(.q-page-container.page-container) {
  padding-top: 0!important;
}

@media (max-width: 600px) {
  .app-header {
    &__toolbar {
      min-height: 60px;
      padding: 0 14px;
    }

    &__dialogue-name {
      font-size: 15px;
    }
  }
}
</style>
