// import { Quest } from '@/types';
//
// export interface TQuestStorage {
//   sheetId: string
//   published: Date | string,
//   questions: Quest[]
// }

// Use QuestData if file storage doesn't work
// let QuestData: TQuestStorage = {
//   sheetId: '',
//   published: new Date(),
//   questions: [],
// };

// async function setQuest(questions: Quest[], sheetId?: string) {
//   const data: TQuestStorage = {
//     sheetId: sheetId ?? '',
//     published: new Date(),
//     questions: questions,
//   };
//   return new Promise<TQuestStorage>((resolve, reject) => {
//     QuestData = data;
//     return resolve(data);
//   });
// }
//
// async function getQuest() {
//   let content = {};
//   return new Promise<TQuestStorage>((resolve, reject) => {
//     return resolve(QuestData);
//   });
// }
//
// const QuestStorage = {
//   setQuest,
//   getQuest,
// };

export {};
