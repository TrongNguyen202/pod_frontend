import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OrderList from 'src/components/ideas/order/OrderList';
import OrderPagination from 'src/components/ideas/order/OrderPagination';
import OrderTabs from 'src/components/ideas/order/OrderTabs';
import OrderToolbar from 'src/components/ideas/order/OrderToolbar';
import PageLayout from 'src/components/ideas/page-layout';
import OrderDetailModal from 'src/components/modal-order-detail';
import useCheckboxManager from 'src/hooks/ideas/useCheckboxManager';
import useInitialBoard from 'src/hooks/ideas/useInitialBoard';
import useOrderFetcher from 'src/hooks/ideas/useOrderFetcher';
import useOrderFilter from 'src/hooks/ideas/useOrderFilter';
import useOrderHandlers from 'src/hooks/ideas/useOrderHandlers';
import { useGetAllStatus } from 'src/hooks/useGetAllStatus';
import { tokens } from 'src/locales/tokens';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { fetchGetAllStatus } from 'src/redux/reducers/orders';
import { fetchGetDesginerIds, resetDataDesginerIds } from 'src/redux/reducers/user';
import { requestPermissionAndListen } from 'src/services/firebase';
import { checkRole, formatCategoryLabel, getAllowedStatusOptions, getCategoryCounts } from 'src/utils';
import handleAmountFormat from 'src/utils/amount-vnd';
import { getFieldsIdeas } from 'src/utils/fields-edit.board';
import buildQueryString from 'src/utils/ideas/buildQueryString';

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const { boardId, setBoardId } = useInitialBoard();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [role, setRole] = useState('');
  const [openDrawerFilter, setOpenDrawerFilter] = useState(false);
  const [openConfirmAssign, setOpenConfirmAssign] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedBoardId = localStorage.getItem('b');
      if (storedBoardId && storedBoardId !== 'null') {
        setBoardId(Number(storedBoardId));
      }
    }
  }, []);

  const {
    page,
    setPage,
    limit,
    setLimit,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    minPriceDe,
    maxPriceDe,
    setMinPriceDe,
    setMaxPriceDe,
    startCreateDate,
    endCreateDate,
    setStartCreateDate,
    setEndCreateDate,
    startUpdateDate,
    endUpdateDate,
    setStartUpdateDate,
    setEndUpdateDate,
    searchText,
    setSearchText,
    searchTextInput,
    setSearchTextInput,
    clearFilters: handleClearFilters,
  } = useOrderFilter();

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [selectedTab, setSelectedTab] = useState(0);
  const { data: userData } = useAppSelector((state) => state.users.userInfo);
  const { data: productTypeData } = useAppSelector((state) => state.productTypes.productTypes);
  const {
    data: orderData,
    total: totalOrders,
    totalPages: totalPages,
    loading: isLoading,
  } = useAppSelector((state) => state.orders.orderService);
  const { data: templatesData } = useAppSelector((state) => state.templates.templateInfo);
  const { data: desginerIds } = useGetDesignerIds(dispatch, role);
  const { data: boardData } = useAppSelector((state) => state.boards.boardInfo);
  const { data: statusCount } = useGetAllStatus(dispatch, boardId, role);

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

  const categories = getCategoryCounts(role, statusCount);
  const selectedCategory = categories[selectedTab].value;

  const filteredOrders = useMemo(() => {
    if (!Array.isArray(orderData)) return [];
    if (selectedCategory === 'ALL') return orderData;
    return orderData.filter((item) => item.status === selectedCategory);
  }, [orderData, selectedCategory]);

  const { checkedOrderIds, handleToggleCheck, handleToggleCheckAll, resetChecked } = useCheckboxManager(orderData);

  const handleBoardChange = setBoardId;

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
      price: 0,
      completed_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      templates: [],
    }),
    [boardData],
  );

  const buildQuery = () =>
    buildQueryString({
      selectedCategory,
      boardId,
      sortBy,
      sortDirection,
      startCreateDate,
      endCreateDate,
      startUpdateDate,
      endUpdateDate,
      minPrice,
      maxPrice,
      minPriceDe,
      maxPriceDe,
      searchText,
      page,
      limit,
    });

  useOrderFetcher({
    role,
    boardId,
    selectedCategory,
    page,
    limit,
    sortBy,
    sortDirection,
    minPrice,
    maxPrice,
    minPriceDe,
    maxPriceDe,
    startCreateDate,
    endCreateDate,
    startUpdateDate,
    endUpdateDate,
    searchText,
    buildQuery,
  });

  const handleTabChange = (event, newTabIndex) => {
    setSelectedTab(newTabIndex);
    setPage(1);
  };

  const requiredFields = fieldIdeas.filter((f) => f.required && f.name !== 'images').map((f) => f.name);

  const handleClickDeleteIcon = (id) => {
    setSelectedId(id);
    setOpenConfirm(true);
  };

  const handleCloseDialog = () => {
    setOpenConfirm(false);
  };

  const handleClickOpenDetail = (order) => {
    setSelectedOrder(order);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setSelectedOrder(null);
    setOpenDetailModal(false);
  };

  const selectedOrders = useMemo(
    () => filteredOrders.filter((item) => checkedOrderIds.includes(item.id)),
    [filteredOrders, checkedOrderIds],
  );
  const currentStatuses = useMemo(() => [...new Set(selectedOrders.map((item) => item.status))], [selectedOrders]);
  const allowedStatuses = useMemo(() => getAllowedStatusOptions(role, currentStatuses), [role, currentStatuses]);

  const statusOptions = useMemo(
    () =>
      allowedStatuses.map((s) => ({
        label: formatCategoryLabel(s),
        value: s,
      })),
    [allowedStatuses],
  );

  const isAcceptableToAssign =
    isDesigner &&
    selectedOrders.length > 0 &&
    [...new Set(selectedOrders.map((item) => item.status))].length === 1 &&
    selectedOrders[0].status === 'NEW';

  const { handleSubmitIdeas, handleConfirmDelete, confirmAssignOrders, handleChangeStatusOrders, fetchAllStatuses } =
    useOrderHandlers({
      buildQuery,
      requiredFields,
      userData,
      boardId,
      role,
      desginerIds,
      isCustomer,
      isDesigner,
      selectedId,
      checkedOrderIds,
      setOpenConfirm,
      resetChecked,
    });

  const handleSetLimitPerPage = (data) => {
    setLimit(data);
  };

  const handleMoreFilter = async () => {
    setOpenDrawerFilter(true);
  };

  const handleCloseMoreFilter = () => {
    setOpenDrawerFilter(false);
  };

  const handleStatusChanged = () => {
    dispatch(fetchGetAllStatus(boardId ? `boardId=${boardId}` : ''));
  };

  return (
    <PageLayout role={role} sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} onBoardChange={handleBoardChange}>
      {(!isAdmin && isCustomer && boardId) || isDesigner ? (
        <>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              padding: 2,
            }}
          >
            <Box>
              {/* Search orders */}
              <OrderToolbar
                role={role}
                boardId={boardId}
                productTypeData={productTypeData}
                templatesData={templatesData}
                fieldIdeas={fieldIdeas}
                onSubmitIdea={handleSubmitIdeas}
                initialData={initialData}
                onMoreFilter={handleMoreFilter}
                openDrawerFilter={openDrawerFilter}
                onCloseDrawerFilter={handleCloseMoreFilter}
                sortBy={sortBy}
                sortDirection={sortDirection}
                setSortBy={setSortBy}
                setSortDirection={setSortDirection}
                startCreateDate={startCreateDate}
                endCreateDate={endCreateDate}
                setStartCreateDate={setStartCreateDate}
                setEndCreateDate={setEndCreateDate}
                startUpdateDate={startUpdateDate}
                endUpdateDate={endUpdateDate}
                setStartUpdateDate={setStartUpdateDate}
                setEndUpdateDate={setEndUpdateDate}
                minPrice={minPrice}
                maxPrice={maxPrice}
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
                minPriceDe={minPriceDe}
                maxPriceDe={maxPriceDe}
                setMinPriceDe={setMinPriceDe}
                setMaxPriceDe={setMaxPriceDe}
                searchText={searchText}
                setSearchText={setSearchText}
                searchTextInput={searchTextInput}
                setSearchTextInput={setSearchTextInput}
                onClearFilters={handleClearFilters}
              />

              {/* Tabs status orders */}
              {role && (
                <OrderTabs
                  role={role}
                  categories={categories}
                  selectedTab={selectedTab}
                  selectedCategory={selectedCategory}
                  onTabChange={(e, v) => {
                    handleTabChange(e, v);
                  }}
                  orderData={orderData}
                  checkedOrderIds={checkedOrderIds}
                  onToggleCheckAll={handleToggleCheckAll}
                  isAcceptableToAssign={isAcceptableToAssign}
                  openConfirmAssign={openConfirmAssign}
                  onCloseConfirmAssign={() => setOpenConfirmAssign(false)}
                  openConfirmAssignDialog={() => setOpenConfirmAssign(true)}
                  onConfirmAssign={() => {
                    const selectedUserIds = orderData
                      .filter((order) => checkedOrderIds.includes(order.id))
                      .map((order) => order.userid)
                      .filter((v, i, self) => v && self.indexOf(v) === i);
                    confirmAssignOrders(selectedUserIds);
                  }}
                  statusOptions={statusOptions}
                  onChangeStatusOrders={handleChangeStatusOrders}
                />
              )}

              {/* Order List */}
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <OrderList
                  orders={orderData}
                  selectedCategory={selectedCategory}
                  checkedOrderIds={checkedOrderIds}
                  handleClickOpenDetail={handleClickOpenDetail}
                  handleClickDeleteIcon={handleClickDeleteIcon}
                  handleToggleCheck={handleToggleCheck}
                  productTypeData={productTypeData}
                  handleAmountFormat={handleAmountFormat}
                  role={role}
                />
              )}
              {/* Card Detail */}
              <OrderDetailModal
                open={openDetailModal}
                order={selectedOrder}
                onClose={handleCloseDetailModal}
                handleAmountFormat={handleAmountFormat}
                userData={userData}
                role={role}
                productTypeData={productTypeData}
                buildQueryString={buildQuery}
                boardId={boardId}
                onStatusChanged={handleStatusChanged}
              />

              {/* Pagination Footer */}
              {!isLoading && role && (
                <OrderPagination
                  page={page}
                  totalPages={totalPages}
                  totalOrders={totalOrders}
                  limit={limit}
                  onChangePage={setPage}
                  onChangeLimit={handleSetLimitPerPage}
                />
              )}
            </Box>
          </Box>
          {openConfirm && (
            <>
              <Dialog open={openConfirm} onClose={handleCloseDialog}>
                <DialogTitle>{t(tokens.nav.confirm)}</DialogTitle>
                <DialogContent>
                  <Typography>{t(tokens.nav.message_delete)}</Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog} color="inherit">
                    {t(tokens.nav.cancel)}
                  </Button>
                  <Button onClick={handleConfirmDelete} color="error" variant="contained">
                    {t(tokens.nav.submit)}
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: '1.4rem',
            alignItems: 'center',
            minHeight: '80vh', // hoặc 100vh nếu bạn muốn chiếm full viewport
            textAlign: 'center',
            px: 2,
            color: 'text.secondary',
          }}
        >
          Vui lòng chọn bảng để sử dụng chức năng, nếu chưa có bảng hãy thử tạo tại thanh chức năng bên trái
        </Box>
      )}
    </PageLayout>
  );
};

export default React.memo(Page);
