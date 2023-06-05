import { NextApiRequest, NextApiResponse } from 'next';
import { IpfsUtils, NftLevels } from '@/utils';

export default async function NFT(
  req: NextApiRequest,
  resp: NextApiResponse) {

  if (req.method == 'GET') {
    return resp.status(200).json({
      results: NftLevels,
    });
  } else if (req.method == 'POST') {
    if (!req.body.score) {
      resp.status(400).json({
        score: ['This field is required'],
      });
    }
    let score = 0;
    try {
      score = parseInt(req.body.score);
      if (score < 10000) {
        return resp.status(400).json({
          code: 'INSUFFICIENT_FUNDS',
          message: 'Insufficient balance to claim NFT',
        });
      }
    } catch (e) {
      return resp.status(400).json({
        code: 'INVALID DATA',
        message: 'Invalid Data Supplied',
      });
    }
    let image = await IpfsUtils.renderSvg(score);
    resp.setHeader('Content-Type', 'image/png');
    // resp.setHeader('Content-length', image.length);
    return resp.send(image);

  } else {
    return resp.status(405);
  }
}