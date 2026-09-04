import { defineStore } from "pinia";

import MessageType from "@/types/message";
import Role from "@/types/roles";

export type SendingStatus = "pending" | "sending" | "error";
export interface ClientMessage extends MessageType {
  sendingStatus?: SendingStatus;
}

export const useMessagesStore = defineStore("messages", {
  state: () => ({
    // объект с ключом chatId и значением со списком сообщений данного диалога
    messagesByChatId: {} as Record<string, ClientMessage[]>,
    initialMessage: null as string | null,
  }),

  getters: {
    getMessages: (state) => (chatId: string) => {
      return state.messagesByChatId[chatId] ?? [];
    },
    getPendingMessage: (state) => (chatId: string) => {
      return state.messagesByChatId[chatId]?.find(
        (message) => message.sendingStatus === "pending",
      );
    },
    getSendingMessage: (state) => (chatId: string) => {
      return state.messagesByChatId[chatId]?.find(
        (message) => message.sendingStatus === "sending",
      );
    },
  },

  actions: {
    setMessages(chatId: string, messages: MessageType[]) {
      this.messagesByChatId[chatId] = messages;
    },

    setMessageStatus(
      chatId: string,
      messageId: string,
      sendingStatus: SendingStatus,
    ) {
      const message = this.messagesByChatId[chatId]?.find(
        (item) => item.message_id === messageId,
      );

      if (message) {
        message.sendingStatus = sendingStatus;
      }
    },

    addOptimisticMessage(chatId: string, content: string) {
      const now = new Date().toISOString();

      const message: ClientMessage = {
        message_id: crypto.randomUUID(),
        content,
        role: Role.USER,
        created_at: now,
        updated_at: now,
        sendingStatus: "pending",
      };

      this.messagesByChatId[chatId] ??= [];
      this.messagesByChatId[chatId].push(message);

      return message;
    },

    markMessageAsFailed(chatId: string, messageId: string) {
      const message = this.messagesByChatId[chatId]?.find(
        (item) => item.message_id === messageId,
      );

      if (message) {
        message.sendingStatus = "error";
      }
    },
  },
});
