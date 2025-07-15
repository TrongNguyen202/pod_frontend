import React, { memo } from 'react';
import FormDialog from 'src/components/popup';
import { tokens } from 'src/locales/tokens';

const ChangePasswordDialog = ({ open, onClose, onSubmit, t, email }) => (
  <FormDialog
    buttonLabel=""
    title={t(tokens.nav.resetPassword)}
    fields={[
      { name: 'oldPassword', label: t(tokens.nav.password), type: 'password', required: true },
      { name: 'newPassword', label: t(tokens.nav.newPassword), type: 'password', required: true },
      { name: 'confirmPassword', label: t(tokens.nav.confirmPassword), type: 'password', required: true },
    ]}
    initialData={{ oldPassword: '', newPassword: '', confirmPassword: '' }}
    onSubmit={(data) => onSubmit(data, email)}
    buttonProps={{ style: { display: 'none' } }}
    openOverride={open}
    onCloseOverride={onClose}
  />
);

export default memo(ChangePasswordDialog);
