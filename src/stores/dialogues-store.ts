import { defineStore, acceptHMRUpdate } from "pinia";

import DialogueType from "@/types/dialogue";

import { apiDialogueList, apiCreateDialogue } from "@/api/dialogues";


export const useDialoguesStore = defineStore("dialogues", {
  state: () => ({
    dialogues: [] as DialogueType[],
  }),

  actions: {
    async loadDialogues() {
      try {
        const response = await apiDialogueList();

        this.dialogues = response.data.dialogues;
      } catch (error) {
        console.error("Ошибка загрузки диалогов:", error);
      }
    },

    async createDialogue() {
      try {
        const response = await apiCreateDialogue();

        const { message, ...dialogue } = response.data;

        this.dialogues.unshift(dialogue);

        return dialogue;
      } catch (error) {
        console.error("Ошибка создания диалога:", error);
        throw error;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useDialoguesStore, import.meta.hot),
  );
}
