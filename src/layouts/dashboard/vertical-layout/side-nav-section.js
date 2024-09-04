import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { SideNavItem } from './side-nav-item';
import { useAppSelector } from '../../../redux/hook';
import { permission } from '../../../constants';

const renderItems = ({ depth = 0, items, pathname, account }) =>
  items.reduce(
    (acc, item) =>
      reduceChildRoutes({
        acc,
        depth,
        item,
        pathname,
        account,
      }),
    [],
  );

const reduceChildRoutes = ({ acc, depth, item, pathname, account }) => {
  const checkPath = !!(item.path && pathname);
  const partialMatch = checkPath ? pathname.includes(item.path) : false;
  const exactMatch = checkPath ? pathname === item.path : false;

  if (
    item?.permissions &&
    !account?.role?.includes(permission.ADMIN) &&
    !item.permissions?.some((permission) => account?.role?.includes(permission))
  ) {
    return acc;
  }

  if (item.items) {
    acc.push(
      <SideNavItem
        active={partialMatch}
        depth={depth}
        disabled={item.disabled}
        icon={item.icon}
        key={item.title}
        label={item.label}
        open={partialMatch}
        title={item.title}
      >
        <Stack
          component="ul"
          spacing={0.5}
          sx={{
            listStyle: 'none',
            m: 0,
            p: 0,
          }}
        >
          {renderItems({
            depth: depth + 1,
            items: item.items,
            pathname,
          })}
        </Stack>
      </SideNavItem>,
    );
  } else {
    acc.push(
      <SideNavItem
        active={exactMatch}
        depth={depth}
        disabled={item.disabled}
        external={item.external}
        icon={item.icon}
        key={item.title}
        label={item.label}
        path={item.path}
        title={item.title}
      />,
    );
  }

  return acc;
};

export const SideNavSection = (props) => {
  const { items = [], pathname, subheader = '', ...other } = props;
  const { account } = useAppSelector((state) => state.auth);

  return (
    <Stack
      component="ul"
      spacing={0.5}
      sx={{
        listStyle: 'none',
        m: 0,
        p: 0,
      }}
      {...other}
    >
      {subheader && (
        <Box
          component="li"
          sx={{
            color: 'var(--nav-section-title-color)',
            fontSize: 12,
            fontWeight: 700,
            lineHeight: 1.66,
            mb: 1,
            ml: 1,
            textTransform: 'uppercase',
          }}
        >
          {subheader}
        </Box>
      )}
      {renderItems({ items, pathname, account })}
    </Stack>
  );
};

SideNavSection.propTypes = {
  items: PropTypes.array,
  pathname: PropTypes.string,
  subheader: PropTypes.string,
};
