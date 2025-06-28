import { Box, Card, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { usePageView } from 'src/hooks/use-page-view';
import { ProductTypeTable } from './table';
import { DescriptionShopProduct } from './description';
import { useEffect, useState } from 'react';
import { RepositoryRemote } from 'src/services';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { LoadingCustom } from 'src/components/loading';
import { statusProductTikTokShop } from '../../../../../../constants';

export const PageDetailShopProduct = () => {
  usePageView();
  const searchParams = useSearchParams();
  const shopId = searchParams.get('id');
  const productById = searchParams.get('id-product');
  const [loading, setLoading] = useState(false);

  const [detailProduct, setDetailProduct] = useState(null);

  useEffect(() => {
    handleGetDataDetail();
  }, [productById, shopId]);

  const handleGetDataDetail = async () => {
    if (productById && shopId) {
      setLoading(true);
      try {
        const response = await RepositoryRemote.products.requestGetProductById(shopId, productById);
        if (response?.data) {
          setDetailProduct(response.data);
        }
      } catch (error) {
        console.log(error);
        toast.error('Lấy chi tiết sản phẩm lỗi.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={{ position: 'relative', py: 4 }}>
      {loading ? (
        <Card className="flex min-h-96">
          <Box className={'flex justify-center items-center w-full absolute top-0 left-0 right-0 bottom-0 z-50'}>
            <LoadingCustom />
          </Box>
        </Card>
      ) : (
        <>
          {detailProduct && (
            <Card className="p-4">
              <Typography variant="h4" className="flex gap-2">
                Thông tin sản phẩm
              </Typography>
              <Box>
                <Stack
                  alignItems="flex-start"
                  direction="row"
                  // flexWrap="wrap"
                  spacing={2}
                  className="my-6"
                >
                  <Card className="p-4 max-w-[50%]">
                    <Box className="flex gap-1 mb-2">
                      <Typography variant="h6" className="text-nowrap">
                        Tên sản phẩm:
                      </Typography>
                      <Typography>{detailProduct?.data?.product_name}</Typography>
                    </Box>
                    <Box className="flex gap-1 mb-2 items-center">
                      <Typography variant="h6">Trạng thái:</Typography>
                      <Typography>
                        {statusProductTikTokShop?.map((item, index) => (
                          <>
                            {detailProduct?.data?.product_status === index && (
                              <span key={index}>{item.title}</span>
                              // <Chip
                              //   key={index}
                              //   color={item.color}
                              //   label={item.title}
                              //   className="!p-1 !h-7"
                              // ></Chip>
                            )}
                          </>
                        ))}
                      </Typography>
                    </Box>
                    <Box className="flex gap-1 mb-2">
                      <Typography variant="h6">Mã sản phẩm:</Typography>
                      <Typography>{detailProduct?.data?.product_id}</Typography>
                    </Box>
                    <Box className="flex gap-1 mb-2">
                      <Typography variant="h6">Danh mục:</Typography>
                      <Typography>
                        {detailProduct?.data?.category_list.map((category, index) => {
                          return (
                            <>
                              {index !== 0 && <span>, </span>}
                              {category.local_display_name}
                            </>
                          );
                        })}
                      </Typography>
                    </Box>
                  </Card>
                  <Card className="p-4">
                    <Typography variant="h5" className="flex gap-2 !mb-3">
                      Video, ảnh sản phẩm
                    </Typography>

                    {detailProduct?.data?.video_url && (
                      // eslint-disable-next-line jsx-a11y/media-has-caption
                      <video controls width="200px" height="110px">
                        <source src={detailProduct?.data?.video_url} type="video/mp4" />
                      </video>
                    )}
                    {detailProduct?.data?.images && detailProduct?.data.images?.length ? (
                      <div className="flex gap-4 flex-wrap">
                        {detailProduct?.data?.images.map((item) => (
                          <>
                            {item.url_list && (
                              <Image
                                width={120}
                                height={120}
                                className="object-cover border-[1px] border-solid border-[rgba(128,_128,_128,_0.42)]"
                                src={item.url_list[0] || item.url_list[1] || ImageDefault}
                              />
                            )}
                          </>
                        ))}
                      </div>
                    ) : (
                      'Chưa có video và ảnh sản phẩm'
                    )}
                  </Card>
                </Stack>
              </Box>
              <Typography variant="h5" className="text-nowrap !mb-6">
                Phân loại sản phẩm
              </Typography>
              <Card>
                <ProductTypeTable data={detailProduct?.data} />
              </Card>
              <Card className="p-4 mt-6">
                <Typography variant="h5" className="text-nowrap !mb-6">
                  Nội dung chi tiết
                </Typography>
                <DescriptionShopProduct data={detailProduct?.data} />
              </Card>
            </Card>
          )}
        </>
      )}
    </Box>
  );
};
