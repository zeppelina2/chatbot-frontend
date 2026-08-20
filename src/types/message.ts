import Role from "./roles";

interface MessageType {
  content: string;
  role: Role;
  message_id: string;
  created_at: string;
  updated_at: string;
}

export default MessageType;
