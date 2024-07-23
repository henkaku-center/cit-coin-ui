import { NextApiRequest, NextApiResponse } from 'next';
import { NftLevels } from '@/utils';
import { formatEther, isAddress } from 'ethers/lib/utils';
import { ethers } from 'ethers';
import cjpyAbi from '@/utils/abis/CitCoin.json';
import { citSigner } from '@/utils/contract/etherUtils';

const cjpyAddress = process.env.NEXT_PUBLIC_CIT_COIN_ADDRESS as `0x{string}`;

const cjpy = new ethers.Contract(cjpyAddress, cjpyAbi, citSigner);
import axios from 'axios';

export default async function NFTHandler(req: NextApiRequest, resp: NextApiResponse) {
  try {
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
        return resp.status(400).json({ address: 'This field is required' });
      }
      if (!isAddress(address)) {
        return resp.status(400).json({ address: 'Invalid address is supplied' });
      }

      // Check if user has already earned an NFT

      const balance = parseInt(formatEther(await cjpy.balanceOf(address)));

      if (balance < 10000) {
        return resp.status(400).json({
          code: 'INSUFFICIENT_FUNDS',
          message: 'Insufficient balance to claim NFT',
        });
      }

      axios
        .post(`${process.env.HENKAKU_API_BASE_URL}/ipfs/cit`, {
          address: address,
          points: balance,
        })
        .then((response) => {
          axios.get(response.data.tokenUri).then((tokenResp) => {
            return resp.status(200).json({
              tokenUri: response.data.tokenUri,
              nft: tokenResp.data,
            });
          });
        })
        .catch((err: any) => {
          console.error(err); // non API errors
          const errorInfo = {
            code: err.code,
            message: err.message,
            data: err.data,
          };
          console.error(JSON.stringify(errorInfo));
          return resp.status(500).json(err);
        });

      /**
       * This part is commented out since we use Henkaku API to pin images to pinata
       */
      // IpfsUtils.pin({ address: address, points: balance }).then((data) => {
      //   return resp.status(200).json(data);
      // }).catch((err) => {
      //   return resp.status(500).json(err);
      // });
    } else {
      return resp.status(405);
    }
  } catch (err: any) {
    console.error(err); // non API errors
    const errorInfo = {
      code: err.code,
      message: err.message,
      data: err.data,
    };
    console.error(JSON.stringify(errorInfo));
    return resp.status(500).json(err);
  }
}
