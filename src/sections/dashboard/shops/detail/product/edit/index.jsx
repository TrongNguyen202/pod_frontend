import { Form, Spin } from 'antd';
import { useEffect, useState } from 'react';
import PageTitle from 'src/sections/dashboard/check-label/PageTitle';
import { useCategoriesStore } from 'src/store/categoriesStore';
import { useProductsStore } from 'src/store/productsStore';
import { useWareHousesStore } from 'src/store/warehousesStore';
import { convertProductAttribute, formatNumber } from 'src/utils';
import ProductInformation from '../../../products/create-antd/products/ProductInformation';
import ProductMedia from '../../../products/create-antd/products/ProductMedia';
import ProductSale from '../../../products/create-antd/products/ProductSale';
import ProductVariation from '../../../products/create-antd/products/ProductVariation';
import ProductCreateShipping from '../../../products/create-antd/products/ProductShipping';
import { Button } from '@mui/material';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import { useShopsBrand } from 'src/store/brandStore';

export const PageEditShopProduct = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shopId = searchParams.get('id');
  const productId = searchParams.get('id-product');
  const [form] = Form.useForm();
  const [skusData, setSkusData] = useState([]);
  const [imgBase64, setImgBase64] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [sizeChart, setSizeChart] = useState([]);
  const [attributeValues, setAttributeValues] = useState([]);
  const { getAllCategoriesIsLeaf, categoriesIsLeaf } = useCategoriesStore((state) => state);
  const { productById, getProductsById, editProduct, loading } = useProductsStore((state) => state);
  const { warehousesById, getWarehousesByShopId } = useWareHousesStore((state) => state);
  const { getAllBrand, brands } = useShopsBrand((state) => state);

  const priceDataForm = productById?.skus?.length === 1 ? formatNumber(productById?.skus[0].price.original_price) : '';
  const availableDataForm =
    productById?.skus?.length === 1 ? formatNumber(productById?.skus[0].stock_infos[0].available_stock) : '';
  const skuDataForm = productById?.skus?.length === 1 ? formatNumber(productById?.skus[0].seller_sku) : '';
  const warehouse_id = productById?.skus?.length === 1 ? productById?.skus[0].stock_infos[0].warehouse_id : '';
  const available_stock = productById?.skus?.length === 1 ? productById?.skus[0].stock_infos[0].available_stock : '';
  // const imgBase64List = imgBase64?.filter((item) => item.thumbUrl);
  // const imgBase64Data = imgBase64List?.map((item) => item.thumbUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''));

  const getImageBase64 = () => {
    const imgBase64List = imgBase64?.filter((item) => item.thumbUrl);
    const imgBase64Data = imgBase64List?.map((item) =>
      item.thumbUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
    );
    return imgBase64Data;
  };

  const formData = {
    ...productById,
    category_id: productById?.category_list?.map((item) => parseInt(item.id)),
    price: priceDataForm,
    available: availableDataForm,
    seller_sku: skuDataForm,
    brand_id: {
      value: productById?.brand?.id || '',
      label: productById?.brand?.name || 'No brand',
    },
    stock_infos: {
      warehouse_id,
      available_stock,
    },
    product_attributes: productById?.product_attributes,
    is_cod_open: productById?.is_cod_open,
  };

  const variationsDataTable = (data) => {
    console.log('data: ', data);
    setSkusData(data);
  };

  const handleImgBase64 = (img) => {
    setImgBase64(img);
  };

  const onFinish = async (values) => {
    const toastId = toast.loading('Đang cập nhật sản phẩm. Vui lòng chờ.');
    const category_id = values?.category_id[values.category_id.length - 1];
    const product_attributes = convertProductAttribute(values.product_attributes, attributeValues);

    const dataFormSubmit = {
      product_id: productId,
      product_name: values.product_name,
      images: fileList
        ?.filter((item) => item.status === 'done')
        .map((item) => ({
          id: item.uid,
        })),
      size_chart: sizeChart ? { id: sizeChart.uid } : null,
      imgBase64: getImageBase64(imgBase64),
      price: values.price,
      is_cod_open: false,
      package_dimension_unit: 'imperial',
      package_height: values.package_height,
      package_length: values.package_length,
      package_weight: values.package_weight,
      package_width: values.package_width,
      category_id: category_id || '',
      description: values.description,
      skus: skusData?.map((item) => ({
        sales_attributes: item.variations?.map((attr) => ({
          value_id: attr.value_id ? attr.value_id : item.key,
          attribute_id: attr.id,
          attribute_name: attr.name,
          value_name: attr.value_name,
        })),
        original_price: item.price || 3,
        stock_infos: item.stock_infos,
        seller_sku: values?.seller_sku || '',
      })),
      brand_id: values.brand_id ? values.brand_id.value : '',
      product_attributes: product_attributes || [],
    };

    console.log('dataFormSubmit: ', dataFormSubmit);
    const UpdateSuccess = (res) => {
      if (res.message === 'Success') {
        toast.success('Cập nhật sản phẩm thành công!', { id: toastId });
        form.resetFields();
        router.push(`/shops/${shopId}/products`);
      }
    };

    const UpdateFail = (err) => {
      toast.error(err, { id: toastId });
    };
    editProduct(shopId, productId, dataFormSubmit, UpdateSuccess, UpdateFail);
  };

  const getAttributesByCategory = (data) => {
    setAttributeValues(data);
  };

  useEffect(() => {
    getAllCategoriesIsLeaf();
    getProductsById(shopId, productId);
    getWarehousesByShopId(shopId);
    getAllBrand(shopId);

    form.setFieldsValue(formData);
    const skuProduct = productById?.skus?.map((item) => ({
      key: item.id,
      price: item?.price?.original_price,
      variations: item.sales_attributes,
      seller_sku: item.seller_sku,
      stock_infos: item.stock_infos,
    }));
    if (skuProduct) {
      setSkusData(skuProduct);
    }
  }, [productById?.product_id]);

  // console.log('skusData: ', skusData);
  return (
    <Spin spinning={loading}>
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <div className="pb-4">
          <ProductInformation
            shopId={shopId}
            categories={categoriesIsLeaf}
            brands={brands}
            getAttributeValues={getAttributesByCategory}
          />
        </div>

        <div className="py-4">
          <ProductMedia
            productData={productById}
            imgBase64={handleImgBase64}
            setFileList={setFileList}
            fileList={fileList}
            sizeChart={sizeChart}
            setSizeChart={setSizeChart}
          />
        </div>

        <div className="py-4">
          <ProductSale warehouses={warehousesById.warehouse_list} />
        </div>

        <div className="py-4">
          <ProductVariation shopId={shopId} variations={skusData} variationsDataTable={variationsDataTable} />
        </div>

        <div className="py-4">
          <ProductCreateShipping />
        </div>

        <div className="py-4">
          <Form.Item>
            <Button type="submit" variant="contained">
              Lưu thay đổi
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Spin>
  );
};
