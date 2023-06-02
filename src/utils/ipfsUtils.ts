import PinataClient from '@pinata/sdk';


const PINATA_IPFS_BASE_URL = process.env.PINATA_IPFS_BASE_URL ?? 'https://gateway.pinata.cloud/ipfs/';

// const { PINATA_API_KEY, PINATA_API_SECRET } = process.env;
// if (!(PINATA_API_KEY || PINATA_API_SECRET)) {
//   console.error('Environment variables PINATA_API_KEY and PINATA_API_SECRET are required to run the pinata client');
// }
// const pinata = new PinataClient(PINATA_API_KEY, PINATA_API_SECRET);


export const NftLevels = [
  {
    title: 'Beginner',
    description: 'This is a basic badge that unlocks at 3000cJPY.',
    earning: 3000,
    url: '/nft/art1.svg',
  },
  {
    title: 'Intermediate',
    description: 'This badge unlocks when you earn at least 5000cJPY.',
    earning: 5000,
    url: '/nft/art2.svg',
  },
  {
    title: 'Expert',
    description: 'This badges unlocks only when you earn at least 8000cJPY.',
    earning: 8000,
    url: '/nft/art3.svg',
  },
];

export {};
