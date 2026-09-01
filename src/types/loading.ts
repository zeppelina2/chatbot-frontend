export enum LoadingType {
  MESSAGES = "messages",
  GENERATION = "generation",
  DIALOGUES = "dialogues",
}

export type LoadingState = {
  type: LoadingType | null;
}
