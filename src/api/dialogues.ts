import { api } from "@/api/axios";

const TEST_USER_ID = "59aecad2-7e31-4f6c-8de8-813e67938820";

export const apiDialogueList = async () =>
  await api.get("/dialogues", {
    params: {
      user_id: TEST_USER_ID,
    },
  });

export const apiCreateDialogue = async () =>
  await api.post("/dialogues", null, {
    params: {
      user_id: TEST_USER_ID,
    },
  });
