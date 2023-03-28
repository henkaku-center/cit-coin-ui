import { Quest } from '@/types';

export const activeQuest = {
  updated: new Date(),
  questions: <Quest[]>[],
  setQuestions: function(quest: Quest[]) {
    this.questions = quest;
  },
};