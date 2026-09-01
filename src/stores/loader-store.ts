import { defineStore } from "pinia";
import { LoadingType } from "@/types/loading";

export const useLoaderStore = defineStore("loader", {
  state: () => ({
    loading: {
      [LoadingType.DIALOGUES]: false,
      [LoadingType.MESSAGES]: false,
      [LoadingType.GENERATION]: false,
    } as Record<LoadingType, boolean>,
  }),

  getters: {
    isLoading: (state) => (type: LoadingType) =>
      state.loading[type],
  },

  actions: {
    start(type: LoadingType) {
      this.loading[type] = true;
    },

    stop(type: LoadingType) {
      this.loading[type] = false;
    },
  },
});
