import dayjs from 'dayjs';
import PromotionCreateForm from './components/promotion-create-form';
import { usePromotionsStore } from 'src/store/promotionsStore';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

const FlashDealForm = () => {
  const searchParams = useSearchParams();
  const shopId = searchParams.get('id');

  const initialData = {
    title: 'Flashdeal',
    begin_time: dayjs().add(2, 'm'),
    end_time: dayjs().add(2, 'm').add(30, 'm'),
    type: 'FlashSale',
    discount: '15',
    product_type: 'SKU',
    numPromotions: 5,
    promotionDurationMinutes: 30,
    intervalMinutes: 30,
  };

  const { createFlashDeal, loading } = usePromotionsStore((state) => state);

  const onSubmit = (dataForm, productSelected) => {
    const onSuccess = () => {
      toast.success(`Tạo promotion thành công`);
      // navigate(`/shops/${shopId}/promotions`);
    };
    const onFail = (err) => {
      toast.error(`Tạo promotion thất bại. ${err}`);
    };

    let currentBeginTime = dayjs(dataForm.begin_time);
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < Number(dataForm.numPromotions); i++) {
      const uniqueTitle = ` ${characters[i % characters.length]}`;

      const begin_time = currentBeginTime;
      const end_time = begin_time.add(Number(dataForm.promotionDurationMinutes), 'm');
      currentBeginTime = end_time.add(Number(dataForm.intervalMinutes), 'm');

      const submitData = {
        ...dataForm,
        title: uniqueTitle,
        begin_time: begin_time.unix(),
        end_time: end_time.unix(),
        product_list: productSelected
          .filter((item) => item.skus)
          .map((item) => ({
            product_id: item.id,
            num_limit: -1,
            user_limit: -1,
            sku_list: item?.skus.map((sku) => {
              const promotion_price =
                Number(sku.price.original_price) - Number(dataForm.discount) * (Number(sku.price.original_price) / 100);
              return {
                product_id: item.id,
                sku_id: sku.id,
                promotion_price: promotion_price.toString(),
                num_limit: -1,
                user_limit: 10,
              };
            }),
          })),
      };

      delete submitData.discount;

      console.log('submitData', submitData);

      if (shopId) {
        createFlashDeal(shopId, submitData, onSuccess, onFail);
      }
    }
  };

  return (
    <div>
      <PromotionCreateForm initialData={initialData} loading={loading} onSubmit={onSubmit} />
    </div>
  );
};

export default FlashDealForm;
