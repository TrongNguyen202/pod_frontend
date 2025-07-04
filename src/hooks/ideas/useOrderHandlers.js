import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch } from 'src/redux/hook';

import { fetchSendPushNotifications } from 'src/redux/reducers/notifications';
import {
  changeStatusOrders,
  fetchAssignOrdersForDesigner,
  fetchGetAllStatus,
  fetchGetOrdersByBoardId,
  postOrder,
  requestDeleteOrders,
} from 'src/redux/reducers/orders';
import { fetchUserByEmail } from 'src/redux/reducers/user';
import { uploadImagesConcurrently } from 'src/utils/axiosUploadImages';
import isFormValid from 'src/utils/ideas/isFormValid';

const useOrderHandlers = ({
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
}) => {
  const dispatch = useAppDispatch();

  const fetchAllStatuses = useCallback(async () => {
    if (isDesigner) {
      await dispatch(fetchGetAllStatus(''));
    } else if (isCustomer && boardId) {
      await dispatch(fetchGetAllStatus(`boardId=${boardId}`));
    }
  }, [boardId, role, dispatch]);

  const handleSubmitIdeas = useCallback(
    async (formData, status) => {
      try {
        const hasImages = formData.getAll('images[]')?.length > 0;
        if (!isFormValid(formData, requiredFields) || !hasImages) {
          toast.error('Vui lòng điền đầy đủ thông tin');
          return;
        }
        if (!boardId) {
          toast.error('Bảng không phù hợp, vui lòng chọn lại!');
          return;
        }

        const imageFiles = formData.getAll('images[]');
        const imageUrls = await uploadImagesConcurrently(imageFiles);

        if (imageUrls.length === 0) {
          toast.error('Không có ảnh nào được upload!');
          return;
        }
        console.log(userData.coin);
        if (userData.coin < formData.get('price')) {
          toast.error('Số dư không đủ, vui lòng nạp thêm để sử dụng dịch vụ');
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
          price: Number(formData.get('price') || 35000),
          // completedAt: formData.get('completed_at'),
        };

        const response = await dispatch(postOrder({ data: finalPayload }));
        if (response.payload?.status === 200) {
          await dispatch(fetchGetOrdersByBoardId({ query: buildQuery() }));
          await dispatch(fetchUserByEmail({ email: userData?.email }));
          await fetchAllStatuses();

          if (status === 'NEW') {
            await dispatch(
              fetchSendPushNotifications({
                designerIds: desginerIds,
                title: 'Có đơn hàng mới',
                message: 'Có đơn hàng mới được lên sàn, vào nhận ngay!',
              }),
            );
            await dispatch(
              fetchSendPushNotifications({
                customerIds: userData?.id ? [userData.id] : [],
                title: 'Lên đơn hàng ',
                message: `Đơn hàng ${formData.get('title')} của bạn đã được lên sàn, chờ nhà thiết kế làm việc!`,
              }),
            );
          }

          toast.success('Tạo order thành công!');
        } else {
          toast.error('Tạo order thất bại!');
        }
      } catch (error) {
        toast.error('Có lỗi khi tạo đơn hàng');
      }
    },
    [boardId, role, userData, desginerIds, buildQuery, dispatch, fetchAllStatuses, requiredFields],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (selectedId !== null) {
      const response = await dispatch(requestDeleteOrders({ ids: [Number(selectedId)] }));

      if (response.payload?.status === 200) {
        await dispatch(fetchGetOrdersByBoardId({ query: buildQuery() }));
        await fetchAllStatuses();
        toast.success('Xóa đơn thành công!');
      } else {
        toast.error('Xóa đơn thất bại!');
      }
      setOpenConfirm(false);
    }
  }, [selectedId, dispatch, buildQuery, fetchAllStatuses, setOpenConfirm]);

  const confirmAssignOrders = useCallback(
    async (userIds) => {
      try {
        await dispatch(
          fetchSendPushNotifications({
            customerIds: userIds || [],
            title: 'Trạng thái đơn hàng',
            message: 'Có đơn hàng của bạn thay đổi trạng thái, vào xem ngay!',
          }),
        );
        const response = await dispatch(
          fetchAssignOrdersForDesigner({
            data: { orderIds: checkedOrderIds },
          }),
        );

        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('Nhận đơn thành công!');
          resetChecked([]);
          await dispatch(fetchGetOrdersByBoardId({ query: buildQuery() }));
          await fetchAllStatuses();
        } else {
          toast.error(response.message || 'Nhận đơn thất bại');
        }
      } catch (err) {
        toast.error('Đã có lỗi xảy ra khi nhận đơn');
      }
    },
    [dispatch, buildQuery, checkedOrderIds, fetchAllStatuses, resetChecked],
  );

  const handleChangeStatusOrders = useCallback(
    async (data, orderIds) => {
      if (!data || !orderIds) return;

      data.ids = orderIds;
      const response = await dispatch(changeStatusOrders({ data }));
      const { status, message } = response.payload || {};

      if (status === 200) {
        await dispatch(fetchGetOrdersByBoardId({ query: buildQuery() }));
        resetChecked([]);

        if (isCustomer && data.status === 'NEW') {
          await dispatch(fetchUserByEmail({ email: userData?.email }));
          await dispatch(
            fetchSendPushNotifications({
              designerIds: desginerIds,
              title: 'Có đơn hàng mới',
              message: 'Có đơn hàng mới được lên sàn, vào nhận ngay!',
            }),
          );
        }

        await fetchAllStatuses();
        toast.success('Chuyển trạng thái thành công!');
      } else {
        toast.error(message || 'Lỗi khi chuyển trạng thái đơn hàng');
      }
    },
    [dispatch, buildQuery, fetchAllStatuses, isCustomer, userData, desginerIds, resetChecked],
  );

  return {
    handleSubmitIdeas,
    handleConfirmDelete,
    confirmAssignOrders,
    handleChangeStatusOrders,
    fetchAllStatuses,
  };
};

export default useOrderHandlers;
