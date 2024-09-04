import { Box, Button, Card, Stack, SvgIcon } from '@mui/material';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { fetchGetListShops } from 'src/redux/reducers/shops';
import { fetchGetListUser } from 'src/redux/reducers/user-admin';
import { UserAdminTable } from './table';
import { UserAdminListSearch } from './search';
import { usePageView } from 'src/hooks/use-page-view';
import { isArray } from 'lodash';

export const UserAdmin = () => {
  const dispatch = useAppDispatch();
  const { users, groupUser } = useAppSelector((state) => state.userAdmin);
  const [dataTable, setDataTable] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [state, setState] = useState({
    currentPage: 0,
    rowsPerPage: 10,
    search: '',
  });

  useEffect(() => {
    handleDataTable();
  }, [users, state]);

  const handleDataTable = () => {
    let data = isArray(users?.data?.users) ? users?.data?.users : [];
    if (state.search) {
      data = data.filter((item) => item.user_name.toLowerCase().includes(state.search.toLowerCase()));
    }
    const begin = state.currentPage * state.rowsPerPage;
    const end = begin + state.rowsPerPage;

    setTotalItems(data.length);
    setDataTable(data.slice(begin, end));
  };

  const onRowsPerPageChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      rowsPerPage: parseInt(event.target.value, 10),
    }));
  };

  const onPageChange = (_, newPage) => {
    setState((prevState) => ({
      ...prevState,
      currentPage: newPage,
    }));
  };

  function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
  const searchOrderByName = (e) => {
    setState((prevState) => ({
      ...prevState,
      search: e.target.value,
    }));
  };

  const debouncedSearch = debounce(searchOrderByName, 500);

  useEffect(() => {
    dispatch(fetchGetListShops());
  }, []);

  useEffect(() => {
    dispatch(fetchGetListUser(groupUser));
  }, [groupUser]);

  usePageView();

  return (
    <Box sx={{ position: 'relative' }}>
      <Box direction="row" spacing={2} width={'100%'}>
        <Card>
          <UserAdminListSearch onSearch={debouncedSearch} />
          <UserAdminTable
            count={totalItems || 0}
            items={dataTable || []}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            page={state.currentPage}
            rowsPerPage={state.rowsPerPage}
          />
        </Card>
      </Box>
    </Box>
  );
};
