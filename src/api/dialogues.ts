import { api } from "@/api/axios";

export const apiDialogueList = async () =>
  await api.get("/dialogues");

export const apiCreateDialogue = async () =>
  await api.post("/dialogues");

export const apiDeleteDialogue = async (dialogueId: string) =>
  await api.delete(`/dialogues/${dialogueId}`);
