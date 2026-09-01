import { defineStore } from "pinia";

export const useMessagesStore = defineStore("messages", {
  state: () => ({
    initialMessage: null as string | null,
  }),

  actions: {
    setInitialMessage(message: string) {
      this.initialMessage = message;
    },

    consumeInitialMessage() {
      const message = this.initialMessage;

      this.initialMessage = null;

      return message;
    },
  },
});
