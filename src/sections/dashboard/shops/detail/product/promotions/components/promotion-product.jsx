import { EyeOutlined } from '@ant-design/icons';
import { Button } from '@mui/material';
import { Table } from 'antd';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePromotionsStore } from 'src/store/promotionsStore';

const PromotionProduct = (props) => {
  const { changeStatusModal, dataProductSelected, promotionType } = props;
  const searchParams = useSearchParams();
  const shopId = searchParams.get('id');
  const [productSelect, setProductSelect] = useState([]);
  const [productSelected, setProductSelected] = useState([]);
  const { listProductNoDiscount, listProductNoFlashDeal, loading } = usePromotionsStore((state) => state);
  const handleDone = () => {
    dataProductSelected(productSelected);
    changeStatusModal(false);
  };

  const rowSelection = {
    onChange: (_, selectedRows) => {
      setProductSelected(selectedRows);
    },
  };

  const columns = [
    {
      title: 'Product Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Product name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      width: '100px',
      render: (_, record) => (
        <Link href={`/shops/${shopId}/products/${record.id}`} target="_blank">
          <EyeOutlined />
        </Link>
      ),
    },
  ];

  useEffect(() => {
    const onSuccess = (res) => {
      if (res) {
        setProductSelect(res);
      }
    };

    const OnFail = () => {};
    if (promotionType === 'FlashSale') {
      listProductNoFlashDeal(shopId, onSuccess, OnFail);
    } else {
      listProductNoDiscount(shopId, onSuccess, OnFail);
    }
  }, [shopId]);

  return (
    <>
      {!loading && (
        <p className="mb-2">
          {productSelected.length} / {productSelect?.products?.length} products selected
        </p>
      )}
      <Table
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        columns={columns}
        dataSource={productSelect.products}
        bordered
        rowKey={(record) => record.id}
        pagination={{
          pageSize: 50,
        }}
        scroll={{ y: 300 }}
        loading={loading}
      />
      <div className="mt-3 flex flex-wrap items-center justify-end gap-3">
        <Button size="small" variant="outlined" onClick={() => changeStatusModal(false)}>
          Cancel
        </Button>
        <Button size="small" variant="contained" onClick={handleDone}>
          Done
        </Button>
      </div>
    </>
  );
};

export default PromotionProduct;
