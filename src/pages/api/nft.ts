import { NextApiRequest, NextApiResponse } from 'next';
import { IpfsUtils, NftLevels } from '@/utils';

export default async function(
  req: NextApiRequest,
  resp: NextApiResponse) {

  if (req.method == 'GET') {
    return resp.status(200).json({
      results: NftLevels,
    });
  } else if (req.method == 'POST') {
    if (!req.body.score) {
      resp.status(400).json({
        level: ['This field is required'],
      });
    }
    let image = await IpfsUtils.renderSvg(req.body.score);
    resp.setHeader('Content-Type', 'image/png');
    resp.setHeader('Content-length', image.length);
    return resp.send(image);

  } else {
    return resp.status(405);
  }

}