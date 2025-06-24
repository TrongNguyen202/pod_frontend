import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  AppBar,
  Toolbar,
  Modal,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { Seo } from 'src/components/seo';
import Header from 'src/components/header';
import Sidebar from 'src/components/sidebar';
import FormDialog from 'src/components/popup';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { useTranslation } from 'react-i18next';
import { tokens } from 'src/locales/tokens';
import { getFieldsIdeas } from 'src/utils/fields-edit.board';
import FormDialogSplitLayout from 'src/components/form-split';
import {
  changeStatusOrders,
  fetchAssignOrdersForDesigner,
  fetchGetOrdersByBoardId,
  postOrder,
  requestDeleteOrders,
  resetDataListOrder,
} from 'src/redux/reducers/orders';
import { requestUploadImages } from 'src/redux/reducers/images';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import LayersIcon from '@mui/icons-material/Layers';
import NumbersIcon from '@mui/icons-material/Numbers';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import toast from 'react-hot-toast';
import handleAmountFormat from 'src/utils/amount-vnd';
import OrderDetailModal from 'src/components/modal-order-detail';
import { categoryColors } from 'src/constants';
import { requestPermissionAndListen } from 'src/services/firebase';
import { checkRole, formatCategoryLabel, getAllowedStatusOptions, getCategoryCounts } from 'src/utils';
import { fetchGetDesginerIds, fetchUserByEmail, resetDataDesginerIds } from 'src/redux/reducers/user';
import { fetchSendPushNotifications } from 'src/redux/reducers/notifications';

const useGetDesignerIds = (dispatch, role) => {
  const { isCustomer } = checkRole(role);

  useEffect(() => {
    if (isCustomer) {
      dispatch(fetchGetDesginerIds());
    } else {
      dispatch(resetDataDesginerIds());
    }
  }, [dispatch, isCustomer]);

  return useAppSelector((state) => state.users.designerIds);
};

const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const [boardId, setBoardId] = useState(null);
  const [openImageViewer, setOpenImageViewer] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openConfirmAsgin, setOpenConfirmAsgin] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [checkedOrderIds, setCheckedOrderIds] = useState([]);
  const [role, setRole] = useState('');

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [selectedTab, setSelectedTab] = useState(0);
  const { data: userData } = useAppSelector((state) => state.users.userInfo);
  const { data: productTypeData } = useAppSelector((state) => state.productTypes.productTypes);
  const { data: orderData } = useAppSelector((state) => state.orders.orderService);
  const { data: templatesData } = useAppSelector((state) => state.templates.templateInfo);
  const { data: desginerIds } = useGetDesignerIds(dispatch, role);
  const { data: boardData } = useAppSelector((state) => state.boards.boardInfo);
  useEffect(() => {
    if (userData) {
      setRole(userData.role_name);
    }
  }, [userData]);

  const { isAdmin, isDesigner, isCustomer } = checkRole(role);

  useEffect(() => {
    if (userData?.id) {
      requestPermissionAndListen(userData.id, dispatch);
    }
  }, [userData?.id]);

  const categories = getCategoryCounts(orderData.length > 0 ? orderData : [], role);
  const selectedCategory = categories[selectedTab].value;
  const filteredIdeas =
    Array.isArray(orderData) && orderData.length > 0 && selectedCategory === 'ALL'
      ? orderData
      : Array.isArray(orderData)
        ? orderData.filter((i) => i.status === selectedCategory)
        : [];
  const filteredOrders = orderData.filter((item) => selectedCategory === 'ALL' || item.status === selectedCategory);

  const canDeleteOrder = (userRole, status) => userRole === 'customer' && ['DRAFT', 'NEW'].includes(status);

  const handleToggleCheck = (id) => {
    setCheckedOrderIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleToggleCheckAll = () => {
    const filteredIds = filteredOrders.map((item) => item.id);
    const allChecked = filteredIds.every((id) => checkedOrderIds.includes(id));

    if (allChecked) {
      setCheckedOrderIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      const newChecked = [...new Set([...checkedOrderIds, ...filteredIds])];
      setCheckedOrderIds(newChecked);
    }
  };

  const handleBoardChange = (newBoardId) => {
    setBoardId(newBoardId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('b', String(newBoardId ?? 'null'));
    }
  };

  const fieldIdeas = useMemo(() => {
    return getFieldsIdeas(productTypeData, templatesData);
  }, [JSON.stringify(productTypeData, templatesData)]);

  const initialData = useMemo(
    () => ({
      title: '',
      description: '',
      images: '',
      designType: boardData.designType,
      productTypeId: boardData?.productTypeIds?.[0] || '',
      quantity: 1,
      number: 1,
      price: 35000,
      completed_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      templates: [],
    }),
    [boardData],
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem('b');
      if (savedId) {
        setBoardId(savedId === 'null' ? null : savedId);
      }
    }
  }, []);

  useEffect(() => {
    if (!role) return;
    dispatch(resetDataListOrder());
    if (!isDesigner && isCustomer && boardId) {
      const query = `boardId=${boardId}`;
      dispatch(fetchGetOrdersByBoardId({ query }));
    } else if (isDesigner && userData?.id) {
      // const query = `designerId=${userData.id}`;
      const query = ``;
      dispatch(fetchGetOrdersByBoardId({ query }));
    }
  }, [role, boardId, dispatch]);

  const requiredFields = fieldIdeas.filter((f) => f.required && f.name !== 'images').map((f) => f.name);

  const isFormValid = (formData) => {
    return requiredFields.every((field) => {
      const value = formData.get(field);
      return value !== undefined && value !== null && value.toString().trim() !== '';
    });
  };

  const handleSubmitIdeas = async (formData, status) => {
    try {
      const hasImages = formData.getAll('images[]')?.length > 0;

      const isValid = isFormValid(formData) && hasImages;
      if (!isValid || !hasImages) {
        toast.error('Vui lòng điền đầy đủ các trường bắt buộc và chọn ít nhất 1 ảnh.');
        return;
      }

      const imageFiles = formData.getAll('images[]');
      const uploadFormData = new FormData();
      imageFiles.forEach((file) => {
        uploadFormData.append('files', file);
      });

      const imagesUpload = await dispatch(requestUploadImages({ data: uploadFormData }));
      const imageUrls = imagesUpload.payload?.map((p) => p.url) || [];

      if (imageUrls.length === 0) {
        toast.error('Không có ảnh nào được upload!');
        return;
      }

      const finalPayload = {
        name: formData.get('title'),
        description: formData.get('description'),
        productTypeId: formData.get('productTypeId'),
        designType: formData.get('designType'),
        images: imageUrls,
        userId: userData.id,
        boardId,
        tagNew: true,
        status,
        number: Number(formData.get('number') || 1),
        quantity: Number(formData.get('quantity') || 1),
        price: Number(formData.get('price') || 0),
        completedAt: formData.get('completed_at'),
      };

      const response = await dispatch(postOrder({ data: finalPayload }));
      if (response.payload?.status === 200) {
        const query = `boardId=${boardId}`;
        await dispatch(fetchGetOrdersByBoardId({ query }));
        await dispatch(fetchUserByEmail({ email: userData?.email }));
        if (status === 'NEW') {
          const data = {
            designerIds: desginerIds,
            title: 'Có đơn hàng mới',
            message: 'Có đơn hàng mới được lên sàn, vào nhận ngay!',
          };
          await dispatch(fetchSendPushNotifications(data));
        }
        toast.success('Order created successfully!');
      } else {
        toast.error('Tạo order thất bại!');
      }
    } catch (error) {
      console.error('Error submitting ideas:', error);
      toast.error('An error occurred while creating the order.');
    }
  };

  const handleClickDeleteIcon = (id) => {
    setSelectedId(id);
    setOpenConfirm(true);
  };

  const handleCloseDialog = () => {
    setOpenConfirm(false);
  };

  const handleConfirmDelete = async () => {
    if (selectedId !== null) {
      const ids = [Number(selectedId)];
      const response = await dispatch(requestDeleteOrders({ ids }));

      if (response.payload?.status === 200) {
        const query = `boardId=${boardId}`;
        await dispatch(fetchGetOrdersByBoardId({ query }));
        toast.success('Delete successfully!');
      } else {
        toast.error('Delete failed!');
      }
      setOpenConfirm(false);
    }
  };

  const handleClickOpenDetail = (order) => {
    setSelectedOrder(order);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedOrder(null);
  };

  const handleCheckboxItem = (e, itemId) => {
    e.stopPropagation();
    handleToggleCheck(itemId);
  };

  const selectedOrders = filteredOrders.filter((item) => checkedOrderIds.includes(item.id));
  const currentStatuses = [...new Set(selectedOrders.map((item) => item.status))];

  const allowedStatuses = getAllowedStatusOptions(role, currentStatuses);
  const statusOptions = allowedStatuses.map((s) => ({
    label: formatCategoryLabel(s),
    value: s,
  }));

  const isAcceptableToAssign =
    isDesigner &&
    selectedOrders.length > 0 &&
    [...new Set(selectedOrders.map((item) => item.status))].length === 1 &&
    selectedOrders[0].status === 'NEW';

  const confirmAssignOrders = async (userIds) => {
    try {
      const notificationMessage = {
        customerIds: userIds || [],
        title: 'Trạng thái đơn hàng',
        message: 'Có đơn hàng của bạn thay đổi trạng thái, vào xem ngay!',
      };
      await dispatch(fetchSendPushNotifications(notificationMessage));

      const data = {
        orderIds: checkedOrderIds,
      };
      const response = await dispatch(fetchAssignOrdersForDesigner({ data }));

      if (response.meta.requestStatus === 'fulfilled') {
        toast.success('Nhận đơn thành công!');
        setCheckedOrderIds([]);
        dispatch(fetchGetOrdersByBoardId({ query: `` }));
      } else {
        toast.error(response.message || 'Nhận đơn thất bại');
      }
    } catch (err) {
      toast.error('Đã có lỗi xảy ra khi nhận đơn');
    } finally {
      setOpenConfirmAsgin(false);
    }
  };

  const handleChangeStatusOrders = async (data, orderIds) => {
    if (data && orderIds) {
      data.ids = orderIds;
      const response = await dispatch(changeStatusOrders({ data }));
      const { status, message } = response.payload || {};

      if (status === 200) {
        if (isCustomer) {
          const query = `boardId=${boardId}`;
          await dispatch(fetchGetOrdersByBoardId({ query }));
          setCheckedOrderIds([]);
          if (data.status === 'NEW') {
            const data = {
              designerIds: desginerIds,
              title: 'Có đơn hàng mới',
              message: 'Có đơn hàng mới được lên sàn, vào nhận ngay!',
            };
            await dispatch(fetchUserByEmail({ email: userData?.email }));
            await dispatch(fetchSendPushNotifications(data));
          }
        } else if (isDesigner) {
          // const query = `designerId=${userData?.id}`;
          const query = ``;
          await dispatch(fetchGetOrdersByBoardId({ query }));
          setCheckedOrderIds([]);
        }
        toast.success('Change status successfully!');
      } else {
        toast.error(message || 'Lỗi khi chuyển trạng thái đơn hàng');
      }
    }
  };

  const handleMoreFilter = async () => {};

  return (
    <>
      <Seo title="Ideas" />
      <Header onBoardChange={handleBoardChange} showBoards={true} role={role} />
      <Toolbar />

      <Box sx={{ display: 'flex' }}>
        {role && <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} role={role} />}

        {!isAdmin && (
          <>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                padding: 2,
              }}
            >
              <Box>
                {/* {isCustomer && isDesigner && ()} */}
                <Card>
                  <CardContent>
                    <Grid
                      xs={12}
                      sm={6}
                      md={3}
                      size={12}
                      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 0 }}
                    >
                      {isCustomer && (
                        <Grid width={'15%'} size={4} padding={0} display={'flex'}>
                          <FormDialogSplitLayout
                            title="Create New Idea"
                            fields={fieldIdeas}
                            onSubmit={handleSubmitIdeas}
                            buttonLabel={t(tokens.nav.addnew)}
                            initialData={initialData}
                            productTypeData={productTypeData}
                            templatesData={templatesData}
                            buttonProps={{
                              variant: 'contained',
                              disabled: !boardId,
                            }}
                          />
                          {/* <ClickDropdownMenu
                              buttonLabel={<MoreVertIcon />}
                              options={[
                                { label: 'Import From CSV', value: 'import_csv' },
                                { label: 'Import From Folder', value: 'import_folder' },
                              ]}
                              onSelect={handleSelect}
                              buttonProps={{
                                variant: 'contained',
                                disabled: boardId === null || boardId === 0,
                                sx: {
                                  padding: '8px 16px',
                                  backgroundColor: 'primary.main',
                                  color: 'white',
                                  borderRadius: 0,
                                  borderTopRightRadius: 12,
                                  borderBottomRightRadius: 12,
                                  minWidth: 0,
                                },
                              }}
                            /> */}
                        </Grid>
                      )}

                      <Grid
                        size={isCustomer ? 8 : 12}
                        position="static"
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexDirection: 'row',
                          width: isCustomer ? '85%' : '100%',
                          backgroundColor: '#fff',
                        }}
                      >
                        <TextField
                          variant="outlined"
                          InputProps={{
                            style: {
                              color: '#000',
                            },
                          }}
                          placeholder={t(tokens.nav.search)}
                          sx={{
                            '& .MuiInputBase-input::placeholder': {
                              color: '#000',
                              opacity: 1,
                            },
                            marginRight: 2,
                            padding: 0,
                            flexGrow: 1,
                          }}
                        />
                        <Button variant="contained" onClick={handleMoreFilter}>
                          {t(tokens.nav.more_filter)}
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {role && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Tabs
                      value={selectedTab}
                      onChange={(e, v) => setSelectedTab(v)}
                      sx={{ mt: 2 }}
                      // textColor="primary"
                      variant="scrollable"
                      scrollButtons="auto"
                    >
                      {categories.map((category, idx) => (
                        <Tab
                          key={idx}
                          label={`${category.label} ${category.count}`}
                          sx={{
                            color: categoryColors[category.value],
                            borderRadius: 1,
                            mx: 0.5,
                            minHeight: '36px',
                            padding: 1,
                            fontWeight: 500,
                            '&.Mui-selected': {
                              backgroundColor: '#f3f3f3',
                              // color: '#1976d2',
                            },
                          }}
                        />
                      ))}
                    </Tabs>
                    <Card variant="outlined" sx={{ display: 'flex', alignItems: 'center', border: 0 }}>
                      <Checkbox
                        sx={{ mr: 2 }}
                        checked={
                          filteredOrders.length > 0 && filteredOrders.every((item) => checkedOrderIds.includes(item.id))
                        }
                        indeterminate={
                          filteredOrders.some((item) => checkedOrderIds.includes(item.id)) &&
                          !filteredOrders.every((item) => checkedOrderIds.includes(item.id))
                        }
                        onChange={handleToggleCheckAll}
                      />
                      <Card variant="outlined" sx={{ pl: 2, borderRadius: 2 }}>
                        {filteredOrders.filter((item) => checkedOrderIds.includes(item.id)).length}{' '}
                        {t(tokens.nav.selected)}
                        {isAcceptableToAssign ? (
                          <>
                            <Button
                              onClick={() => setOpenConfirmAsgin(true)}
                              variant="contained"
                              color="primary"
                              size="small"
                              sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, m: 0 }}
                            >
                              Nhận đơn
                            </Button>

                            {/* Confirm Dialog */}
                            <Dialog open={openConfirmAsgin} onClose={() => setOpenConfirmAsgin(false)}>
                              <DialogTitle>Xác nhận nhận đơn</DialogTitle>
                              <DialogContent>
                                <DialogContentText>
                                  Bạn có chắc chắn muốn nhận {checkedOrderIds.length} đơn hàng?
                                </DialogContentText>
                              </DialogContent>
                              <DialogActions>
                                <Button onClick={() => setOpenConfirmAsgin(false)} color="inherit">
                                  Hủy
                                </Button>
                                <Button
                                  onClick={() => {
                                    const selectedUserIds = orderData
                                      .filter((order) => checkedOrderIds.includes(order.id))
                                      .map((order) => order.userid)
                                      .filter((v, i, self) => v && self.indexOf(v) === i);

                                    confirmAssignOrders(selectedUserIds);
                                  }}
                                  color="primary"
                                  variant="contained"
                                >
                                  Xác nhận
                                </Button>
                              </DialogActions>
                            </Dialog>
                          </>
                        ) : (
                          <FormDialog
                            buttonLabel={<MoreVertIcon />}
                            title={t(tokens.nav.changeStatus)}
                            fields={[
                              {
                                name: 'status',
                                label: t(tokens.nav.status),
                                type: 'select',
                                options: statusOptions,
                              },
                            ]}
                            onSubmit={(data) => {
                              handleChangeStatusOrders(data, checkedOrderIds);
                            }}
                            buttonProps={{
                              sx: { borderTopLeftRadius: 0, borderBottomLeftRadius: 0, m: 0 },
                              variant: 'text',
                              color: 'primary',
                              size: 'medium',
                            }}
                          />
                        )}
                      </Card>
                    </Card>
                  </Box>
                )}

                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                  {orderData
                    .filter((item) => {
                      const selectedCategory = categories[selectedTab].value;
                      return selectedCategory === 'ALL' || item.status === selectedCategory;
                    })
                    .map((item) => {
                      let itemImages = [];
                      try {
                        itemImages = JSON.parse(item.images || '[]');
                      } catch (e) {
                        itemImages = [];
                      }
                      return (
                        <Grid item size={3} xs={12} sm={6} md={3} key={item.id} position="relative">
                          <Paper
                            variant="outlined"
                            onClick={() => handleClickOpenDetail(item)}
                            sx={{
                              height: 330,
                              display: 'flex',
                              flexDirection: 'column',
                              backgroundColor: '#f5f5f5',
                              overflow: 'hidden',
                              borderRadius: 2,
                              cursor: 'pointer',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                margin: '0 8px',
                              }}
                            >
                              <Checkbox
                                checked={!!checkedOrderIds.includes(item.id)}
                                onClick={(e) => handleCheckboxItem(e, item.id)}
                              />

                              {canDeleteOrder(role, item.status) && (
                                <Box
                                  sx={{ padding: '14px 16px', cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleClickDeleteIcon(item.id);
                                  }}
                                >
                                  <Delete sx={{ color: 'red' }} />
                                </Box>
                              )}
                            </Box>

                            {/* Vùng ảnh chính */}
                            <Box sx={{ width: '100%', overflow: 'hidden' }}>
                              <img
                                src={itemImages[0] || '/fallback.png'}
                                alt={item.title}
                                style={{
                                  width: '100%',
                                  height: '330px',
                                  objectFit: 'cover',
                                }}
                              />
                            </Box>

                            {itemImages.length > 1 && (
                              <Box
                                sx={{
                                  display: 'flex',
                                  gap: 0.5,
                                  p: 1,
                                  overflowX: 'auto',
                                  maxHeight: 60,
                                  bgcolor: '#fafafa',
                                }}
                              >
                                {itemImages.slice(1, 4).map((url, idx) => (
                                  <Box
                                    key={idx}
                                    sx={{
                                      width: 50,
                                      height: 50,
                                      borderRadius: 1,
                                      overflow: 'hidden',
                                      flexShrink: 0,
                                      border: '1px solid #ccc',
                                    }}
                                  >
                                    <img
                                      src={url}
                                      alt={`preview-${idx}`}
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                      }}
                                    />
                                  </Box>
                                ))}
                              </Box>
                            )}

                            {/* Thông tin đơn */}
                            <Box
                              sx={{
                                flex: 1,
                                p: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                fontSize: '0.75rem',
                              }}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography noWrap variant="body1" fontWeight="bold" color="text.secondary">
                                  {item.usercreate}
                                </Typography>
                                <Typography noWrap variant="body2" fontWeight="bold" color="text.secondary">
                                  {item.name}
                                </Typography>
                              </Box>

                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  margin: '4px 0',
                                }}
                              >
                                <Box>
                                  <Typography
                                    noWrap
                                    variant="body3"
                                    color="text.secondary"
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <CalendarMonthIcon />
                                    {new Date(item.createddate).toLocaleDateString('vi-VN')}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography noWrap variant="body4" marginLeft="4px" title="Files">
                                    <AttachFileIcon />
                                    {itemImages.length}
                                  </Typography>
                                  <Typography noWrap variant="body4" marginLeft="4px" title="Quantity">
                                    <LayersIcon />
                                    {item.quantity}
                                  </Typography>
                                  <Typography noWrap variant="body4" marginLeft="4px" title="Number">
                                    <NumbersIcon /> {item.number}
                                  </Typography>
                                </Box>
                              </Box>

                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  margin: '4px 0',
                                }}
                              >
                                <Box>
                                  <Typography noWrap variant="body4" title="ProductType">
                                    {productTypeData.find((pt) => pt.id === item.producttypeid)?.name}
                                  </Typography>
                                  <Typography noWrap variant="body4" marginLeft="12px" title="DesignType">
                                    {item.designtype}
                                  </Typography>
                                </Box>
                                <Typography noWrap variant="body1" fontSize="20px" marginLeft="4px" title="Files">
                                  {handleAmountFormat(isCustomer ? item.price : isDesigner ? item.pricede : 0)} đ
                                </Typography>
                              </Box>
                            </Box>
                          </Paper>
                        </Grid>
                      );
                    })}
                </Grid>
                <OrderDetailModal
                  open={openDetailModal}
                  order={selectedOrder}
                  onClose={handleCloseDetailModal}
                  handleAmountFormat={handleAmountFormat}
                  userData={userData}
                  role={role}
                  productTypeData={productTypeData}
                />

                {/* Pagination Footer */}
                <Paper variant="outlined" sx={{ mt: 2, p: 2, pr: 8 }}>
                  <Grid container spacing={2} justifyContent="flex-end">
                    <Grid item>
                      <Typography>{`1-1 of ${filteredIdeas.length} items`}</Typography>
                    </Grid>
                    <Grid item>
                      <Button variant="contained" size="small">
                        &lt;
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button variant="contained" size="small">
                        &gt;
                      </Button>
                    </Grid>
                    <Grid item>
                      <Typography>Page 1 of 1</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </Box>
            <Modal
              open={openImageViewer}
              onClose={() => {
                setOpenImageViewer(false);
                setSelectedImageUrl(null);
              }}
            >
              <Box
                onClick={() => setOpenImageViewer(false)}
                sx={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  bgcolor: 'rgba(0, 0, 0, 0.85)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 9999,
                }}
              >
                <img
                  src={selectedImageUrl || ''}
                  alt="Preview"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    maxWidth: '90%',
                    maxHeight: '90%',
                    objectFit: 'contain',
                    borderRadius: 8,
                    boxShadow: '0 0 10px #000',
                    cursor: 'zoom-out',
                  }}
                />
              </Box>
            </Modal>
            {openConfirm && (
              <>
                <Dialog open={openConfirm} onClose={handleCloseDialog}>
                  <DialogTitle>{t(tokens.nav.confirm)}</DialogTitle>
                  <DialogContent>
                    <Typography>{t(tokens.nav.message_delete)}</Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseDialog} color="inherit">
                      Hủy
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                      Xóa
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default React.memo(Page);
