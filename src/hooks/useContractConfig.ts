import { getContractAddress } from '@/utils/contract';
import LearnToEarnABI from '@/utils/abis/LearnToEarn.json';
import CitNFTABI from '@/utils/abis/CitNFT.json';
import CitCoinABI from '@/utils/abis/CitCoin.json';

export const UseContractConfig = (name: 'CitCoin' | 'LearnToEarn' | 'NFT') => {
  const contractAddress = getContractAddress(name);
  let abi: any;
  switch (name) {
    case 'LearnToEarn':
      abi = LearnToEarnABI;
      break;
    case 'CitCoin':
      abi = CitCoinABI;
      break;
    case 'NFT':
      abi = CitNFTABI;
      break;
    default:
      throw 'Invalid Contract Name selected';
  }

  return { contractAddress, abi };
};
