import { useState, useCallback } from 'react';

export const useDialogHandlers = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDrawerBoardInfo, setOpenDrawerBoardInfo] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [openModalTemplate, setOpenModalTemplate] = useState(false);

  const handleToggleDrawer = useCallback(() => setOpenDrawer((prev) => !prev), []);
  const handleDrawerBoardInfo = useCallback((open) => setOpenDrawerBoardInfo(open), []);
  const handleChangePassword = useCallback((open) => setOpenChangePassword(open), []);
  const handleOpenModalTemplate = useCallback((open) => setOpenModalTemplate(open), []);

  return {
    openDrawer,
    openDrawerBoardInfo,
    openChangePassword,
    openModalTemplate,
    handleToggleDrawer,
    handleDrawerBoardInfo,
    handleChangePassword,
    handleOpenModalTemplate,
  };
};
