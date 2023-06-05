import PinataClient from '@pinata/sdk';
import { Canvg, presets } from 'canvg';
import { DOMParser } from 'xmldom';
import canvas from 'canvas';
import { normalNftTemplate, PremiumNftTemplate } from '@/utils/svgRes';

const PINATA_IPFS_BASE_URL = process.env.PINATA_IPFS_BASE_URL ?? 'https://gateway.pinata.cloud/ipfs/';

const { PINATA_API_KEY, PINATA_API_SECRET } = process.env;
if (!(PINATA_API_KEY || PINATA_API_SECRET)) {
  console.error('Environment variables PINATA_API_KEY and PINATA_API_SECRET are required to run the pinata client');
}
const pinata = new PinataClient(PINATA_API_KEY, PINATA_API_SECRET);

async function toPng(data: { width: number, height: number, svg: string }) {
  const { width, height, svg } = data;
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');
  // @ts-ignore
  const v = await Canvg.from(ctx, svg, preset);
  await v.render();
  const blob = await canvas.convertToBlob();
  const pngUrl = URL.createObjectURL(blob);

  return pngUrl;
}

function getRewardGraphics(point: number) {
  console.log('=================================================================')
  console.log(point)
  console.log('=================================================================')
  if (point >= 20000) {
    return PremiumNftTemplate;
  } else if (point >= 10000) {
    return normalNftTemplate;
  } else return null;
}


export const NftLevels = [
  {
    title: 'Normal',
    description: 'This is a basic badge that unlocks at 10000cJPY.',
    earning: 10000,
    url: '/nft/normal.png',
  },
  {
    title: 'Premium',
    description: 'This badge unlocks when you earn at least 20000cJPY.',
    earning: 20000,
    url: '/nft/premium.png',
  },
];

export const IpfsUtils = {
  pin: function() {

  },
  pinImage: function() {

  },
  pinMetaData: function() {

  },
  renderSvg: async function(point: number, width = 772, height = 772) {
    const preset = presets.node({
      DOMParser: DOMParser, canvas, fetch,
    });
    const svgTemplate = getRewardGraphics(point)
    if (!svgTemplate){
      return null;
    }
    const result = svgTemplate.replace('{{CJPY_BALANCE}}', `${point}`);

    const _canvas = preset.createCanvas(width, height);
    const context = _canvas.getContext('2d');
    const renderer = Canvg.fromString(context, result, preset);
    // const renderer = Canvg.fromString(context, result, preset);
    await renderer.render();
    return _canvas.toBuffer('image/png');
  },
  getRewardGraphics,
  getStoragePath: function(address: `0x${string}`) {
    return `pitpa/citNFT/${address.toLowerCase()}.json`;
  },
  retrieveFromStorage: function(address: `0x${string}`) {

  },
};
