import { useEffect } from 'react';
import { useAppDispatch } from 'src/redux/hook';
import { fetchGetOrdersByBoardId, resetDataListOrder, resetCountStatus } from 'src/redux/reducers/orders';

const useOrderFetcher = ({
  role,
  boardId,
  selectedCategory,
  page,
  limit,
  sortBy,
  sortDirection,
  minPrice,
  maxPrice,
  minPriceDe,
  maxPriceDe,
  startCreateDate,
  endCreateDate,
  startUpdateDate,
  endUpdateDate,
  searchText,
  buildQuery,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!role) return;

    if (role === 'customer' && !boardId) {
      dispatch(resetDataListOrder());
      dispatch(resetCountStatus());
      return;
    }

    dispatch(fetchGetOrdersByBoardId({ query: buildQuery() }));
  }, [
    role,
    boardId,
    selectedCategory,
    page,
    limit,
    sortBy,
    sortDirection,
    minPrice,
    maxPrice,
    minPriceDe,
    maxPriceDe,
    startCreateDate,
    endCreateDate,
    startUpdateDate,
    endUpdateDate,
    searchText,
  ]);
};

export default useOrderFetcher;
