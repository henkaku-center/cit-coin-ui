import { polygon, polygonAmoy } from 'wagmi/chains';

interface ContractAddress {
  [name: string]: `0x${string}`;
}

export const defaultChain =
  process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? polygon : polygonAmoy;

interface getContractAddressArg {
  name: keyof ContractAddress;
  chainId: number | undefined;
}

const contractAddress: ContractAddress = {
  CJPY: process.env.NEXT_PUBLIC_CJPY_ADDRESS as `0x${string}`,
  LearnToEarn: process.env.NEXT_PUBLIC_LEARN_TO_EARN_ADDRESS as `0x${string}`,
  NFT: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
};

export const getContractAddress = (name: keyof ContractAddress) => {
  return contractAddress[name];
};
