import { polygon, polygonMumbai } from 'wagmi/chains';

interface ContractAddress {
  [name: string]: {
    [chainId: number]: `0x${string}`
  };
}

interface getContractAddressArg {
  name: keyof ContractAddress;
  chainId: number | undefined;
}

const contractAddress: ContractAddress = {
  CitCoin: {
    [polygonMumbai.id]: process.env['CIT_COIN_ADDRESS '] as `0x${string}`,
  },
  LearnToEarn: {
    [polygonMumbai.id]: process.env['LEARN_TO_EARN_ADDRESS '] as `0x${string}`,
  },
};

// const defaultChainID = process.env.production ? avalanche.id : avalancheFuji.id
const defaultChainID = polygonMumbai.id;

const getContractAddress = ({ name, chainId }: getContractAddressArg) => {
  return contractAddress[name][chainId || defaultChainID];
};

export { contractAddress, defaultChainID, getContractAddress };
