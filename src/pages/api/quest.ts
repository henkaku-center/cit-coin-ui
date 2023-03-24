// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Quest } from '@/types';
import { google } from 'googleapis';
import { sheets } from '@/utils/google_client';

type Data = {
  created_at: Date
  expires_at: Date
  questions: Quest[]
}

export default async function getQuests(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  let sheetId = req.query.sheet ?? '';
  // if (sheetId.length) {
  //   sheetId += '!';
  // }
  await sheets.spreadsheets.values
    .get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: `${sheetId}!B2:G16`,
    })
    .then((response) => {
      let questions = response.data.values?.map((d: string[]) => ({
        question: d[0],
        options: d.slice(1, 5).filter((a) => a.length > 0),  // used to remove empty string
        selection: d[5] == 'multiple' ? 'multiple' : 'single',

      })).filter(({ question }) => question !== undefined);
      return res.status(200).json({
        created_at: new Date(),
        expires_at: new Date(),
        //@ts-ignore
        questions: questions,
      });
    }).catch((err) => {
      return res.status(err.response.status).json(err.response.data);
    });
}
