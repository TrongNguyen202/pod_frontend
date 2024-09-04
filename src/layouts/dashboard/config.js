import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SvgIcon from '@mui/material/SvgIcon';
import CheckDone01Icon from 'src/icons/untitled-ui/duocolor/check-done-01';
import HomeSmileIcon from 'src/icons/untitled-ui/duocolor/home-smile';
import ShoppingBag03Icon from 'src/icons/untitled-ui/duocolor/shopping-bag-03';
import ShoppingCart01Icon from 'src/icons/untitled-ui/duocolor/shopping-cart-01';
import Users03Icon from 'src/icons/untitled-ui/duocolor/users-03';
import { tokens } from 'src/locales/tokens';
import { paths } from 'src/paths';
import SearchIcon from '@mui/icons-material/Search';
import GoogleIcon from '@mui/icons-material/Google';
import BuildIcon from '@mui/icons-material/Build';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { permission } from '../../constants';

export const pagePermissions = {
  dashboard: [permission.MANAGER, permission.SELLER, permission.DESIGNER],
  shops: [permission.MANAGER, permission.SELLER],
  orders: [permission.MANAGER, permission.SELLER],
  templates: [permission.MANAGER, permission.SELLER],
  users: [permission.MANAGER],
  crawl: [permission.MANAGER, permission.SELLER],
  google_trends: [permission.MANAGER, permission.SELLER],
  design_editor: [permission.MANAGER, permission.SELLER],
  check_label: [permission.MANAGER, permission.SELLER],
  user_admin: [permission.MANAGER],
  design_sku: [permission.MANAGER, permission.DESIGNER],
};

export const useSections = () => {
  const { t } = useTranslation();

  return useMemo(() => {
    return [
      {
        items: [
          {
            title: t(tokens.nav.overview),
            path: paths.dashboard.index,
            icon: (
              <SvgIcon fontSize="small">
                <HomeSmileIcon />
              </SvgIcon>
            ),
            permissions: pagePermissions.dashboard,
            // items: [
            //   {
            //     title: t(tokens.nav.charts),
            //     path: paths.dashboard.index,
            //   },
            //   {
            //     title: t(tokens.nav.totalOder),
            //     path: paths.dashboard.customers.index,
            //   },
            //   {
            //     title: t(tokens.nav.totalProduct),
            //     path: paths.dashboard.products.index,
            //   },
            //   {
            //     title: t(tokens.nav.productNeedApprove),
            //     path: paths.dashboard.products.needApproval,
            //   },
            // ],
          },
          {
            title: t(tokens.nav.shops),
            path: paths.dashboard.shops,
            icon: (
              <SvgIcon fontSize="small">
                <StorefrontIcon />
              </SvgIcon>
            ),
            permissions: pagePermissions.shops,
          },
          {
            title: t(tokens.nav.orders),
            path: paths.dashboard.orders,
            icon: (
              <SvgIcon fontSize="small">
                <ShoppingCart01Icon />
              </SvgIcon>
            ),
            permissions: pagePermissions.orders,
          },
          {
            title: t(tokens.nav.manageTemplates),
            path: paths.dashboard.templates.index,
            icon: (
              <SvgIcon fontSize="small">
                <CheckDone01Icon />
              </SvgIcon>
            ),
          },
          {
            title: t(tokens.nav.manageUser),
            path: paths.dashboard.users.index,
            icon: (
              <SvgIcon fontSize="small">
                <Users03Icon />
              </SvgIcon>
            ),
            permissions: pagePermissions.users,
          },
          {
            title: t(tokens.nav.crawlProduct),
            path: paths.dashboard.crawl.index,
            icon: (
              <SvgIcon fontSize="small">
                <ShoppingBag03Icon />
              </SvgIcon>
            ),
            permissions: pagePermissions.crawl,
          },
          {
            title: t(tokens.nav.googleTrends),
            path: paths.dashboard.google_trends.index,
            icon: (
              <SvgIcon fontSize="small">
                <GoogleIcon />
              </SvgIcon>
            ),
            permissions: pagePermissions.google_trends,
          },
          {
            title: t(tokens.nav.customDesign),
            path: paths.dashboard.design_editor.index,
            icon: (
              <SvgIcon fontSize="small">
                <BuildIcon />
              </SvgIcon>
            ),
            permissions: pagePermissions.design_editor,
          },
          {
            title: t(tokens.nav.checkLabelBought),
            path: paths.dashboard.check_label.index,
            icon: (
              <SvgIcon fontSize="small">
                <SearchIcon />
              </SvgIcon>
            ),
            permissions: pagePermissions.check_label,
          },
          {
            title: t(tokens.nav.userAdmin),
            path: paths.dashboard.user_admin.index,
            icon: (
              <SvgIcon fontSize="small">
                <AdminPanelSettingsIcon />
              </SvgIcon>
            ),
            permissions: pagePermissions.user_admin,
          },
          {
            title: t(tokens.nav.designSku),
            path: paths.dashboard.design_sku.index,
            icon: (
              <SvgIcon fontSize="small">
                <SearchIcon />
              </SvgIcon>
            ),
            permissions: pagePermissions.design_sku,
          },
        ],
      },
    ];
  }, [t]);
};
