import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { fetchGetProductsBuyShop } from 'src/redux/reducers/products';
import { CardOrder } from './card-order';
import { Skeleton } from '@mui/material';
import { Spin } from 'antd';

export const ShopDetailProduct = (props) => {
  const { shopId } = props;
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (shopId) {
      dispatch(fetchGetProductsBuyShop({ shopId, page: 1 }));
    }
  }, [shopId]);

  return (
    <>
      <Spin spinning={loading}>
        <CardOrder title={'Sản phẩm:'} count={products?.data?.total || 0} link={`/shops/${shopId}/products`} />
      </Spin>
    </>
  );
};
