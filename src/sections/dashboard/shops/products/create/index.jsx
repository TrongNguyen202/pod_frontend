import { Box, Button, Stack } from '@mui/material';
import { useFieldArray, useForm } from 'react-hook-form';
import { usePageView } from 'src/hooks/use-page-view';
import { ProductInfor } from '../components/product-info';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { useEffect } from 'react';
import { fetchGetAllCategoriesIsLeaf } from 'src/redux/reducers/categories';
import { fetchWarehouseByShop } from 'src/redux/reducers/warehouse';
import { fetchGetAllBrand } from 'src/redux/reducers/shops-brand';
import { ProductMedia } from '../components/product-media';
import { ProductSale } from '../components/product-sale';
import { ProductShipping } from '../components/product-shipping';
import { ProductCreateAddVariation } from '../components/product-create-variation';
import { toast } from 'react-toastify';
import { RepositoryRemote } from 'src/services';
import { useRouter } from 'next/router';
import { convertProductAttribute } from 'src/utils';

export const PageCreateProduct = () => {
  usePageView();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const shopId = searchParams.get('id');
  const router = useRouter();
  const { productById } = useAppSelector((state) => state.products);
  const { attributes } = useAppSelector((state) => state.categories);

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      product_attributes: attributes?.attributes?.reduce((acc, item) => {
        acc[item.id] = {
          name: item.name,
          value: item.input_type.is_multiple_selected ? [] : '',
        };
        return acc;
      }, {}),
      skus: [],
    },
  });

  const { fields: fieldProductAttributes } = useFieldArray({
    control,
    name: 'product_attributes',
  });

  const { fields: fieldSku, remove: removeSku } = useFieldArray({
    control,
    name: 'skus',
  });

  useEffect(() => {
    dispatch(fetchGetAllCategoriesIsLeaf());
    if (shopId) {
      dispatch(fetchWarehouseByShop(shopId));
      dispatch(fetchGetAllBrand(shopId));
    }
  }, [productById?.product_id, shopId]);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''));
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (data) => {
    const idToast = toast.loading('Đang tạo sản phẩm. Vui lòng chờ.');
    try {
      const imagesFiles = data?.images
        ? await Promise.all(Array.from(data?.images).map((file) => convertToBase64(file)))
        : [];

      const sizeChartFiles = data?.size_chart?.length
        ? await Promise.all(Array.from(data.size_chart).map((file) => convertToBase64(file)))
        : [];

      const product_attributes = convertProductAttribute(data?.product_attributes);

      const dataFormSubmit = {
        product_name: data?.product_name || '',
        description: data?.description || '',
        category_id: data.category.subsubcategory.value || '',
        images: imagesFiles,
        size_chart: {
          img_id: sizeChartFiles.length ? sizeChartFiles[0] : '',
        },
        package_dimension_unit: 'imperial',
        package_height: Number(data.package_height) || '',
        package_length: Number(data.package_length) || '',
        package_weight: Number(data.package_weight) || '',
        package_width: Number(data.package_width) || '',
        is_cod_open: false,
        brand_id: data.brand_id || '',
        skus: data.skus.length
          ? data.skus.map((sku) => ({
              sales_attributes: sku.variations?.map((attr) => ({
                attribute_id: attr.id,
                attribute_name: attr.name,
                custom_value: attr.value_name,
              })),
              original_price: sku.price,
              stock_infos: sku.stock_infos,
              seller_sku: sku?.seller_sku || '',
            }))
          : [
              {
                sales_attributes: [],
                original_price: data.price,
                stock_infos: [data.stock_infos],
                seller_sku: data?.seller_sku || '',
              },
            ],
        product_attributes: product_attributes || [],
      };

      console.log('dataFormSubmit', dataFormSubmit);

      const res = await RepositoryRemote.products.requestCreateOneProduct(shopId, dataFormSubmit);
      if (res.data) {
        toast.success('Tạo sản phẩm thành công!. Đang chuyển trang.');
        router.push(`/shops/${shopId}/products`);
        reset();
      }
    } catch (error) {
      console.log(error);
      toast.error('Tạo sản phẩm lỗi. Vui lòng thử lại sau!', { id: idToast });
    }
  };

  return (
    <Box component={'form'} onSubmit={handleSubmit(onSubmit)} className="p-7">
      <ProductInfor
        shopId={shopId}
        control={control}
        setValue={setValue}
        errors={errors}
        fieldProductAttributes={fieldProductAttributes}
      />
      <ProductMedia shopId={shopId} control={control} setValue={setValue} errors={errors} />
      <ProductSale shopId={shopId} control={control} setValue={setValue} errors={errors} />
      <ProductCreateAddVariation
        shopId={shopId}
        control={control}
        setValue={setValue}
        errors={errors}
        isProductCreate={true}
        fieldSku={fieldSku}
        removeSku={removeSku}
      />
      <ProductShipping shopId={shopId} control={control} setValue={setValue} errors={errors} />
      <Stack spacing={1} className="mt-6">
        <Button type="submit" variant="contained">
          Cập Nhật
        </Button>
      </Stack>
    </Box>
  );
};
