import { NextApiRequest, NextApiResponse } from 'next';
import { sheets_client } from '@/utils/google_client';

interface Data {
  sheets: string[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {

  /**
   * {
   *   "sheets": [
   *     "week-1",
   *     "week 2"
   *   ]
   * }
   */
  let sheets = await sheets_client.getSheets();
  return res.status(200).json({ sheets: sheets });

  //
  // getSheetTitles().then((response) => {
  //     return res.status(200).json(response);
  //   },
  // ).catch(err => {
  //   res.status(err.response.status).json(err.response.data);
  // });
  // await sheets.spreadsheets.get({
  //   spreadsheetId: process.env.GOOGLE_SHEETS_ID,
  //   fields: 'sheets.properties.title',
  // }).then(response => {
  //   return res.status(200).json(
  //     {
  //       sheets: response.data.sheets?.map(({ properties }, idx) => properties?.title ?? `sheet-${idx}`) ?? [],
  //     },
  //   );
  // }).catch((err) => {
  //   return res.status(err.response.status).json(err.response.data);
  // });
}