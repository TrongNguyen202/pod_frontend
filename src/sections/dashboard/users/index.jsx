import { Card } from '@mui/material';
import { TableUser } from './tables/table-user';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { useEffect, useState } from 'react';
import { UserSearch } from './search';
import { fetchGetShopByUser } from 'src/redux/reducers/user';
import { isArray } from 'lodash';

export const ListUsers = () => {
  const dispatch = useAppDispatch();
  const { shopByUser } = useAppSelector((state) => state.users);
  const [dataTable, setDataTable] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [state, setState] = useState({
    currentPage: 0,
    rowsPerPage: 10,
    search: '',
  });

  useEffect(() => {
    dispatch(fetchGetShopByUser());
  }, []);

  useEffect(() => {
    handleDataTable();
  }, [shopByUser, state]);

  const handleDataTable = () => {
    let data = isArray(shopByUser?.users) ? shopByUser?.users : [];
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

  return (
    <Card>
      <UserSearch onSearch={debouncedSearch} />
      <TableUser
        count={totalItems || 0}
        items={dataTable || []}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={state.currentPage}
        rowsPerPage={state.rowsPerPage}
      />
    </Card>
  );
};
