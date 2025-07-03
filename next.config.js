const withTM = require('next-transpile-modules')([
  'antd',
  '@ant-design/icons',
  // All your installed rc-* packages
  'rc-cascader',
  'rc-checkbox',
  'rc-collapse',
  'rc-dialog',
  'rc-drawer',
  'rc-dropdown',
  'rc-field-form',
  'rc-image',
  'rc-input',
  'rc-input-number',
  'rc-mentions',
  'rc-menu',
  'rc-motion',
  'rc-notification',
  'rc-overflow',
  'rc-pagination',
  'rc-picker',
  'rc-progress',
  'rc-rate',
  'rc-resize-observer',
  'rc-segmented',
  'rc-select',
  'rc-slider',
  'rc-steps',
  'rc-switch',
  'rc-table',
  'rc-tabs',
  'rc-textarea',
  'rc-tooltip',
  'rc-tree',
  'rc-tree-select',
  'rc-upload',
  'rc-util',
  'rc-virtual-list',
]);

module.exports = withTM({
  reactStrictMode: false,
  
  // Add experimental settings for better ES module support
  experimental: {
    esmExternals: 'loose',
  },
  
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
  
  webpack(config, { isServer }) {
    // Your existing SVG rule
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Add fallbacks for client-side builds to prevent module resolution errors
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }

    // Handle ES modules more gracefully
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });

    return config;
  },
});