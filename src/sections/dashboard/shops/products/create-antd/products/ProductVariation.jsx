import React, { useEffect, useState } from 'react';

import ProductVariationTable from './ProductVariationTable';
import ProductSectionTitle from './ProuctSectionTitle';
import { useWareHousesStore } from 'src/store/warehousesStore';
import { alerts } from 'src/utils/alerts';
import { Card } from '@mui/material';

function ProductVariation({ shopId, variations, variationsDataTable, isProductCreate }) {
  const [variationProduct, setVariationProduct] = useState([]);
  const { getWarehousesByShopId, warehousesById } = useWareHousesStore((state) => state);

  const variationsData = variationProduct?.map((item) => ({
    variations: item.variations,
    price: item?.price,
    stock_infos: item.stock_infos.map((info) => ({
      available_stock: info.available_stock,
      warehouse_id: info.warehouse_id,
    })),
    seller_sku: item.seller_sku,
    key: item.key,
  }));

  useEffect(() => {
    setVariationProduct(variations);
  }, [variations]);

  useEffect(() => {
    const onSuccess = () => {};
    const onFail = (err) => {
      alerts.error(err);
    };

    getWarehousesByShopId(shopId, onSuccess, onFail);
  }, [shopId]);

  return (
    <Card className="p-3">
      <ProductSectionTitle title="Biến thể sản phẩm" />
      {isProductCreate ? (
        <ProductVariationTable
          variationsData={variationsData}
          variationsDataTable={variationsDataTable}
          warehouses={warehousesById}
          isProductCreate
        />
      ) : (
        <ProductVariationTable
          variationsData={variationsData}
          variationsDataTable={variationsDataTable}
          warehouses={warehousesById}
        />
      )}
    </Card>
  );
}

export default ProductVariation;
