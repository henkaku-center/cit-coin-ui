// export const
import { Canvg, presets } from 'canvg';
import { DOMParser } from 'xmldom';
import canvas from 'canvas';
import { normalNftTemplate, PremiumNftTemplate } from '@/utils/svgRes';


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


function getRewardGraphics(point: number) {
  if (point >= 20000) {
    return PremiumNftTemplate;
  } else if (point >= 10000) {
    return normalNftTemplate;
  } else return null;
}

export const svgUtils = {
  renderSvg: async function(point: number, width = 772, height = 772) {
    const preset = presets.node({
      DOMParser: DOMParser, canvas, fetch,
    });
    const svgTemplate = getRewardGraphics(point);
    if (!svgTemplate) {
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
};