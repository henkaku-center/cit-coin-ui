import { NextApiRequest, NextApiResponse } from 'next';
import { IpfsUtils, NftLevels, svgUtils } from '@/utils';
import { formatEther, formatUnits, isAddress, parseEther } from 'ethers/lib/utils';
import { ethers } from 'ethers';
import nftAbi from '@/utils/abis/CitNFT.json';
import cjpyAbi from '@/utils/abis/CitCoin.json';
import { citSigner } from '@/utils/contract/etherUtils';

const nftAddress = process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x{string}`;
const cjpyAddress = process.env.NEXT_PUBLIC_CIT_COIN_ADDRESS as `0x{string}`;

const cjpy = new ethers.Contract(cjpyAddress, cjpyAbi, citSigner);
const nft = new ethers.Contract(nftAddress, nftAbi, citSigner);

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
    const { address } = req.body;

    // check if address exists or is valid
    if (!address) {
      resp.status(400).json({ address: 'This field is required' });
    }
    if (!(isAddress(address))) {
      resp.status(400).json({ address: 'Invalid address is supplied' });
    }

    // Check if user has already earned an NFT


    const balance = parseInt(formatEther(await cjpy.balanceOf(address)));


    if (balance < 10000) {
      return resp.status(400).json({
        code: 'INSUFFICIENT_FUNDS',
        message: 'Insufficient balance to claim NFT',
      });
    }

    IpfsUtils.pin({ address: address, points: balance }).then((data) => {
      return resp.status(200).json(data);
    }).catch((err) => {
      return resp.status(500).json(err);
    });

  } else {
    return resp.status(405);
  }
}