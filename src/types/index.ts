export interface Quest {
  question: string;
  selection: 'single' | 'multiple';
  options: string[];
}

export interface QuestWithAnswer extends Quest{
  answer: number;
}