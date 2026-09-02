<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Магнус Фортий Ирриматис
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <div class="drawer">
        <q-btn
          class="drawer__new-chat"
          unelevated
          icon="add"
          align="left"
          padding="16px"
          label="Новый чат"
          @click="createChat"
        />

        <BaseScrollArea class="drawer__dialogues">
          <DialogueList />
        </BaseScrollArea>

        <div class="drawer__footer">
          <q-btn
            class="drawer__settings"
            flat
            icon="settings"
            padding="16px"
            label="Настройки"
          />
        </div>
      </div>
    </q-drawer>

    <q-page-container class="page__container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import BaseScrollArea from "@/components/ui/BaseScrollArea.vue";
import DialogueList from "@/components/DialogueList.vue";

const leftDrawerOpen = ref(false);
const router = useRouter();

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const createChat = () => {
  router.push("/");
};
</script>

<style scoped lang="scss">
.page__container {
  padding-top: 0 !important;
}

.drawer {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__new-chat {
    flex-shrink: 0;
    width: 100%;
  }

  &__dialogues {
    flex: 1;
    min-height: 0;
  }

  &__footer {
    flex-shrink: 0;
    margin-top: 16px;
  }

  &__settings {
    width: 100%;
  }
}
</style>
