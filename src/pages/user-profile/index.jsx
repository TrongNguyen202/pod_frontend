import { useSettings } from '../../hooks/use-settings';
import { usePageView } from '../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { RoleGuard } from '../../guards/role-guard';
import { pagePermissions } from '../../layouts/dashboard/config';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Upload, Drawer, Space, Form, Input } from 'antd';
import { useState } from 'react';

const Page = () => {
  const settings = useSettings();
  usePageView();
  const { Dragger } = Upload;
  const [fileList, setFileList] = useState([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  // Chuyển file thành base64 để hiển thị
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleChange = async ({ fileList: newFileList }) => {
    const updatedFileList = await Promise.all(
      newFileList.map(async (file) => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        return file;
      })
    );
    setFileList(updatedFileList);
  };
  return (
    <>
      <div className="flex gap-6 p-6">
        <Dragger
          className="w-[295px] h-[195px] p-0"
          accept=".png,.jpg,.jpeg"
          fileList={fileList}
          beforeUpload={() => false}
          onChange={handleChange}
          showUploadList={false}
        >
          {fileList.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {fileList.map((file) => (
                <img
                  key={file.uid}
                  src={file.preview}
                  alt="preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                />
              ))}
            </div>
          ) : (
            <div>
              <PlusOutlined style={{ fontSize: 32 }} />
              <div style={{ marginTop: 8 }}>Kéo/thả hoặc click để chọn ảnh</div>
            </div>
          )}
        </Dragger>
        <div className="flex flex-col gap-4">
          <p><b>Đoàn Trọng Quân</b> </p>
          <p><b>Email</b>: </p>
          <p><b>Phone:</b> </p>
          <p><b>Address:</b> </p>
          <div className="flex">
            <Button onClick={showDrawer} type="text" className="text-[#3594d0]">Edit Profile</Button>
            <Button type="text" className="text-[#3594d0]">Change password</Button>
          </div>
        </div>
      </div>
      <Drawer
        closable={false}
        width={400}
        open={open}
        title="Edit Profile"
        extra={
          <Space>
            <CloseOutlined onClick={onClose}  />
          </Space>
        }
      >
        <div className="flex flex-col justify-between h-full">
          <Form layout="horizontal">
            <div className="grid grid-cols-2 gap-3 py-4">
              <Form.Item
                layout="vertical"
                label="First Name"
                name="First Name"
                rules={[{ required: true, message: 'Please input first name!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                layout="vertical"
                label="Last Name"
                name="Last Name"
                rules={[{ required: true, message: 'Please input last name!' }]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-3 py-3">
              <Form.Item
                layout="vertical"
                label="Email"
                name="Email"
                rules={[{ required: true, message: 'Please input your E-mail!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                layout="vertical"
                label="Phone / Facebook"
                name="Phone / Facebook"
              >
                <Input />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-3 py-4">
              <Form.Item
                layout="vertical"
                label="Password"
                name="Password"
                rules={[{ required: true, message: 'Please input password!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                layout="vertical"
                label="Confirm Password"
                name="Confirm Password"
                rules={[{ required: true, message: 'Please input confirm Password!' }]}
              >
                <Input />
              </Form.Item>
            </div>
          </Form>
          <div className="flex gap-2 ml-auto">
            <Button>Cancel</Button>
            <Button type="primary">Save</Button>
          </div>
        </div>
      </Drawer>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    <RoleGuard permissions={pagePermissions.users}>{page}</RoleGuard>
  </DashboardLayout>
);

export default Page;