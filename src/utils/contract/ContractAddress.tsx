import { polygon, polygonMumbai } from 'wagmi/chains';

interface ContractAddress {
  [name: string]: `0x${string}`
}

export const defaultChain = process.env.production ? polygon : polygonMumbai;

// export const defaultChainID = polygonMumbai;

interface getContractAddressArg {
  name: keyof ContractAddress;
  chainId: number | undefined;
}

const contractAddress: ContractAddress = {
  CitCoin: process.env['CIT_COIN_ADDRESS'] as `0x${string}`,
  LearnToEarn: process.env['LEARN_TO_EARN_ADDRESS'] as `0x${string}`,
};

// export enum DeployedContracts{
//   CitCoin= 'CitCoin',
//   LearnToEarn= 'LearnToEarn'
// }

export const getContractAddress = (name: keyof ContractAddress) => {
  return contractAddress[name];
};