import { useEffect } from 'react';
import { useAppSelector } from 'src/redux/hook';
import { fetchBoardInfoByBoardId, resetBoardInfo } from 'src/redux/reducers/boards';
import { resetDataListOrder } from 'src/redux/reducers/orders';
import { transformBoardToFormInitialData } from 'src/utils';

export const useBoardInfo = (dispatch, selectedBoardId, productTypeData, setInitialFormData) => {
  const boardInfo = useAppSelector((state) => state.boards.boardInfo);

  useEffect(() => {
    if (typeof selectedBoardId === 'number' && selectedBoardId > 0) {
      dispatch(fetchBoardInfoByBoardId({ boardId: selectedBoardId }));
    } else {
      dispatch(resetBoardInfo());
      dispatch(resetDataListOrder());
    }
  }, [dispatch, selectedBoardId]);

  useEffect(() => {
    if (boardInfo?.data) {
      setInitialFormData(transformBoardToFormInitialData(boardInfo.data));
    } else {
      setInitialFormData({});
    }
  }, [boardInfo.data, productTypeData, setInitialFormData]);

  return boardInfo;
};