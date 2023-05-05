export * from './_apiResponse';
export interface Quest {
  question: string;
  selection: 'single' | 'multiple';
  options: string[];
}

export interface QuestWithAnswer extends Quest {
  answer: number;
}

export interface TQuestStorage {
  sheetId: string
  published: Date | string,
  questions: Quest[]
}