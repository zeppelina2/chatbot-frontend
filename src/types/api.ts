export interface ChatApiType {
  id: string;
  name: string;
}

export interface MessageApiType {
  id: string;
  chat_id: string;
  role: "user" | "assistant";
  content: string;
}
