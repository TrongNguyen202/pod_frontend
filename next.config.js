const withTM = require('next-transpile-modules')([
  'antd',
  '@ant-design/icons',
  'rc-util',
  'rc-pagination',
  'rc-picker',
]);

module.exports = withTM({
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.tiktokcdn-us.com',
      },
      {
        protocol: 'http',
        hostname: '**.localhost',
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
});
