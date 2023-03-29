// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Quest } from '@/types';
import { google } from 'googleapis';
import { getSheetQuests, getSheetTitles, sheets } from '@/utils/google_client';
import { activeQuest, QuestStorage, TQuestStorage } from '@/utils/questUtils';

interface ErrorResponse {
  code: string,
  message?: any
}

export default async function QuestsAPI(
  req: NextApiRequest,
  res: NextApiResponse<TQuestStorage | ErrorResponse>,
) {
  // Handling setting new quests in the chain
  if (req.method == 'POST') {
    const { sheetId } = req.body;
    // add validation here
    if (!sheetId) {
      res.status(400).json({ code: 'SHEETS_NOT_PROVIDED' });
    }
    let fields = await getSheetTitles();

    if (!fields.includes(sheetId)) {
      res.status(400).json({ code: 'INVALID_SHEET_ID' });
    }

    let response = await getSheetQuests(sheetId);

    QuestStorage.setQuest(response, sheetId).then(data => {
      return res.status(200).json(data);
    }).catch((err) => {
      return res.status(500).json({ code: 'DB_ERROR' });
    });

    // return res.status(200).json({
    //   code: "SUCCESS",
    //   questions: response,
    // });


    // await sheets.spreadsheets.get({
    //   spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    //   fields: 'sheets.properties.title',
    // }).then(response => {
    //   return res.status(200).json(response);
    //   let sheets = response.data.sheets?.map(({ properties }, idx) => properties?.title) ?? [];
    //   if (sheets.includes(sheetId)) {
    //     // here we write the content to the file
    //     return res.status(200).json(sheets);
    //   }
    //   return res.status(400).json({ code: 'INVALID_SHEET_ID' });
    // }).catch((err) => {
    //   return res.status(err.response.status).json(err.response.data);
    // });
    //
    // return res.status(200).json({});
  }

  // Handling GET Requests
  let sheetId = req.query.sheet as string ?? '';
  if (sheetId.length) {
    // Admin calls this
    let quests = await getSheetQuests(sheetId);
    return res.status(200).json({
      sheetId: sheetId,
      published: new Date(),
      questions: quests,
    });

  } else {
    //student calls this
    let quests = await QuestStorage.getQuest();
    return res.status(200).json(quests);
  }


  // Handling GET Request
  // let sheetId = req.query.sheet as string ?? '';
  // let quests = await getSheetQuests(sheetId);
  // return res.status(200).json({
  //   sheetId: sheetId,
  //   published: new Date(),
  //   questions: quests,
  // });

  // let data = await QuestStorage.getQuest();
  // return res.status(200).json(data);

  /////////////////////////////////////////////////////////////////////////////////////////////////
  // if (sheetId.length || (req.query.refetch ?? false)) {
  //   await sheets.spreadsheets.values
  //     .get({
  //       spreadsheetId: process.env.GOOGLE_SHEETS_ID,
  //       range: `${sheetId}!B2:G16`,
  //     })
  //     .then((response) => {
  //       let questions = response.data.values?.map((d: string[]) => ({
  //         question: d[0],
  //         options: d.slice(1, 5).filter((a) => a.length > 0),  // used to remove empty string
  //         selection: d[5] == 'multiple' ? 'multiple' : 'single',
  //
  //       })).filter(({ question }) => question !== undefined);
  //       if (questions?.length) {
  //         console.log(questions);
  //         //@ts-ignore false positive
  //         activeQuest.setQuestions(questions ?? []);
  //       }
  //       return res.status(200).json({
  //         created_at: new Date(),
  //         expires_at: new Date(),
  //         //@ts-ignore
  //         questions: questions,
  //       });
  //     }).catch((err) => {
  //       return res.status(err.response.status).json(err.response.data);
  //     });
  // } else {
  //   return res.status(200).json({
  //     sheetId: sheetId,
  //     published: new Date(),
  //     questions: activeQuest.questions,
  //   });
  // }
}
