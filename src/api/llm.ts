import { api } from "@/api/axios";

export const apiGenerateWithTools = async (chatId: string, message: string) => (
  await api.post("/llm/generate_with_tools",
    {
      message,
    },
    {
      params: {
        chat_id: chatId,
      }
    }
  )
);
