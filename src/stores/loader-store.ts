import { defineStore } from "pinia";
import { LoadingType } from "@/types/loading";

export const useLoaderStore = defineStore("loader", {
  state: () => ({
    loading: {
      [LoadingType.DIALOGUES]: false,
      [LoadingType.MESSAGES]: false,
    } as Partial<Record<LoadingType, boolean>>,

    generationByChatId: {} as Record<string, boolean>,
  }),

  getters: {
    isLoading: (state) => (type: LoadingType) =>
      Boolean(state.loading[type]),

    isGenerationLoading: (state) => (chatId: string) =>
      Boolean(state.generationByChatId[chatId]),
  },

  actions: {
    start(type: LoadingType) {
      this.loading[type] = true;
    },

    stop(type: LoadingType) {
      this.loading[type] = false;
    },

    startGeneration(chatId: string) {
      this.generationByChatId[chatId] = true;
    },

    stopGeneration(chatId: string) {
      delete this.generationByChatId[chatId];
    },
  },
});
