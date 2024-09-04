import { CardOrder } from './card-order';

export const PromotionCard = (props) => {
  const { shopId } = props;

  return <CardOrder title={'Promotions'} link={`/shops/${shopId}/promotions`} />;
};
