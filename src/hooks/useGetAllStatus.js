import { useEffect, useRef } from 'react';
import { useAppSelector } from 'src/redux/hook';
import { fetchGetAllStatus } from 'src/redux/reducers/orders';

export const useGetAllStatus = (dispatch, boardId, role) => {
  const statusCount = useAppSelector((state) => state.orders.orderStatus);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (role === 'designer' && !hasFetched.current) {
      dispatch(fetchGetAllStatus(''));
      hasFetched.current = true;
    }

    if (role === 'customer' && boardId) {
      const query = `boardId=${boardId}`;
      dispatch(fetchGetAllStatus(query));
    }
  }, [dispatch, boardId, role]);

  return statusCount;
};
