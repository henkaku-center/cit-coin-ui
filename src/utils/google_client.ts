import { google } from 'googleapis';
import { Buffer } from 'buffer';

const creds =JSON.parse(Buffer.from(
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