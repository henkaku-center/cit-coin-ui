// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { firebase_client, sheets_client } from '@/utils/google_client';
import { TQuestStorage } from '@/types';

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
    let fields = await sheets_client.getSheets();

    if (!fields.includes(sheetId)) {
      res.status(400).json({ code: 'INVALID_SHEET_ID' });
    }

    let response = await sheets_client.getQuests(sheetId);

    firebase_client.setQuests(response, sheetId).then(() => {
      return res.status(200).json({ code: 'SUCCESS' });
    }).catch((err) => {
      return res.status(500);
    });

    // QuestStorage.setQuest(response, sheetId).then(data => {
    //   return res.status(200).json(data);
    // }).catch((err) => {
    //   return res.status(500).json({ code: 'DB_ERROR' });
    // });

  } else {
    // Handling GET Requests

    let sheetId = req.query.sheet as string ?? '';
    if (sheetId.length) {
      // Admin calls this
      let fields = await sheets_client.getSheets();
      if (!fields.includes(sheetId)) {
        res.status(400).json({ code: 'INVALID_SHEET_ID' });
      }

      let quests = await sheets_client.getQuests(sheetId);
      return res.status(200).json({
        sheetId: sheetId,
        published: new Date(),
        questions: quests,
      });
    } else {
      //student calls this
      let sheets = await firebase_client.getQuests();
      return res.status(200).json(sheets);
    }
  }
}
