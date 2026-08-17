<template>
  <q-list>
    <!-- <q-item-label header>
      Диалоги
    </q-item-label> -->

    <q-item
      v-for="dialogue in mockDialogues"
      :key="dialogue.chat_id"
      clickable
      :to="`/chat/${dialogue.chat_id}`"
      active-class="dialogue-item--active"
    >
      <q-item-section>
        <q-item-label>
          {{ dialogue.name }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { mockDialogues } from "@/mocks/dialogues";
</script>

<style scoped lang="scss">
.dialogue-item--active {
  background: #e3f2fd;
  color: #1976d2;
}
</style>
