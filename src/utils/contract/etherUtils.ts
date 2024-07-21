import { ethers } from 'ethers';
import { polygon } from 'wagmi/chains';
import { defaultChain } from '@/utils/contract/ContractAddress';
import faucetAbi from '@/utils/abis/Faucet.json';
import { parseEther } from 'ethers/lib/utils';

const faucetAddress = process.env.NEXT_PUBLIC_FAUCET_ADDRESS as `0x{string}`;
/**
 * Currently running RPC URLS:
 * - https://polygon.llamarpc.com
 * - https://polygon.drpc.org
 * - https://polygon-mainnet.infura.io
 */
const rpcUrl =
  defaultChain === polygon ? 'https://polygon.drpc.org' : ' https://rpc-amoy.polygon.technology';

const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
export const citSigner = new ethers.Wallet(
  (process.env.OPERATOR_PRIVATE_KEY as string) || '',
  provider,
);
const faucet = new ethers.Contract(faucetAddress, faucetAbi, citSigner);

export function sendMatic(recipient: string) {
  return new Promise((resolve, reject) => {
    faucet
      .requestTokens(recipient, {
        value: parseEther('0.0'),
        // gasLimit: null,
        maxFeePerGas: 200e9,
        maxPriorityFeePerGas: 200e9,
      })
      .then((tx: ethers.ContractTransaction) => {
        resolve(tx);
      })
      .catch((error: any) => {
        console.log(JSON.stringify({ error }));
        reject(error);
      });
  });
}
