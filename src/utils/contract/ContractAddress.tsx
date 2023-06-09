import { polygon, polygonMumbai } from 'wagmi/chains';

interface ContractAddress {
  [name: string]: `0x${string}`;
}

export const defaultChain = process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? polygon : polygonMumbai;

// export const defaultChainID = polygonMumbai;

interface getContractAddressArg {
  name: keyof ContractAddress;
  chainId: number | undefined;
}

const contractAddress: ContractAddress = {
  CitCoin: process.env.NEXT_PUBLIC_CIT_COIN_ADDRESS as `0x${string}`,
  LearnToEarn: process.env.NEXT_PUBLIC_LEARN_TO_EARN_ADDRESS as `0x${string}`,
  NFT: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
};

export const getContractAddress = (name: keyof ContractAddress) => {
  return contractAddress[name];
};