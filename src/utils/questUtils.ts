import { Quest } from '@/types';
import fs from 'fs';
import path from 'path';


export const isAddressValid = () => {
  return false;
};

export interface TQuestStorage {
  sheetId: string
  published: Date,
  questions: Quest[]
}

async function setQuest(questions: Quest[], sheetId?: string) {
  const data: TQuestStorage = {
    sheetId: sheetId ?? '',
    published: new Date(),
    questions: questions,
  };
  return new Promise<TQuestStorage>((resolve, reject) => {
    fs.writeFile(
      path.join(process.cwd(), 'keys', 'db.json'),
      Buffer.from(JSON.stringify(data)),
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
  });
}

async function getQuest() {
  let content = {};
  return new Promise<TQuestStorage>((resolve, reject) => {
    fs.readFile(path.join(process.cwd(), 'keys', 'db.json'), function(err, data) {
      // Check for errors
      if (err) {
        if (err.code === 'ENOENT') {
          setQuest([], '');
          return resolve({
            'sheetId': '',
            'published': new Date(),
            'questions': [],
          });
        }
        return reject(err);
      } else {
        // Converting to JSON
        content = JSON.parse(data.toString());
        return resolve(content as TQuestStorage);
      }

    });
  });
}

export const QuestStorage = {
  setQuest,
  getQuest,
};

export const activeQuest = {
  updated: new Date(),
  questions: <Quest[]>[],
  setQuestions: function(quest: Quest[]) {
    this.questions = quest;
  },
};