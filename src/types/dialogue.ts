import MessageType from "./message";

interface DialogueType {
  chat_id: string;
  user_id: string;
  messages: MessageType[]
  name: string;
  created_at: string
  updated_at: string
}

export default DialogueType
