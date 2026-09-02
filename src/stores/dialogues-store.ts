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

    async createDialogue() {
      try {
        const response = await apiCreateDialogue();

        const { message: _message, ...dialogue } = response.data;

        this.dialogues.unshift(dialogue);

        return dialogue;
      } catch (error) {
        console.error("Ошибка создания диалога:", error);
        throw error;
      }
    },

    async generateDialogueName(firstUserMessage: string, chatId: string) {
      try {
        const newDialogueWithGenerateNameResponse = await apiGenerateDialogueName(chatId, firstUserMessage);

        const { message: _message, ...dialogue } = newDialogueWithGenerateNameResponse.data;

        const dialogueIndex = this.dialogues.findIndex(
          (item) => item.chat_id === chatId
        );

        if (dialogueIndex !== -1 && this.dialogues[dialogueIndex]) {
          this.dialogues[dialogueIndex].name = dialogue.name;
          return dialogue;
        }

        throw "Ошибка генерации имени диалога: Диалог не найден по id"
      } catch (error) {
        console.error("Ошибка генерации имени диалога:", error);
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
