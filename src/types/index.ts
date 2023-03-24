export interface Quest {
  question: string;
  selection: 'single' | 'multiple';
  options: string[];
  answer?: number;
}