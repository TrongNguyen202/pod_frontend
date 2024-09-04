import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';

import { TopNavItem } from './top-nav-item';
import { useAppSelector } from '../../../redux/hook';
import { permission } from '../../../constants';

export const TopNavSection = (props) => {
  const { items = [], pathname } = props;
  const { account } = useAppSelector((state) => state.auth);

  return (
    <Stack
      component="ul"
      direction="row"
      spacing={1}
      sx={{
        listStyle: 'none',
        m: 0,
        p: 0,
      }}
    >
      {items.map((item) => {
        const checkPath = !!(item.path && pathname);
        const partialMatch = checkPath ? pathname.includes(item.path) : false;
        const exactMatch = checkPath ? pathname === item.path : false;

        if (
          item?.permissions &&
          !account?.role?.includes(permission.ADMIN) &&
          !item.permissions?.some((permission) => account?.role?.includes(permission))
        ) {
          return <></>;
        }
        // Branch

        if (item.items) {
          return (
            <TopNavItem
              active={partialMatch}
              disabled={item.disabled}
              icon={item.icon}
              items={item.items}
              key={item.title}
              label={item.label}
              title={item.title}
            />
          );
        }

        // Leaf

        return (
          <TopNavItem
            active={exactMatch}
            disabled={item.disabled}
            external={item.external}
            icon={item.icon}
            key={item.title}
            label={item.label}
            path={item.path}
            title={item.title}
          />
        );
      })}
    </Stack>
  );
};

TopNavSection.propTypes = {
  items: PropTypes.array,
  pathname: PropTypes.string,
  subheader: PropTypes.string,
};
