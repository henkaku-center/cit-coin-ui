import { ethers } from 'ethers';
import { polygon } from 'wagmi/chains';
import { defaultChain } from '@/utils/contract/ContractAddress';
import faucetAbi from '@/utils/abis/Faucet.json';

const rpcUrl = defaultChain === polygon ? 'https://rpc-mainnet.maticvigil.com' : 'https://rpc-mumbai.maticvigil.com';
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY as string || '', provider);


const faucetAddress = process.env.FAUCET_ADDRESS as `0x{string}`;

const faucet = new ethers.Contract(
  faucetAddress,
  faucetAbi,
  signer,
);

export function sendMatic(recipient: string, _amount: ethers.BigNumber) {
  return new Promise<ethers.providers.TransactionResponse>((resolve, reject) => {
    faucet.requestTokens(recipient).then((tx: ethers.ContractTransaction) => {
      resolve(tx);
    }).catch((error: any) => {
      reject(error);
    });
  });
}