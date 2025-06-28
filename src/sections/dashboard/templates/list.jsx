import { DeleteOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';
import { Modal, Popconfirm, Space, Table, Tooltip, Button as ButtonAntd } from 'antd';
import { useEffect, useState } from 'react';
import { useTemplateStore } from '../../../store/templateStore';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import { Box } from '@mui/system';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import SvgIcon from '@mui/material/SvgIcon';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

import TemplateForm from './TemplateForm';
import { toast } from 'react-toastify';

function Template() {
  const { getAllTemplate, templates, loading, deleteTemplate } = useTemplateStore();

  const [templateSelected, setTemplateSelected] = useState(null);
  const [isShowModal, setShowModal] = useState(false);
  const [templatesData, setTemplateData] = useState([]);

  useEffect(() => {
    const onSuccess = (res) => {
      console.log('res: ', res);
    };
    const onFail = (err) => {
      toast.error(err);
    };
    getAllTemplate(onSuccess, onFail);
  }, []);

  useEffect(() => {
    setTemplateData(templates);
  }, [JSON.stringify(templates)]);

  const handleDeleteTemplate = (id) => {
    const onSuccess = () => {
      toast.success('Xoá template thành công');
      getAllTemplate();
    };
    const onFail = (err) => {
      toast.error(err);
    };
    deleteTemplate(id, onSuccess, onFail);
  };

  const handleDownload = (template) => {
    // Thêm trường để đánh dấu là file download
    const dataTemplate = { ...template, isFromFile: true };
    console.log('dataTemplate: ', dataTemplate);
    const json = JSON.stringify(dataTemplate);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'template.json';
    link.href = url;
    link.click();
  };

  const handleFileUpload = (e) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = JSON.parse(event.target.result);
      setTemplateSelected(data);
      setShowModal(true);
    };

    reader.readAsText(e.target.files[0]);
    return false;
  };

  const storesTable = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      sorter: (store1, store2) => +store1.id - +store2.id,
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (name, store) => (
        <p
          className="text-[#0e2482] font-medium cursor-pointer"
          onClick={() => {
            setShowModal(true);
            setTemplateSelected(store);
          }}
        >
          {name}
        </p>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (description) => (
        <div>
          <div dangerouslySetInnerHTML={{ __html: description }} className="line-clamp-4" />
        </div>
      ),
    },
    // {
    //   title: "Cân nặng",
    //   dataIndex: "package_weight",
    //   key: "package_weight",
    // },
    {
      title: '',
      key: 'action',
      // fixed: "right",
      align: 'center',
      render: (banner) => {
        return (
          <Space size="middle">
            <Tooltip title="Download" color="blue">
              <ButtonAntd
                size="small"
                icon={<DownloadOutlined />}
                onClick={() => {
                  handleDownload(banner);
                }}
              />
            </Tooltip>
            <Tooltip title="Sửa" color="blue">
              <ButtonAntd
                size="small"
                icon={<EditOutlined />}
                onClick={() => {
                  setShowModal(true);
                  setTemplateSelected(banner);
                }}
              />
            </Tooltip>
            <Popconfirm
              placement="topRight"
              title="Bạn có thực sự muốn xoá template này?"
              onConfirm={() => handleDeleteTemplate(banner.id)}
            >
              <Tooltip title="Xóa" color="red">
                <ButtonAntd
                  size="small"
                  icon={<DeleteOutlined />}
                  danger
                  //   onClick={() => handleDeleteBanner(banner.id)}
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const toggleModal = (value) => {
    setShowModal(value);
  };

  const onSearch = (e) => {
    const storesFilter = templates?.filter((item) => {
      return item.name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setTemplateData(storesFilter);
  };

  return (
    <Stack direction="column" spacing={{ xs: 2 }}>
      <Card>
        <CardHeader title="Chức năng" sx={{ pb: 0, pt: 2 }} />
        <CardContent sx={{ p: 2 }}>
          <Grid container spacing={{ xs: 2 }} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box>
                <OutlinedInput
                  defaultValue=""
                  fullWidth
                  placeholder="Tìm kiếm"
                  startAdornment={
                    <InputAdornment position="start">
                      <SvgIcon>
                        <SearchMdIcon />
                      </SvgIcon>
                    </InputAdornment>
                  }
                  name="search"
                  onChange={onSearch}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="flex-end"
                alignItems="center"
                spacing={{ xs: 2 }}
                p={{ xs: 2 }}
              >
                <Button
                  component="label"
                  role={undefined}
                  variant="outlined"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                >
                  Thêm bằng file
                  <VisuallyHiddenInput type="file" accept=".json" multiple={false} onChange={handleFileUpload} />
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setShowModal(true);
                    setTemplateSelected(null);
                  }}
                >
                  Thêm template
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <Table
          columns={storesTable}
          scroll={{ x: true }}
          size="middle"
          bordered
          dataSource={templatesData && templatesData.length ? templatesData : []}
          loading={loading}
          pagination={{
            pageSize: 20,
          }}
        />
      </Card>
      {isShowModal && (
        <Modal
          open={isShowModal}
          onCancel={() => {
            setShowModal(false);
            setTemplateSelected(null);
          }}
          centered
          footer={null}
          width={1000}
          maskClosable={false}
        >
          <TemplateForm
            onSaveTemplate={() => {}}
            setShowModalAddTemplate={toggleModal}
            templateJson={templateSelected}
          />
        </Modal>
      )}
    </Stack>
    // <Layout.Content className="mt-4 px-5">
    //   <p className="my-5 font-semibold text-[20px]">Danh sách template</p>
    //   <div className="mb-4 flex justify-between">
    //     <div className="w-[400px]">
    //       <Search placeholder="Tìm kiếm..." name="search" onChange={onSearch} />
    //     </div>
    //     <div className="flex gap-2">
    //       <Tooltip title="Upload" color="blue">
    //         <Upload accept=".json" beforeUpload={handleFileUpload} multiple={false}>
    //           <Button icon={<UploadOutlined />}>Thêm bằng file</Button>
    //         </Upload>
    //       </Tooltip>
    //       <Button
    //         type="primary"
    //         onClick={() => {
    //           setShowModal(true);
    //           setTemplateSelected(null);
    //         }}
    //       >
    //         Thêm template
    //       </Button>
    //     </div>
    //   </div>
    //
    //   <Table
    //     columns={storesTable}
    //     scroll={{ x: true }}
    //     size="middle"
    //     bordered
    //     dataSource={templatesData && templatesData.length ? templatesData : []}
    //     loading={loading}
    //     pagination={{
    //       pageSize: 20,
    //     }}
    //   />
    //   {isShowModal && (
    //     <Modal
    //       open={isShowModal}
    //       onCancel={() => {
    //         setShowModal(false);
    //         setTemplateSelected(null);
    //       }}
    //       centered
    //       footer={null}
    //       width={1000}
    //       maskClosable={false}
    //     >
    //       <TemplateForm
    //         onSaveTemplate={() => {}}
    //         setShowModalAddTemplate={toggleModal}
    //         templateJson={templateSelected}
    //       />
    //     </Modal>
    //   )}
    // </Layout.Content>
  );
}

export default Template;

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
