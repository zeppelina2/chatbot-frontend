export enum LoadingType {
  MESSAGES = "messages",
  GENERATION = "generation",
  DIALOGUES = "dialogues",
  CREATE_DIALOGUES = "createDialogues",
}

export type LoadingState = {
  type: LoadingType | null;
}
