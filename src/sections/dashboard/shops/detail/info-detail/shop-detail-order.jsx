import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { fetchAllOrderByShop } from 'src/redux/reducers/orders';
import { CardOrder } from './card-order';
import { Spin } from 'antd';

export const ShopDetailOrder = (props) => {
  const { shopId } = props;
  const dispatch = useAppDispatch();
  const { orderByShop } = useAppSelector((state) => state.orders);

  const orderList = orderByShop?.data?.data?.length
    ? orderByShop?.data?.data?.map((order) => order?.data?.order_list).flat()
    : [];

  useEffect(() => {
    if (shopId) {
      dispatch(fetchAllOrderByShop(shopId));
    }
  }, [shopId]);

  return (
    <Spin spinning={orderByShop.loading}>
      <CardOrder
        title={'Đơn hàng:'}
        count={orderList?.length > 0 ? orderList?.length : '0'}
        link={'/shops/' + shopId + '/orders'}
      />
    </Spin>
  );
};
