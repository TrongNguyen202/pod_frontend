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
  
  // Environment variables
  env: {
    BASE_URL: process.env.BASE_URL,
    NEXT_PUBLIC_API_FLASH_SHIP: process.env.NEXT_PUBLIC_API_FLASH_SHIP,
    NEXT_PUBLIC_API_PRINT_CARE: process.env.NEXT_PUBLIC_API_PRINT_CARE,
  },

  // Server runtime config
  serverRuntimeConfig: {
    baseUrl: process.env.BASE_URL,
    apiFlashShip: process.env.NEXT_PUBLIC_API_FLASH_SHIP,
    apiPrintCare: process.env.NEXT_PUBLIC_API_PRINT_CARE,
  },

  // Experimental settings
  experimental: {
    esmExternals: 'loose',
    allowMiddlewareResponseBody: true,
  },

  // Images config
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
      {
        protocol: 'http',
        hostname: '14.225.255.106',
      },
      {
        protocol: 'https',
        hostname: 'your-backend-domain.com',
      },
    ],
  },

  // Webpack config
  webpack(config, { isServer }) {
    // Your existing SVG rule
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Add fallbacks for client-side builds
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