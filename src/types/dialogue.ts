import Message from "./message";

interface Dialogue {
  chat_id: string;
  user_id: string;
  messages: Message[]
  name: string;
  created_at: string
  updated_at: string
}

export default Dialogue
