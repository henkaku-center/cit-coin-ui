import { NextApiRequest, NextApiResponse } from 'next';
import { NftLevels } from '@/utils';

export default async function(
  req: NextApiRequest,
  resp: NextApiResponse) {

  if (req.method == 'GET') {
    return resp.status(200).json({
      results: NftLevels
    })
  }

}