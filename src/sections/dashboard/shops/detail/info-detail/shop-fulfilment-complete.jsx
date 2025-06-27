// import { useEffect } from 'react';
// import { useAppDispatch, useAppSelector } from 'src/redux/hook';
// import { fetchPackageFulfillmentCompleted } from 'src/redux/reducers/orders';
import { CardOrder } from './card-order';
import { Spin } from 'antd';

export const ShopDetailFulfillmentComplete = (props) => {
  const { shopId } = props;
  // const dispatch = useAppDispatch();
  // const { packageFulfillmentCompleted } = useAppSelector((state) => state.orders);

  // useEffect(() => {
  //   if (shopId) {
  //     dispatch(fetchPackageFulfillmentCompleted(shopId));
  //   }
  // }, [shopId]);

  return (
    <Spin spinning={packageFulfillmentCompleted.loading}>
      <CardOrder
        title={'Fulfillment Completed:'}
        count={packageFulfillmentCompleted?.data.length > 0 ? packageFulfillmentCompleted.data?.length : '0'}
        link={`/shops/${shopId}/fulfillment/completed`}
      />
    </Spin>
  );
};
