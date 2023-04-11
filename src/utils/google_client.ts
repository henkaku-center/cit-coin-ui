import { google } from 'googleapis';
import { Buffer } from 'buffer';
import { Quest, TQuestStorage } from '@/types';
import { initializeApp } from '@firebase/app';
import { getDatabase, ref, set, get, child } from '@firebase/database';


const _quest_path = process.env.NEXT_PUBLIC_LEARN_TO_EARN_ADDRESS || 'dev';

const creds = JSON.parse(Buffer.from(
  process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS || '',
  'base64',
).toString('ascii'));

const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  credentials: creds,
});

google.options({
  auth: auth,
});

export const sheets = google.sheets({
  auth: auth,
  version: 'v4',
});

const firebase_db = getDatabase(
  initializeApp({
    // databaseURL: 'https://citcoin-default-rtdb.asia-southeast1.firebasedatabase.app',
    databaseURL: process.env.FIREBASE_DB_URL || '',
  }),
);


export const sheets_client = {
  getQuests: (sheetId: string) => new Promise<Quest[]>((resolve, reject) => {
    sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: `${sheetId}!B2:G16`,
    }).then((response) => {
      let questions = response.data.values?.map((d: string[]) => ({
        question: d[0],
        options: d.slice(1, 5).filter((a) => a.length > 0),  // used to remove empty string
        selection: d[5] == 'multiple' ? 'multiple' : 'single',
      })).filter(({ question }) => question !== undefined);
      // console.log(questions);
      return resolve(questions as Quest[]);
    }).catch((error) => {
      reject(error);
    });
  }),

  getSheets: () => new Promise<string[]>((resolve, reject) => {
    sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      fields: 'sheets.properties.title',
    }).then((response) => {
      return resolve(response.data.sheets?.map(({ properties }) => properties?.title)
        .filter((title) => (title !== undefined)) as string[]);
    }).catch(err => {
      return resolve([]);
    });
  }),
};

export const firebase_client = {
    getQuests: () => new Promise<TQuestStorage>((resolve, reject) => {
      get(child(ref(firebase_db), `sheets/${_quest_path}`)).then((snapshot) => {
        // console.log(snapshot.val());
        resolve(snapshot.val());
      }).catch((err) => {
        // console.log("==============================================================")
        // return reject({message: 'PERMISSION DENIED' })
        return reject(err);
      });
    }),

    setQuests: (data: Quest[], sheetId?: string) => new Promise((resolve, reject) => {
      let quest: TQuestStorage = {
        sheetId: sheetId ?? '',
        published: new Date().toISOString(),
        questions: data,
      };
      set(ref(firebase_db, `sheets/${_quest_path}`), quest).then((resp) => {
        resolve(resp);
      }).catch((err) => {
        // console.log(err)
        return reject(err);
      });
    }),
  }
;
