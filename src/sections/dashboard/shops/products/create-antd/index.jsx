import { Form, Spin, message } from 'antd';
import PageTitle from 'src/sections/dashboard/check-label/PageTitle';
import ProductInformation from './products/ProductInformation';
import ProductMedia from './products/ProductMedia';
import ProductSale from './products/ProductSale';
import ProductVariation from './products/ProductVariation';
import ProductCreateShipping from './products/ProductShipping';
import { Button, Card } from '@mui/material';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCategoriesStore } from 'src/store/categoriesStore';
import { useProductsStore } from 'src/store/productsStore';
import { useWareHousesStore } from 'src/store/warehousesStore';
import { useShopsBrand } from 'src/store/brandStore';
import { convertProductAttribute } from 'src/utils';

function ProductCreate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shopId = searchParams.get('id');
  const timeoutRef = useRef(null);
  const [form] = Form.useForm();
  const [skusData, setSkusData] = useState([]);
  const [imgBase64, setImgBase64] = useState([]);
  const [attributeValues, setAttributeValues] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [sizeChart, setSizeChart] = useState([]);
  const { getAllCategoriesIsLeaf, categoriesIsLeaf, recommendCategory } = useCategoriesStore((state) => state);
  const { productById, createOneProduct, createOneProductDraff, loading } = useProductsStore((state) => state);
  const { warehousesById, getWarehousesByShopId } = useWareHousesStore((state) => state);
  const { getAllBrand, brands } = useShopsBrand((state) => state);

  const onFinish = async (values) => {
    const idToast = toast.loading('Đang tạo sản phẩm. Vui lòng chờ.');
    const category_id = values?.category_id[values.category_id.length - 1];
    const product_attributes = convertProductAttribute(values.product_attributes, attributeValues);

    const dataFormSubmit = {
      product_name: values.product_name,
      description: values.description ? values.description : '',
      category_id: category_id || '',
      images: imgBase64?.map((item) => item.thumbUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, '')),
      size_chart: {
        img_id: sizeChart.length ? sizeChart[0].thumbUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, '') : '',
      },
      package_dimension_unit: 'imperial',
      package_height: values.package_height ? values.package_height : '',
      package_length: values.package_length ? values.package_length : '',
      package_weight: values.package_weight ? values.package_weight : '',
      package_width: values.package_width ? values.package_width : '',
      is_cod_open: false,
      brand_id: values.brand_id ? values.brand_id : '',
      skus: skusData.length
        ? skusData?.map((item) => ({
            sales_attributes: item.variations?.map((attr) => ({
              attribute_id: attr.id,
              attribute_name: attr.name,
              custom_value: attr.value_name,
            })),
            original_price: item.price,
            stock_infos: item.stock_infos,
            seller_sku: item?.seller_sku || '',
          }))
        : [
            {
              sales_attributes: [],
              original_price: values.price,
              stock_infos: [values.stock_infos],
              seller_sku: values?.seller_sku || '',
            },
          ],
      product_attributes: product_attributes || [],
    };

    console.log('dataFormSubmit: ', dataFormSubmit);
    console.log('shopId', shopId);
    const CreateSuccess = (res) => {
      if (res.message === 'Success') {
        toast.success('Đã thêm sản phẩm thành công!', { id: idToast });
        // form.resetFields();
        // router.push(`/shops/${shopId}/products`);
      }
    };

    const CreateFail = (err) => {
      toast.error(err, { id: idToast });
    };

    createOneProduct(shopId, dataFormSubmit, CreateSuccess, CreateFail);
  };

  const onFinishFailed = () => {};

  useEffect(() => {
    const onSuccess = () => {};
    const onFail = (err) => {
      toast.error(err);
    };

    getAllCategoriesIsLeaf();
    getWarehousesByShopId(shopId, onSuccess, onFail);
    getAllBrand(shopId, onSuccess, onFail);
  }, [productById?.product_id]);

  const variationsDataTable = (data) => {
    setSkusData(data);
  };

  const handleImgBase64 = async (img) => {
    await setImgBase64(img);
  };

  const getAttributesByCategory = (data) => {
    setAttributeValues(data);
  };

  const onValuesChange = (changedValues) => {
    if ('product_name' in changedValues) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        const onSuccess = (res) => {
          const categories = res.category.data.categories;
          if (categories && categories.length) {
            form.setFieldsValue({
              category_id: categories.map((item) => item.id),
            });
          }
        };
        if (changedValues.product_name)
          recommendCategory(shopId, { product_name: changedValues.product_name }, onSuccess);
      }, 500);
    }
  };

  // if (loading) return <Loading/>
  return (
    <Card className="p-4">
      <Spin spinning={loading}>
        <Form
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          form={form}
          onValuesChange={onValuesChange}
        >
          <div className="">
            <ProductInformation
              shopId={shopId}
              categories={categoriesIsLeaf}
              brands={brands}
              getAttributeValues={getAttributesByCategory}
              form={form}
            />
          </div>

          <div className="py-4">
            <ProductMedia
              productData={{ images: [] }}
              imgBase64={handleImgBase64}
              isProductCreate
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
            <ProductVariation shopId={shopId} variationsDataTable={variationsDataTable} isProductCreate />
          </div>

          <div className="py-4">
            <ProductCreateShipping isProductCreate />
          </div>

          <div className="py-4">
            <Form.Item>
              <div className="flex gap-4">
                <Button variant="contained" type="submit">
                  Lưu
                </Button>
                <Button
                  variant="contained"
                  className="ml-3"
                  onClick={() => {
                    form
                      .validateFields()
                      .then((values) => {
                        const product_attributes = ConvertProductAttribute(values.product_attributes, attributeValues);
                        const categoryId = values?.category_id[values.category_id.length - 1];
                        const dataSend = {
                          ...values,
                          category_id: String(categoryId),
                          images: imgBase64?.map((item) =>
                            item.thumbUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
                          ),
                          product_attributes,
                          is_cod_open: values?.is_cod_open ? values?.is_cod_open : 'false',
                          skus: skusData.length
                            ? skusData?.map((item) => ({
                                sales_attributes: item.variations?.map((attr) => ({
                                  attribute_id: attr.id,
                                  attribute_name: attr.name,
                                  custom_value: attr.value_name,
                                })),
                                original_price: item.price,
                                stock_infos: [item.stock_infos],
                              }))
                            : [
                                {
                                  sales_attributes: [],
                                  original_price: values.price,
                                  stock_infos: [values.stock_infos],
                                },
                              ],
                        };

                        const CreateProductDraffSuccess = (res) => {
                          if (res) {
                            toast.success('Đã thêm sản phẩm nháp!');

                            router.push(`/shops/${shopId}/products`);
                          }
                        };
                        createOneProductDraff(shopId, dataSend, CreateProductDraffSuccess, (err) => console.log(err));
                      })
                      .catch((info) => {
                        console.log(info);
                      });
                  }}
                >
                  Lưu bản nháp
                </Button>
                {/* <Button className="ml-3" onClick={() => navigate(-1)}>
                  Huỷ
                </Button> */}
              </div>
            </Form.Item>
          </div>
        </Form>
      </Spin>
    </Card>
  );
}

export default ProductCreate;
