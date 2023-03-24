import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { sheets } from '@/utils/google_client';

interface Data {
  sheets: string[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  await sheets.spreadsheets.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    fields: 'sheets.properties.title',
  }).then(response => {
    return res.status(200).json(
      {
        sheets: response.data.sheets?.map(({ properties }, idx) => properties?.title ?? `sheet-${idx}`) ?? [],
      },
    );
  }).catch((err) => {
    return res.status(err.response.status).json(err.response.data);
  });
}