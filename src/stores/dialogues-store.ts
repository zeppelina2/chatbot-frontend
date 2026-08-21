import { defineStore, acceptHMRUpdate } from "pinia";

import DialogueType from "@/types/dialogue";

import { apiDialogueList, apiCreateDialogue } from "@/api/dialogues";
import { apiGenerateDialogueName } from "@/api/llm";


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

    async createDialogue(firstUserMessage: string) {
      try {
        const response = await apiCreateDialogue();
        const newChatId = response.data.chat_id;
        const newDialogueWithGenerateNameResponse = await apiGenerateDialogueName(newChatId, firstUserMessage);

        const { message, ...dialogue } = newDialogueWithGenerateNameResponse.data;

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
