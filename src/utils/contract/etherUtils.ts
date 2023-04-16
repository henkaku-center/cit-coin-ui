import { ethers } from 'ethers';
import { polygon } from 'wagmi/chains';
import { defaultChain } from '@/utils/contract/ContractAddress';


const rpcUrl = defaultChain === polygon ? 'https://rpc-mainnet.maticvigil.com' : 'https://rpc-mumbai.maticvigil.com';
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY as string || '', provider);


const maticTokenAddress = '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889';
const maticTokenAbi = [
  'function transfer(address to, uint256 value) public returns (bool)',
];
const maticToken = new ethers.Contract(
  maticTokenAddress,
  maticTokenAbi,
  signer,
);

export function sendMatic(recipient: string, _amount: ethers.BigNumber) {
  // const recipient = '0x0fa07b28a6821ad5b190a1be268e56854e741011';
  const amount = ethers.utils.parseEther('0.02');
  return new Promise<ethers.providers.TransactionResponse>((resolve, reject) => {
    signer.sendTransaction({
      to: recipient,
      value: amount,
    }).then((tx) => {
      // console.log(`Transaction hash: ${tx.hash}`);
      resolve(tx);
    }).catch((error) => {
      reject(error);
      // console.log(error);
    });
  });
}