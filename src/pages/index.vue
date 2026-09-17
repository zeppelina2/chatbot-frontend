<template>
  <q-layout view="lHh Lpr lFf" :class="{ 'layout--resizing': isResizing }">
    <q-header bordered class="app-header">
      <q-toolbar class="app-header__toolbar">
        <q-btn class="app-header__menu lt-md" flat round dense icon="menu" aria-label="Открыть меню"
          @click="toggleLeftDrawer" />

        <q-toolbar-title class="app-header__title">
          <span class="app-header__dialogue-name">
            {{ currentDialogueName }}
          </span>

          <span class="app-header__status">
            <span class="app-header__status-dot"></span>
            Готов отвечать
          </span>
        </q-toolbar-title>
        <ThemeSwitcher />
        <img src="/icons/dialogue-sparkle-32.svg" width="25" height="25" alt="active-dialogue-star"
          aria-hidden="true" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      class="app-drawer"
      show-if-above
      bordered
      :width="drawerWidth"
      :breakpoint="1023"
    >
      <div class="drawer">
        <div class="drawer__brand">
          <q-avatar class="drawer__avatar" size="38px">
            <img src="/icons/favicon-96x96.png" alt="" />
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
          <button class="drawer__new-chat" @click="createChat">
            <img class="drawer__new-chat-icon" src="/icons/feather.svg" alt="Иконка с пером" aria-hidden="true" />

            <span>Новый разговор</span>
          </button>
        </div>

        <BaseScrollArea class="drawer__dialogues">
          <DialogueList />
        </BaseScrollArea>

        <div class="drawer__footer_wr">
          <div class="drawer__footer">
            <q-btn class="drawer__settings" flat no-caps icon="settings" align="left" label="Настройки" />
          </div>
        </div>

        <div class="drawer__resize-handle gt-sm" :class="{ 'drawer__resize-handle--active': isResizing }"
          role="separator" aria-label="Ширина бокового меню" aria-orientation="vertical" :aria-valuenow="drawerWidth"
          :aria-valuemin="MIN_DRAWER_WIDTH" :aria-valuemax="MAX_DRAWER_WIDTH" tabindex="0"
          @pointerdown.prevent.stop="startResize" @pointermove="resizeDrawer" @pointerup="stopResize"
          @pointercancel="stopResize" @lostpointercapture="stopResize"
          @keydown.left.prevent="setDrawerWidth(drawerWidth - 10)"
          @keydown.right.prevent="setDrawerWidth(drawerWidth + 10)"></div>
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
};

// код для ресайза бокового меню
const MIN_DRAWER_WIDTH = 240;
const MAX_DRAWER_WIDTH = 480;

const drawerWidth = ref(260);
const isResizing = ref(false);

let startX = 0;
let startWidth = 0;
let activePointerId: number | null = null;

const setDrawerWidth = (width: number) => {
  drawerWidth.value = Math.min(
    MAX_DRAWER_WIDTH,
    Math.max(MIN_DRAWER_WIDTH, width),
  );
};

const startResize = (event: PointerEvent) => {
  if (!event.isPrimary || event.button !== 0) return;

  const handle = event.currentTarget as HTMLElement;

  startX = event.clientX;
  startWidth = drawerWidth.value;
  activePointerId = event.pointerId;

  handle.setPointerCapture(event.pointerId);
  isResizing.value = true;
};

const resizeDrawer = (event: PointerEvent) => {
  if (
    !isResizing.value ||
    event.pointerId !== activePointerId
  ) {
    return;
  }

  setDrawerWidth(startWidth + event.clientX - startX);
};

const stopResize = (event: PointerEvent) => {
  if (event.pointerId !== activePointerId) return;

  const handle = event.currentTarget as HTMLElement;

  isResizing.value = false;
  activePointerId = null;

  if (handle.hasPointerCapture(event.pointerId)) {
    handle.releasePointerCapture(event.pointerId);
  }
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
  position: relative;
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
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: 100%;
    min-height: 42px;
    border-radius: 11px;
    border: 1px solid var(--border-accent);
    color: var(--q-primary);
    outline: 0;
    background-color: var(--surface-sidebar);
    cursor: pointer;
    transition:
      color 150ms ease,
      background-color 150ms ease;

    &:hover {
      background-color: var(--surface-page);
      border-color: var(--border-hover);
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

  &__resize-handle {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    width: 6px;
    cursor: col-resize;
    touch-action: none;
    user-select: none;
    outline: none;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 2px;
      background-color: var(--q-primary);
      opacity: 0;
      transition: opacity 150ms ease;
    }

    &:hover::after,
    &:focus-visible::after,
    &--active::after {
      opacity: 1;
    }
  }
}

.page-container {
  height: 100vh;
  overflow: hidden;
  background-color: var(--surface-page);
}

:deep(.q-page-container.page-container) {
  padding-top: 0 !important;
}

.layout--resizing {
  cursor: col-resize;
  user-select: none;

  :deep(*) {
    cursor: col-resize !important;
    user-select: none !important;
  }

  // Во время перетаскивания граница должна следовать
  // за курсором без задержки от CSS-переходов
  :deep(.q-drawer),
  :deep(.q-page-container),
  :deep(.q-header) {
    transition: none !important;
  }
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
