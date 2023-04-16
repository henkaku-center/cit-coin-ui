import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiError, ApiResponseCodes, ApiSuccess } from '@/types';
import { isAddress } from 'ethers/lib/utils';
import { sendMatic } from '@/utils/contract/etherUtils';
import { ethers } from 'ethers';

async function handlePost(req: NextApiRequest, resp: NextApiResponse<ApiSuccess | ApiError>) {
  /**
   * @dev This method handles POST requests to the faucet API where user can request some matic coins as rewards
   */
  const { address } = req.body;
  // add validation here
  if (!address) {
    return resp.status(400).json({
      code: ApiResponseCodes.WALLET_NOT_PROVIDED,
      message: 'WALLET_ADDRESS_NOT_PROVIDED',
      data: req.body,
    });
  }
  if (!isAddress(address)) {
    return resp.status(400).json({
      code: ApiResponseCodes.INVALID_WALLET,
      message: 'INVALID_WALLET_ADDRESS',
      data: req.body,
    });
  }

  sendMatic(address, ethers.utils.parseEther('0.2')).then((txn) => {
    console.log(txn.hash);
    return resp.status(200).json({
      code: ApiResponseCodes.SUCCESS,
      message: 'SUCCESSFULLY_SENT_TOKENS',
      data: {
        transaction: txn,
      },
    });
  }).catch((err) => {
    console.log(err);
    return resp.status(500).json({
      code: ApiResponseCodes.UNKNOWN_ERROR,
      message: 'UNKNOWN_ERROR',
    });
  });
}

async function handleGet(req: NextApiRequest, resp: NextApiResponse) {
  /**
   * @dev This method handles GET requests to the faucet API where user gets information about the faucet and current
   * claimable rewards
   */
  let { address } = req.query;
  if (!address) {
    return resp.status(400).json({
      code: ApiResponseCodes.WALLET_NOT_PROVIDED,
      message: 'WALLET_ADDRESS_NOT_PROVIDED',
      data: req.query,
    });
  }
  if (typeof address !== 'string') {
    // if the query param is an array
    address = address.pop();
  }
  if (!isAddress(address as `0x${string}`)) {
    return resp.status(400).json({
      code: ApiResponseCodes.INVALID_WALLET,
      message: 'INVALID_WALLET_ADDRESS',
      data: address,
    });
  }
  // TODO: add the logic to get the claimable rewards
  return resp.status(200).json({
    code: 'SUCCESS',
    message: 'SUCCESSFULLY_SENT_TOKENS',
    data: address,
  });

}

export default async function FaucetApi(
  req: NextApiRequest,
  resp: NextApiResponse,
) {
  switch (req.method) {
    case 'POST':
      return handlePost(req, resp);
      break;
    case 'GET':
      return handleGet(req, resp);
      break;
    default:
      return resp.status(400).json({
        code: 'INVALID_REQUEST',
      });
  }
}