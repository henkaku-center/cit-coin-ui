const nextTranslate = require('next-translate-plugin');

/** @type {import('next').NextConfig} */
module.exports = nextTranslate({
  reactStrictMode: true,
  trailingSlash: true,
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS' },
          { key: 'Access-Control-Allow-Origin', value: 'https://app.safe.global' },
        ],
      },
    ];
  },
});
