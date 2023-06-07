import { NextApiRequest, NextApiResponse } from 'next';
import { IpfsUtils, NftLevels, svgUtils } from '@/utils';
import { isAddress } from 'ethers/lib/utils';

export default async function NFTHandler(
  req: NextApiRequest,
  resp: NextApiResponse) {


  if (req.method == 'GET') {
    return resp.status(200).json({
      results: NftLevels,
    });
  }

  // Handling the post Request
  else if (req.method == 'POST') {
    const {address, points} = req.body;
    let errors: { address?: string, points?: string } = {};

    if (!points) {
      errors.points = 'This field is required';
    }
    // check if address exists or is valid
    if (!address) {
      errors.address = 'This field is required';
    }

    if (!(isAddress(address))) {
      errors.address = 'Invalid address is supplied';
    }
    // respond with validation error if any
    if (Object.keys(errors).length) {
      return resp.status(400).json({ errors });
    }


    let score = parseInt(points);
    if (isNaN(score)) {
      return resp.status(400).json({
        code: 'INVALID DATA',
        message: 'Invalid Data Supplied',
      });
    }
    if (score < 10000) {
      return resp.status(400).json({
        code: 'INSUFFICIENT_FUNDS',
        message: 'Insufficient balance to claim NFT',
      });
    }

    // let image = await svgUtils.renderSvg(score);
    // resp.setHeader('Content-Type', 'image/png');
    // return resp.send(image);


    IpfsUtils.pin({ address: address, points: score }).then((data) => {
      return resp.status(200).json(data);
    }).catch((err)=>{
      return resp.status(500).json(err)
    });

  } else {
    return resp.status(405);
  }
}