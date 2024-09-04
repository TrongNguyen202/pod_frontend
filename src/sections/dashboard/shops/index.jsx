import { Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { fetchGetListShops } from 'src/redux/reducers/shops';
import { ShopsTable } from './table';
import { ShopSearch } from './search';
import { usePageView } from 'src/hooks/use-page-view';
import { fetchGetShopByUser } from 'src/redux/reducers/user';
import { fetchGetGroupCustom } from 'src/redux/reducers/user-admin';
import Stack from '@mui/material/Stack';

export const PageShops = () => {
  usePageView();
  const dispatch = useAppDispatch();
  const { shops } = useAppSelector((state) => state.shops);
  const [dataTable, setDataTable] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [state, setState] = useState({
    currentPage: 0,
    rowsPerPage: 10,
    search: '',
  });

  useEffect(() => {
    dispatch(fetchGetListShops());
    dispatch(fetchGetShopByUser());
    dispatch(fetchGetGroupCustom());
  }, []);

  useEffect(() => {
    handleDataTable();
  }, [shops, state]);

  const handleDataTable = () => {
    let data = [...shops];
    if (state.search) {
      data = data.filter((item) => item.shop_name.toLowerCase().includes(state.search.toLowerCase()));
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
      <Stack direction="column" spacing={{ xs: 2 }}>
        <ShopSearch onSearch={debouncedSearch} />
        <ShopsTable
          count={totalItems || 0}
          items={dataTable || []}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={state.currentPage}
          rowsPerPage={state.rowsPerPage}
        />
      </Stack>
    </Card>
  );
};
