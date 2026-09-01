import { api } from "@/api/axios";

export const apiMessageList = async (chatId: string) =>
  await api.get(`/messages/${chatId}/user-assistant`);
