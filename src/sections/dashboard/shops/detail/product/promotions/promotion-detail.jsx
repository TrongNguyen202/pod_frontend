import { Box, Card } from '@mui/material';
import { Table, Tag } from 'antd';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoadingCustom } from 'src/components/loading';
import { useProductsStore } from 'src/store/productsStore';
import { usePromotionsStore } from 'src/store/promotionsStore';
import { formatDateTime } from 'src/utils/date';

const PromotionDetail = () => {
  const searchParams = useSearchParams();
  const shopId = searchParams.get('id');
  const promotionId = searchParams.get('id-promotion');
  const [promotionDetail, setPromotionDetail] = useState({});
  const [productList, setProductList] = useState([]);
  const { PromotionDetail, loadingPromotion } = usePromotionsStore((state) => state);
  const { getAllProducts, loading } = useProductsStore((state) => state);

  const renderStatusPromotion = (status) => {
    if (status === 1) {
      return <Tag color="processing">Upcoming</Tag>;
    }
    if (status === 2) {
      return <Tag color="success">Ongoing</Tag>;
    }
    if (status === 3) {
      return <Tag color="error">Expired</Tag>;
    }
  };

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => <Link href={`/shops/${shopId}/products/${record?.id}`}>{record?.name}</Link>,
    },
  ];

  useEffect(() => {
    const onProductSuccess = (res) => {
      if (res) {
        const productData = [...res.products];
        productData.push(res.products);
        console.log('***');
        const onSuccess = (resPromotion) => {
          if (resPromotion) {
            setPromotionDetail(resPromotion);
            const productListRes = resPromotion.product_list.map((product) => {
              return productData.find((item) => item?.id === product.product_id);
            });
            setProductList(productListRes);
          }
        };

        const onFail = (err) => {
          console.log('errrorrorororororo', err);
        };
        PromotionDetail(shopId, promotionId, onSuccess, onFail);
      }
    };

    for (let i = 1; i <= 2; i++) {
      getAllProducts(shopId, i, onProductSuccess, () => {});
    }
  }, [shopId, promotionId]);

  if (loading || loadingPromotion)
    return (
      <Box className="min-h-16 flex justify-center items-center">
        <LoadingCustom />
      </Box>
    );

  return (
    <Card className="p-8 !font-sora">
      {promotionDetail && (
        <div className="">
          <div>
            <h3 className="text-[18px] mb-5 font-semibold">Basic information</h3>
            <ul>
              <li className="flex flex-wrap items-center text-[16px] mb-3">
                <span className="font-semibold min-w-[150px]">Promotion name: </span>
                <span>{promotionDetail?.title}</span>
              </li>

              <li className="flex flex-wrap items-center text-[16px] mb-3">
                <span className="font-semibold min-w-[150px]">Status: </span>
                <span>{renderStatusPromotion(promotionDetail?.status)}</span>
              </li>

              <li className="flex flex-wrap items-center text-[16px] mb-3">
                <span className="font-semibold min-w-[150px]">Create time: </span>
                <span>{promotionDetail?.create_time && formatDateTime(promotionDetail?.create_time)}</span>
              </li>

              <li className="flex flex-wrap items-center text-[16px] mb-3">
                <span className="font-semibold min-w-[150px]">End time: </span>
                <span>{promotionDetail?.end_time && formatDateTime(promotionDetail?.end_time)}</span>
              </li>
            </ul>

            <h3 className="text-[18px] mt-10 mb-5">Products ({productList.length})</h3>
            <Table
              columns={columns}
              dataSource={productList}
              bordered
              pagination={{
                pageSize: 100,
              }}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default PromotionDetail;
