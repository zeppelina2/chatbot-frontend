import Message from "@/types/message";
import Role from "@/types/roles";

export const mockMessages: Message[] = [
  {
    content: "Привет! Расскажи мне о мире Ойкумены.",
    role: Role.USER,
    message_id: "550e8400-e29b-41d4-a716-446655440000",
    created_at: "2026-08-17T12:30:00.000Z",
    updated_at: "2026-08-17T12:30:00.000Z",
  },
  {
    content:
      "Ойкумена — это мир, где переплетаются магия, древние государства, герои и боги.",
    role: Role.ASSISTANT,
    message_id: "550e8400-e29b-41d4-a716-446655440001",
    created_at: "2026-08-17T12:31:00.000Z",
    updated_at: "2026-08-17T12:31:00.000Z",
  },
  {
    content: "А какие государства там существуют?",
    role: Role.USER,
    message_id: "550e8400-e29b-41d4-a716-446655440002",
    created_at: "2026-08-17T12:32:00.000Z",
    updated_at: "2026-08-17T12:32:00.000Z",
  },
  {
    content:
      "В Ойкумене есть множество государств, вдохновлённых культурами античности и Возрождения.",
    role: Role.ASSISTANT,
    message_id: "550e8400-e29b-41d4-a716-446655440003",
    created_at: "2026-08-17T12:33:00.000Z",
    updated_at: "2026-08-17T12:33:00.000Z",
  },
];
