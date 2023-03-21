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
        //@ts-ignore
        sheets: response.data.sheets?.map(({ properties }) => properties?.title) ?? [],
      },
    );
  });
}