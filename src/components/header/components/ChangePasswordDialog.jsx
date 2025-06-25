import React, { memo } from 'react';
import FormDialog from 'src/components/popup';

const ChangePasswordDialog = ({ open, onClose, onSubmit, t, email }) => (
  <FormDialog
    buttonLabel=""
    title={t('Đặt lại mật khẩu')}
    fields={[
      { name: 'oldPassword', label: 'Mật khẩu cũ', type: 'password', required: true },
      { name: 'newPassword', label: 'Mật khẩu mới', type: 'password', required: true },
      { name: 'confirmPassword', label: 'Xác nhận mật khẩu', type: 'password', required: true },
    ]}
    initialData={{ oldPassword: '', newPassword: '', confirmPassword: '' }}
    onSubmit={(data) => onSubmit(data, email)}
    buttonProps={{ style: { display: 'none' } }}
    openOverride={open}
    onCloseOverride={onClose}
  />
);

export default memo(ChangePasswordDialog);
