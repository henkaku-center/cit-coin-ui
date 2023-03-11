export interface QuestInterface {
  question: string
  selection: 'single' | 'multiple'
  options: string[]
}