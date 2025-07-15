import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch } from 'src/redux/hook';

import { fetchSendPushNotifications } from 'src/redux/reducers/notifications';
import {
  changeStatusOrders,
  fetchAssignOrdersForDesigner,
  fetchGetAllStatus,
  fetchGetOrdersByBoardId,
  fetchResetOrderToNew,
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

  // Helper function để gửi thông báo một cách an toàn
  const sendNotificationSafely = useCallback(
    async (notificationData) => {
      try {
        await dispatch(fetchSendPushNotifications(notificationData));
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    },
    [dispatch],
  );

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

        if (status === 'NEW' && userData.coin < formData.get('price')) {
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
          price: Number(formData.get('price') || 27000),
          // completedAt: formData.get('completed_at'),
        };

        const response = await dispatch(postOrder({ data: finalPayload }));

        if (response.payload?.status === 200) {
          // Cập nhật data trước
          await dispatch(fetchGetOrdersByBoardId({ query: buildQuery() }));
          await dispatch(fetchUserByEmail({ email: userData?.email }));
          await fetchAllStatuses();

          // Chỉ gửi thông báo khi status = 'NEW' và sau khi tạo thành công
          if (status === 'NEW') {
            // Gửi thông báo cho designer và customer song song
            await Promise.all([
              sendNotificationSafely({
                designerIds: desginerIds,
                title: 'Có đơn hàng mới',
                message: 'Có đơn hàng mới được lên sàn, vào nhận ngay!',
              }),
              sendNotificationSafely({
                customerIds: userData?.id ? [userData.id] : [],
                title: 'Lên đơn hàng',
                message: `Đơn hàng ${formData.get('title')} của bạn đã được lên sàn, chờ nhà thiết kế làm việc!`,
              }),
            ]);
          }

          toast.success('Tạo order thành công!');
        } else {
          toast.error('Tạo order thất bại!');
        }
      } catch (error) {
        console.error('Error creating order:', error);
        toast.error('Có lỗi khi tạo đơn hàng');
      }
    },
    [
      boardId,
      role,
      userData,
      desginerIds,
      buildQuery,
      dispatch,
      fetchAllStatuses,
      requiredFields,
      sendNotificationSafely,
    ],
  );

  const handleConfirmDelete = useCallback(async (selectedOrder) => {
      if (selectedId !== null) {
        if (isCustomer) {
          const response = await dispatch(requestDeleteOrders({ ids: [Number(selectedId)] }));

          if (response.payload?.status === 200) {
            await dispatch(fetchGetOrdersByBoardId({ query: buildQuery() }));
            await fetchAllStatuses();
            toast.success('Xóa đơn thành công!');
          } else {
            toast.error('Xóa đơn thất bại!');
          }
        } else if (isDesigner) {
          const response = await dispatch(fetchResetOrderToNew({ data: { orderIds: [Number(selectedOrder?.id)] } }));
          if (response?.meta?.requestStatus === 'fulfilled') {
            await dispatch(fetchGetOrdersByBoardId({ query: buildQuery() }));
            await fetchAllStatuses();
            (sendNotificationSafely({
              customerIds: selectedOrder?.userid ? [selectedOrder.userid] : [],
              title: 'Trạng thái đơn hàng',
              message: `Đơn hàng của bạn vừa được cập nhật trạng thái, xem ngay!`,
            }),
              toast.success('Hủy nhận đơn thành công!'));
          } else {
            toast.error('Hủy nhận đơn thất bại!');
          }
        }
        setOpenConfirm(false);
      }
  }, [selectedId, dispatch, buildQuery, fetchAllStatuses, setOpenConfirm]);

  const confirmAssignOrders = useCallback(
    async (userIds) => {
      try {
        const response = await dispatch(
          fetchAssignOrdersForDesigner({
            data: { orderIds: checkedOrderIds },
          }),
        );

        // Chỉ gửi thông báo khi assign thành công
        if (response.meta.requestStatus === 'fulfilled') {
          // Gửi thông báo cho customer sau khi assign thành công
          await sendNotificationSafely({
            customerIds: userIds || [],
            title: 'Trạng thái đơn hàng',
            message: 'Có đơn hàng của bạn vừa được nhà thiết kế nhận, vào xem ngay!',
          });

          toast.success('Nhận đơn thành công!');
          resetChecked([]);
          await dispatch(fetchGetOrdersByBoardId({ query: buildQuery() }));
          await fetchAllStatuses();
        } else {
          toast.error(response.message || 'Nhận đơn thất bại');
        }
      } catch (err) {
        console.error('Error assigning orders:', err);
        toast.error('Đã có lỗi xảy ra khi nhận đơn');
      }
    },
    [dispatch, buildQuery, checkedOrderIds, fetchAllStatuses, resetChecked, sendNotificationSafely],
  );

  const handleChangeStatusOrders = useCallback(
    async (data, orderIds) => {
      if (!data || !orderIds) return;

      try {
        data.ids = orderIds;
        const response = await dispatch(changeStatusOrders({ data }));
        const { status, message } = response.payload || {};

        if (status === 200) {
          // Cập nhật data trước
          await dispatch(fetchGetOrdersByBoardId({ query: buildQuery() }));
          resetChecked([]);

          // Chỉ gửi thông báo khi cần thiết và sau khi cập nhật thành công
          if (isCustomer && data.status === 'NEW') {
            await dispatch(fetchUserByEmail({ email: userData?.email }));

            // Gửi thông báo cho designer
            await sendNotificationSafely({
              designerIds: desginerIds,
              title: 'Có đơn hàng mới',
              message: 'Có đơn hàng mới được lên sàn, vào nhận ngay!',
            });
          }

          await fetchAllStatuses();
          toast.success('Chuyển trạng thái thành công!');
        } else {
          toast.error(message || 'Lỗi khi chuyển trạng thái đơn hàng');
        }
      } catch (error) {
        console.error('Error changing order status:', error);
        toast.error('Có lỗi khi chuyển trạng thái đơn hàng');
      }
    },
    [dispatch, buildQuery, fetchAllStatuses, isCustomer, userData, desginerIds, resetChecked, sendNotificationSafely],
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
