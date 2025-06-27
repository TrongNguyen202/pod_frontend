import { useEffect } from 'react';
import { useAppSelector } from 'src/redux/hook';
import { fetchGetAllProductTypes } from 'src/redux/reducers/product-types';

export const useProductTypes = (dispatch) => {
  useEffect(() => {
    dispatch(fetchGetAllProductTypes({ query: '' }));
  }, [dispatch]);

  return useAppSelector((state) => state.productTypes.productTypes);
};