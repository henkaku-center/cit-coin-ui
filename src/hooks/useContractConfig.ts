import { getContractAddress } from '@/utils/contract';
import LearnToEarnABI from '@/utils/abis/LearnToEarn.json';
import CitNFTABI from '@/utils/abis/CitNFT.json';
import cJpyABI from '@/utils/abis/CJPY.json';
import faucetABI from '@/utils/abis/Faucet.json';

export const UseContractConfig = (name: 'cJPY' | 'LearnToEarn' | 'NFT' | 'Faucet') => {
  const contractAddress = getContractAddress(name);
  let abi: any;
  switch (name) {
    case 'LearnToEarn':
      abi = LearnToEarnABI;
      break;
    case 'cJPY':
      abi = cJpyABI;
      break;
    case 'NFT':
      abi = CitNFTABI;
      break;
    case 'Faucet':
      abi = faucetABI;
      break;
    default:
      throw 'Invalid Contract Name selected';
  }

  return { contractAddress, abi };
};
