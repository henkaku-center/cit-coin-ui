import { optimism, optimismSepolia } from 'wagmi/chains';

interface ContractAddress {
  [name: string]: `0x${string}`;
}

export const defaultChain =
  process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? optimism : optimismSepolia;

interface getContractAddressArg {
  name: keyof ContractAddress;
  chainId: number | undefined;
}

const contractAddress: ContractAddress = {
  cJPY: process.env.NEXT_PUBLIC_CJPY_ADDRESS as `0x${string}`,
  LearnToEarn: process.env.NEXT_PUBLIC_LEARN_TO_EARN_ADDRESS as `0x${string}`,
  NFT: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
  Faucet: process.env.NEXT_PUBLIC_FAUCET_ADDRESS as `0x${string}`,
};

export const getContractAddress = (name: keyof ContractAddress) => {
  return contractAddress[name];
};
