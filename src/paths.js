export const paths = {
  index: '/',
  checkout: '/checkout',
  contact: '/contact',
  pricing: '/pricing',
  auth: {
    jwt: {
      login: '/auth/login',
      register: '/auth/register',
    },
  },
  authDemo: {
    forgotPassword: {
      classic: '/auth-demo/forgot-password/classic',
      modern: '/auth-demo/forgot-password/modern',
    },
    login: {
      classic: '/auth-demo/login/classic',
      modern: '/auth-demo/login/modern',
    },
    register: {
      classic: '/auth-demo/register/classic',
      modern: '/auth-demo/register/modern',
    },
    resetPassword: {
      classic: '/auth-demo/reset-password/classic',
      modern: '/auth-demo/reset-password/modern',
    },
    verifyCode: {
      classic: '/auth-demo/verify-code/classic',
      modern: '/auth-demo/verify-code/modern',
    },
  },
  dashboard: {
    index: '/',
    shops: '/shops',
    orders: '/orders',
    academy: {
      index: '/dashboard/academy',
      courseDetails: '/dashboard/academy/courses/:courseId',
    },
    account: '/dashboard/account',
    analytics: '/dashboard/analytics',
    blank: '/dashboard/blank',
    blog: {
      index: '/dashboard/blog',
      postDetails: '/dashboard/blog/:postId',
      postCreate: '/dashboard/blog/create',
    },
    calendar: '/dashboard/calendar',
    chat: '/dashboard/chat',
    crypto: '/dashboard/crypto',
    customers: {
      index: '/dashboard/customers',
      details: '/dashboard/customers/:customerId',
      edit: '/dashboard/customers/:customerId/edit',
    },
    ecommerce: '/dashboard/ecommerce',
    fileManager: '/dashboard/file-manager',
    invoices: {
      index: '/dashboard/invoices',
      details: '/dashboard/invoices/:orderId',
    },
    jobs: {
      index: '/dashboard/jobs',
      create: '/dashboard/jobs/create',
      companies: {
        details: '/dashboard/jobs/companies/:companyId',
      },
    },
    kanban: '/dashboard/kanban',
    logistics: {
      index: '/dashboard/logistics',
      fleet: '/dashboard/logistics/fleet',
    },
    mail: '/dashboard/mail',
    // orders: {
    //   index: "/dashboard/orders",
    //   details: "/dashboard/orders/:orderId",
    // },
    products: {
      index: '/dashboard/products',
      create: '/dashboard/products/create',
      needApproval: '/dashboard/products/need-approval',
    },
    social: {
      index: '/dashboard/social',
      profile: '/dashboard/social/profile',
      feed: '/dashboard/social/feed',
    },
    forget_password: {
      index: '/forget_password'
    },
    templates: {
      index: '/templates',
    },
    users: {
      index: '/users',
    },
    crawl: {
      index: '/crawl',
    },
    google_trends: {
      index: '/google-trends',
    },
    design_editor: {
      index: '/design-editor',
    },
    check_label: {
      index: '/check-label',
    },
    user_admin: {
      index: '/user-admin',
    },
    design_sku: {
      index: '/design-sku',
    },
  },
  components: {
    index: '/components',
    dataDisplay: {
      detailLists: '/components/data-display/detail-lists',
      tables: '/components/data-display/tables',
      quickStats: '/components/data-display/quick-stats',
    },
    lists: {
      groupedLists: '/components/lists/grouped-lists',
      gridLists: '/components/lists/grid-lists',
    },
    forms: '/components/forms',
    modals: '/components/modals',
    charts: '/components/charts',
    buttons: '/components/buttons',
    typography: '/components/typography',
    colors: '/components/colors',
    inputs: '/components/inputs',
  },
  docs: 'https://material-kit-pro-react-docs.devias.io',
  notAuthorized: '/401',
  notFound: '/404',
  serverError: '/500',
};
