import { useEffect } from 'react';
import { useAppSelector } from 'src/redux/hook';
import { fetchGetAllStatus } from 'src/redux/reducers/orders';

export const useGetAllStatus = (dispatch, boardId, orderData, role) => {
  const statusCount = useAppSelector((state) => state.orders.orderStatus);

  useEffect(() => {
    if (boardId && role === 'customer') {
        const query = `boardId=${boardId}`
      dispatch(fetchGetAllStatus(query));
    } else if (role === 'designer') {
        const query = ``
      dispatch(fetchGetAllStatus(query));
    }
  }, [dispatch, boardId, orderData, role]);

  return statusCount;
};
