<template>
  <q-list>
    <q-item-label header>
      Диалоги
    </q-item-label>

    <q-item v-for="dialogue in dialogues" :key="dialogue.id" clickable :to="`/chat/${dialogue.id}`"
      active-class="dialogue-item--active">
      <q-item-section>
        <q-item-label>
          {{ dialogue.name }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { dialogues } from "@/mocks/dialogues";
</script>
