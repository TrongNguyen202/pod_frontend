import { useEffect } from 'react';
import { useAppSelector } from 'src/redux/hook';
import { fetchGetAllProductTypes } from 'src/redux/reducers/product-types';

export const useProductTypes = (dispatch, userId) => {
  const { data, isLoaded, loading } = useAppSelector((state) => state.productTypes.productTypes);
  
  useEffect(() => {
    if (!isLoaded && !loading) {
      dispatch(fetchGetAllProductTypes({ query: '' }));
    }
  }, [dispatch, userId, isLoaded, loading]);
  
  return { data, loading, isLoaded };
};