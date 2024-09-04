import { useEffect } from 'react';
import { Button, Form, Input, message, Modal } from 'antd';
import { useShopsOrder } from '../../../store/ordersStore';

function DesignEdit({ openModal, initData, refreshDesign, groupId }) {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [openEditModal, setOpenEditModal] = openModal;

  const { getDesignSkuByGroup, getDesignSku, postDesignSku, putDesignSku } = useShopsOrder((state) => state);

  const handleUpdateDesign = (values) => {
    if (values.image_front === null && values.image_back === null) {
      messageApi.open({
        type: 'error',
        content: 'Một trong 2 trường Image không được trống',
      });
    } else {
      const onSuccess = (res) => {
        if (res) {
          messageApi.open({
            type: 'success',
            content: `${initData.id ? 'Cập nhật' : 'Thêm'} design thành công`,
          });

          if (groupId) {
            getDesignSkuByGroup(
              groupId,
              (newRes) => refreshDesign(newRes),
              (err) => console.log('Error when fetching design SKU: ', err),
            );
          } else {
            getDesignSku(
              (newRes) => refreshDesign(newRes),
              (err) => console.log('Error when fetching design SKU: ', err),
            );
          }
          setOpenEditModal(false);
        }
      };

      const onFail = (err) => {
        messageApi.open({
          type: 'error',
          content: `${initData.id ? 'Cập nhật' : 'Thêm'} design lỗi: ${err}`,
        });
        setOpenEditModal(false);
      };

      if (values.id) {
        const updateItem = {
          image_front: values.image_front,
          image_back: values.image_back,
        };
        putDesignSku(updateItem, values.id, onSuccess, onFail);
      } else {
        const addItem = [
          {
            sku_id: initData.sku_id,
            product_name: initData.product_name,
            variation: initData.variation,
            ...(values.image_front !== null && { image_front: values.image_front }),
            ...(values.image_back !== null && { image_back: values.image_back }),
          },
        ];

        postDesignSku(addItem, onSuccess, onFail);
      }
    }
  };

  useEffect(() => {
    form.setFieldsValue(initData);
  }, [initData]);

  // console.log('initData: ', initData);
  return (
    <Modal
      title="Sửa Design SKU"
      centered
      open={openEditModal}
      onCancel={() => setOpenEditModal(false)}
      footer={false}
      width={1000}
    >
      <Form name="basic" onFinish={handleUpdateDesign} onFinishFailed={() => {}} layout="horizontal" form={form}>
        {initData.id && (
          <Form.Item name="id" label="Design ID:" className="mb-0 font-bold hidden">
            <Input className="border-none bg-transparent p-0" />
          </Form.Item>
        )}
        <div className="mb-3 flex flex-wrap">
          <span className="font-bold mr-2 text-right min-w-[106px]">Sku ID:</span>
          <p className="flex-1">{initData?.sku_id}</p>
        </div>

        <div className="mb-3 flex flex-wrap">
          <span className="font-bold mr-2 text-right min-w-[106px]">Product name:</span>
          <p className="flex-1">{initData?.product_name}</p>
        </div>

        <div className="mb-3 flex flex-wrap">
          <span className="font-bold mr-2 text-right min-w-[106px]">Variation:</span>
          <p className="flex-1">{initData?.variation}</p>
        </div>

        <Form.Item
          name="image_front"
          className="font-bold"
          label={<label style={{ minWidth: '100px' }}>Image front</label>}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="image_back"
          className="font-bold"
          label={<label style={{ minWidth: '100px' }}>Image back</label>}
        >
          <Input />
        </Form.Item>

        <Form.Item className="flex flex-wrap items-center justify-end mt-5">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      {contextHolder}
    </Modal>
  );
}

export default DesignEdit;
