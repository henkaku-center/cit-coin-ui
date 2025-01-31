import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiError, ApiResponseCodes, ApiSuccess } from '@/types';
import { isAddress } from 'ethers/lib/utils';
import { sendCrypto } from '@/utils/contract/etherUtils';

async function handlePost(req: NextApiRequest, resp: NextApiResponse<ApiSuccess | ApiError>) {
  /**
   * @dev This method handles POST requests to the faucet API where user can request some crypto coins as rewards
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

  sendCrypto(address)
    .then((txn) => {
      return resp.status(200).json({
        code: ApiResponseCodes.SUCCESS,
        message: 'SUCCESSFULLY_SENT_TOKENS',
        data: {
          transaction: txn,
        },
      });
    })
    .catch((err) => {
      return resp.status(500).json({
        code: ApiResponseCodes.CONTRACT_ERROR,
        message: 'ERROR_WHILE_SENDING_TOKENS',
        details: err,
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

export default async function FaucetApi(req: NextApiRequest, resp: NextApiResponse) {
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
