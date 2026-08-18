<template>
  <q-list>
    <!-- <q-item-label header>
      Диалоги
    </q-item-label> -->

    <q-item
      v-for="dialogue in dialogues"
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
import { ref, onMounted } from "vue";
import Dialogue from "@/types/dialogue";
import { apiDialogueList } from "@/api/dialogues";

const dialogues = ref<Dialogue[]>([]);

onMounted(async () => {
  try {
    const response = await apiDialogueList();
    dialogues.value = response.data.dialogues;
  } catch (error) {
    console.error("Ошибка загрузки диалогов:", error);
  }
});
</script>

<style scoped lang="scss">
.dialogue-item--active {
  background: #e3f2fd;
  color: #1976d2;
}
</style>
