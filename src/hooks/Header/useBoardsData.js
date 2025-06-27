import { useEffect } from 'react';
import { useAppSelector } from 'src/redux/hook';
import { fetchGetBoardsByUserId } from 'src/redux/reducers/boards';
import { checkRole } from 'src/utils';

export const useBoardsData = (dispatch, userId, role) => {
  const { isCustomer } = checkRole(role);

  useEffect(() => {
    if (userId && isCustomer) {
      dispatch(fetchGetBoardsByUserId({ userId, query: '' }));
    }
  }, [dispatch, userId, isCustomer]);

  return useAppSelector((state) => state.boards.boardService);
};
