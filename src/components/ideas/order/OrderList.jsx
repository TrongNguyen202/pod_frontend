import React from 'react';
import { Grid } from '@mui/material';
import OrderCard from './OrderCard';

const OrderList = ({
  orders = [],
  selectedCategory,
  checkedOrderIds = [],
  handleClickOpenDetail,
  handleClickDeleteIcon,
  handleToggleCheck,
  productTypeData,
  handleAmountFormat,
  role,
}) => {
  const isCustomer = role === 'customer';
  const isDesigner = role === 'designer';

  return (
    <Grid container spacing={2} sx={{ marginTop: 2 }} minHeight={400}>
      {orders.map((item) => {
        const showCheckbox = ['NEW', 'DRAFT'].includes(selectedCategory);
        const canDelete = isCustomer && ['DRAFT', 'NEW'].includes(item.status);
        const priceValue = isCustomer ? item.price : isDesigner ? item.price_ : 0;

        return (
          <Grid item size={3} xs={12} sm={6} md={3} key={item.id} position="relative">
            <OrderCard
              item={item}
              role={role}
              isChecked={checkedOrderIds.includes(item.id)}
              onClick={handleClickOpenDetail}
              onDelete={handleClickDeleteIcon}
              onToggleCheck={handleToggleCheck}
              showCheckbox={showCheckbox}
              canDelete={canDelete}
              productTypeData={productTypeData}
              handleAmountFormat={() => handleAmountFormat(priceValue)}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default OrderList;
