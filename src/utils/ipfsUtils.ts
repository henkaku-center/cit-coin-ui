import PinataClient, { PinataPinResponse } from '@pinata/sdk';
import { svgUtils } from '@/utils/svgUtils';
import { IPinRequest, PinataPinnedResponse } from '@/types/pinata.types';
import { Readable } from 'stream';

// const IPFS_BASE_URL = "https://ipfs.io/ipfs";
// const IPFS_BASE_URL = process.env.PINATA_IPFS_BASE_URL ?? 'https://gateway.pinata.cloud/ipfs';
const IPFS_BASE_URL = 'https://gateway.pinata.cloud/ipfs';

const { PINATA_API_KEY, PINATA_API_SECRET } = process.env;
if (!(PINATA_API_KEY || PINATA_API_SECRET)) {
  console.error('Environment variables PINATA_API_KEY and PINATA_API_SECRET are required to run the pinata client');
}

const pinata = new PinataClient({
  pinataApiKey: PINATA_API_KEY,
  pinataSecretApiKey: PINATA_API_SECRET,
});

export const IpfsUtils = {
  pin: async function(request: IPinRequest) {
    const imageBuffer = await svgUtils.renderSvg(request.points);
    return new Promise<PinataPinResponse>((resolve, reject) => {
      const fileName = `cit-nft-${request.address}.png`;
      pinata.pinFileToIPFS(Readable.from(imageBuffer), {
        pinataMetadata: {
          name: fileName,
        },
        pinataOptions: {
          cidVersion: 0,
        },
      }).then((response) => {
        resolve(response);
      }).catch((err) => {
        reject(err);
      });
    });
  },

  getImageUrl: function(response: PinataPinnedResponse) {
    return `${IPFS_BASE_URL}/${response.IpfsHash}`;
  },

  // getStoragePath: function(address: `0x${string}`) {
  //   return `pitpa/citNFT/${address.toLowerCase()}.json`;
  // },
  // retrieveFromStorage: function(address: `0x${string}`) {
  //
  // },
};
