import { google } from 'googleapis';

const GOOGLE_APPLICATION_CREDENTIALS = './keys/google-sheets-service-account.json';
const auth = new google.auth.GoogleAuth({
  keyFile: GOOGLE_APPLICATION_CREDENTIALS,
  // scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

google.options({
  auth: auth,
});

export const sheets = google.sheets({
  auth: auth,
  version: 'v4',
});