// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { QuestInterface } from '@/types';
import { google } from 'googleapis';

type Data = {
  created_at: Date
  expires_at: Date
  questions: QuestInterface[]
}

export default async function getQuests(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const GOOGLE_APPLICATION_CREDENTIALS = './keys/google-sheets-service-account.json';
  const auth = new google.auth.GoogleAuth({
    keyFile: GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  google.options({
    auth: auth,
  });

  const sheets = google.sheets({
    auth: auth,
    version: 'v4',
  });

  await sheets.spreadsheets.values
    .get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'B2:G16',
    })
    .then((response) => {
      // console.log(response.data);
      let questions = response.data.values?.map((d: string[]) => ({
        question: d[0],
        options: d.slice(1, 5),
        selection: d[5]??'single',

      })).filter(({ question }) => question !== undefined);
      console.log(questions);
      res.status(200).json({
        created_at: new Date(),
        expires_at: new Date(),
        //@ts-ignore
        questions: questions,
      });
    });

  res.status(200).json({
    created_at: new Date(),
    expires_at: new Date(),
    questions: [
      // {
      //   question: 'Document Title',
      //   selection: 'single',
      //   options: [doc.title, 'ABC', 'DEF', 'GHI']
      // },
      {
        question: 'Who Invented Blockchain Technology?',
        selection: 'single',
        options: ['Satoshi Nakamoto', 'Linus Torvalds', 'Bill Gates', 'Reid Hoffman'],
      },
      {
        question: 'What is Pitpa Learn to Earn?',
        selection: 'single',
        options: ['A Web hosting platform', 'An internet service provider', 'A learning platform', 'An Automated Teller Machine'],
      },
      {
        question: 'What can you earn through Pitpa Learn to Earn?',
        selection: 'multiple',
        options: ['NFTs', 'Certifications', 'Cryptocurrency', 'Real Cash'],
      },
      {
        question: 'What is Cryptocurrency?',
        selection: 'multiple',
        options: [
          'A digital currency in which transactions are verified and records maintained by a decentralized system using cryptography, rather than by a centralized authority.',
          'An internet-based medium of exchange which uses cryptographical functions to conduct financial transactions',
          'A form of money that is centralized, backed, and managed by a recognized government entity',
          'There is no word such as cryptocurrency',
        ],
      },
    ],
  });
}
