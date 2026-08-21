import { api } from "@/api/axios";

export const apiGenerateWithTools = async (chatId: string, message: string) =>
  await api.post("/llm/generate_with_tools",
    {
      message,
    },
    {
      params: {
        chat_id: chatId,
      }
    }
  );

export const apiGenerateDialogueName = async (chatId: string, message: string) =>
  await api.put(`/llm/generate_dialogue_name/${chatId}`, { message });
