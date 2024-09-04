import React, { useEffect, useState } from 'react';
import { useTemplateStore } from '../../../store/templateStore';
import { useShopsStore } from '../../../store/shopsStore';
import { useProductsStore } from '../../../store/productsStore';
import { useWareHousesStore } from '../../../store/warehousesStore';
import { alerts } from '../../../utils/alerts';
import Dialog from '@mui/material/Dialog';
import { Autocomplete, DialogActions, DialogTitle, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/system';

export default function ModalUploadProduct({
  isShowModalUpload,
  setShowModalUpload,
  productList,
  imagesLimit = 9,
  modalErrorInfo,
  setModalErrorInfo,
}) {
  // const shopId = getPathByIndex(2);

  const { getAllTemplate, templates } = useTemplateStore();
  const { stores, getAllStores } = useShopsStore((state) => state);
  const { createProductList, loading } = useProductsStore();
  const { getWarehousesByShopId, warehousesById, loadingWarehouse } = useWareHousesStore();

  // eslint-disable-next-line no-unused-vars
  const [productsJSON, setProductsJSON] = useState(productList);
  const [templateJSON, setTemplateJSON] = useState();
  const [warehouseId, setWarehouseId] = useState();
  const [shopId, setShopId] = useState();
  const [templateId, setTemplateId] = useState();

  useEffect(() => {
    getAllTemplate();
    // getWarehousesByShopId(shopId);
    getAllStores();
  }, []);

  const convertShopOption = () => {
    const result = [];
    if (!Array.isArray(stores)) return result;
    stores.forEach((item) => {
      const { shop_name, id } = item;
      result.push({
        value: id,
        label: shop_name,
      });
    });
    return result;
  };

  const convertTemplateOption = () => {
    const result = [];
    if (!Array.isArray(templates)) return result;
    templates.forEach((item) => {
      const { name, id } = item;
      result.push({
        value: id,
        label: name,
      });
    });
    return result;
  };

  const convertDataWarehouse = (data) => {
    if (!data || !Array.isArray(data) || !data.length) return [];
    const result = [];
    data
      ?.filter((item) => item.warehouse_type === 1)
      .forEach((item) => {
        result.push({
          label: item.warehouse_name,
          value: item.warehouse_id,
        });
      });
    return result;
  };

  useEffect(() => {
    if (templateId) {
      onSelectTemplate(templateId);
    }
  }, [templateId]);

  const onSelectTemplate = (value) => {
    const template = templates.find((item) => item.id === value);
    setTemplateJSON(template);
  };

  const onSelectShop = (value) => {
    const onSuccess = () => {};
    const onFail = (err) => {
      alerts.error(err);
    };
    setShopId(value);
    getWarehousesByShopId(value, onSuccess, onFail);
  };

  const handleCancel = () => {
    setShowModalUpload(false);
  };

  const handleValidateJsonForm = () => {
    const skus = [];
    const titles = [];

    if (!Array.isArray(productsJSON)) {
      alerts.error('No products found. Please upload excel file.');
      return false;
    }

    for (const item of productsJSON) {
      const { sku, title, images } = item;
      if (!title?.trim()) {
        alerts.error('title cannot be empty');
        return false;
      }

      if (
        !images.image1 &&
        !images.image2 &&
        !images.image3 &&
        !images.image4 &&
        !images.image5 &&
        !images.image6 &&
        !images.image7 &&
        !images.image8 &&
        !images.image9
      ) {
        alerts.error(`${sku}: Images must have at least one image url`);
        return false;
      }

      skus.push(sku);
      titles.push(title);
    }

    const duplicateTitles = titles.filter((title, index) => {
      return titles.indexOf(title) !== index;
    });

    if (duplicateTitles.length > 0) {
      alerts.error(`Duplicate titles found: ${duplicateTitles.join('; ')}`);
      return false;
    }
    return true;
  };

  function mergeArrays(obj1, arr2) {
    // Convert object to array
    const arr1 = Object.values(obj1);
    console.log('arr1: ', arr1);
    const arr2Length = arr2?.length || 0;

    // Calculate the number of elements to take from imagesLimit
    const numElementsFromArr1 = imagesLimit - arr2Length;

    // Take the first numElementsFromArr1 elements from arr1
    const elementsFromArr1 = arr1.slice(0, numElementsFromArr1);

    // Concatenate elementsFromArr1 and arr2
    const mergedArray = elementsFromArr1.concat(arr2);

    // Convert array back to object
    const result = mergedArray.reduce((obj, value, index) => {
      obj[`image${index + 1}`] = value?.replace('data:image/png;base64,', '');
      return obj;
    }, {});

    const result2 = Object.keys(result).reduce((obj, key) => {
      if (result[key]) {
        obj[key] = result[key];
      }
      return obj;
    }, {});

    return result2;
  }

  const sanitizeTitles = (documents) => {
    const { badWords, suffixTitle } = templateJSON ?? {};
    return documents.map((doc) => {
      let { title } = doc;

      if (badWords && badWords.length > 0) {
        badWords.forEach((word) => {
          const regex = new RegExp(word, 'gi');
          title = title.replace(regex, '');
        });
      }
      if (suffixTitle) {
        title += ` ${suffixTitle}`;
      }
      doc.title = title.trim();
      doc.images = mergeArrays(doc.images, templateJSON.fixed_images);
      return doc;
    });
  };

  const convertDataSku = () => {
    const { types } = templateJSON ?? {};
    const result = [];
    templateJSON.colors.forEach((color) => {
      types.forEach((item) => {
        const obj = {};
        obj.sales_attributes = [
          {
            attribute_name: 'Color',
            custom_value: color,
            attribute_id: '100000',
          },
          {
            attribute_name: 'Size',
            custom_value: item.id,
            attribute_id: '7322572932260136746',
          },
        ];
        obj.original_price = item.price;
        obj.stock_infos = [{ warehouse_id: warehouseId, available_stock: item.quantity }];
        obj.seller_sku = productsJSON.sku || '';
        result.push(obj);
      });
    });

    return result;
  };

  const onSubmit = () => {
    // if (!handleValidateJsonForm()) return;
    if (!shopId) {
      alerts.warning('Please select shop');
      return;
    }
    if (!templateJSON?.id) {
      alerts.warning('Please select template');
      return;
    }
    if (!warehouseId) {
      alerts.warning('Please select warehouse');
      return;
    }
    const {
      category_id,
      is_cod_open,
      warehouse_id,
      package_height,
      package_length,
      package_weight,
      package_width,
      description,
      // types,
      size_chart,
    } = templateJSON ?? {};
    const dataSubmit = {
      excel: sanitizeTitles(productsJSON),
      category_id: String(category_id[category_id.length - 1]),
      warehouse_id,
      package_height,
      package_length,
      package_weight,
      package_width,
      is_cod_open,
      skus: convertDataSku(),
      description,
      size_chart,
    };
    console.log('dataSubmit: ', dataSubmit);
    const onSuccess = (res) => {
      handleResponse(res);
    };
    const onFail = () => {
      alerts.error('Thêm sản phẩm thất bại');
    };
    createProductList(shopId, dataSubmit, onSuccess, onFail);
  };

  const handleResponse = (res) => {
    const countProductSuccess = res.filter((item) => item.status === 'success').length;
    const countProductFail = res.filter((item) => item.status === 'error').length;
    if (countProductSuccess === productsJSON.length) {
      alerts.success(`Upload products successfully ${countProductSuccess}/${countProductSuccess}`);
      handleCancel();
      return;
    }
    if (countProductSuccess < productsJSON.length && countProductSuccess > 0) {
      alerts.success(`Upload products successfully ${productsJSON.length - countProductFail}/${productsJSON.length}`);
      setModalErrorInfo({
        isShow: true,
        data: res,
        title: `Upload failed ${countProductFail} products`,
      });
      handleCancel();
      return;
    }
    if (countProductSuccess === 0) {
      alerts.error('Upload failed all products');
      setModalErrorInfo({
        isShow: true,
        data: res,
        title: 'Upload failed all products',
      });
    }
  };

  return (
    <Dialog onClose={handleCancel} open={isShowModalUpload} loading={loading}>
      <DialogTitle>{`Upload ${productList?.length} Product`}</DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={{ xs: 2 }} py={1} minWidth={450} disabled={loading}>
          <FormControl fullWidth>
            <Autocomplete
              multiple={false}
              options={convertShopOption().sort((a, b) => a?.label?.localeCompare(b.label))}
              renderInput={(params) => <TextField {...params} label="Select shop" />}
              onChange={(e, value) => onSelectShop(value?.value)}
              value={shopId}
            />
          </FormControl>
          <FormControl fullWidth>
            <Autocomplete
              multiple={false}
              options={convertTemplateOption().sort((a, b) => a?.label?.localeCompare(b.label))}
              renderInput={(params) => <TextField {...params} label="Select template" />}
              onChange={(e, value) => setTemplateId(value?.value)}
              value={templateId}
            />
          </FormControl>
          <FormControl fullWidth>
            <Autocomplete
              multiple={false}
              options={convertDataWarehouse(warehousesById.warehouse_list).sort((a, b) =>
                a?.label?.localeCompare(b.label),
              )}
              renderInput={(params) => <TextField {...params} label="Select warehouse" />}
              onChange={(e, value) => setWarehouseId(value?.value)}
              value={warehouseId}
            />
          </FormControl>
        </Stack>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" hidden={!loading}>
          <CircularProgress />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleCancel} autoFocus>
          Cancel
        </Button>
        <Button variant="contained" onClick={onSubmit}>
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}
