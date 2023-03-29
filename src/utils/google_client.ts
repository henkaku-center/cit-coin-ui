import { google } from 'googleapis';
import { Buffer } from 'buffer';
import { Quest } from '@/types';

const creds = JSON.parse(Buffer.from(
  process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS || '',
  'base64',
).toString('ascii'));

const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  credentials: creds,
});

// google.options({
//   auth: auth,
// });

export const sheets = google.sheets({
  auth: auth,
  version: 'v4',
});


export const getSheetTitles = () => {
  return new Promise<string[]>((resolve, reject) => {
    sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      fields: 'sheets.properties.title',
    }).then((response) => {
      return resolve(response.data.sheets?.map(({ properties }) => properties?.title)
        .filter((title) => (title !== undefined)) as string[]);
    }).catch(err => {
      return resolve([]);
    });
  });
};


export const getSheetQuests = (sheetId: string) => {
  return new Promise<Quest[]>((resolve, reject) => {
    sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: `${sheetId}!B2:G16`,
    }).then((response) => {
      let questions = response.data.values?.map((d: string[]) => ({
        question: d[0],
        options: d.slice(1, 5).filter((a) => a.length > 0),  // used to remove empty string
        selection: d[5] == 'multiple' ? 'multiple' : 'single',
      })).filter(({ question }) => question !== undefined);
      console.log(questions);
      return resolve(questions as Quest[]);
    }).catch((error) => {
      reject(error);
    });
  });
};