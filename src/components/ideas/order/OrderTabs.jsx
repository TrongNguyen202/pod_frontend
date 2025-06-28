import React from 'react';
import {
  Box,
  Tab,
  Tabs,
  Card,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { categoryColors } from 'src/constants';
import FormDialog from 'src/components/popup';
import { useTranslation } from 'react-i18next';
import { tokens } from 'src/locales/tokens';

const OrderTabs = ({
  role,
  categories,
  selectedTab,
  selectedCategory,
  onTabChange,
  orderData,
  checkedOrderIds,
  onToggleCheckAll,
  isAcceptableToAssign,
  openConfirmAssign,
  onCloseConfirmAssign,
  openConfirmAssignDialog,
  onConfirmAssign,
  statusOptions,
  onChangeStatusOrders,
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Tabs value={selectedTab} onChange={onTabChange} sx={{ mt: 2 }} variant="scrollable" scrollButtons="auto">
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
              },
            }}
          />
        ))}
      </Tabs>

      {(selectedCategory === 'NEW' || selectedCategory === 'DRAFT') && (
        <Card variant="outlined" sx={{ display: 'flex', alignItems: 'center', border: 0 }}>
          <Checkbox
            sx={{ mr: 2 }}
            checked={orderData.length > 0 && orderData.every((item) => checkedOrderIds.includes(item.id))}
            indeterminate={
              orderData.some((item) => checkedOrderIds.includes(item.id)) &&
              !orderData.every((item) => checkedOrderIds.includes(item.id))
            }
            onChange={onToggleCheckAll}
          />

          <Card variant="outlined" sx={{ pl: 2, borderRadius: 2 }}>
            {checkedOrderIds.length} {t(tokens.nav.selected)}
            {isAcceptableToAssign ? (
              <>
                <Button
                  onClick={openConfirmAssignDialog}
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, ml: 2 }}
                >
                  {t(tokens.nav.receiveOrder)}
                </Button>

                <Dialog open={openConfirmAssign} onClose={onCloseConfirmAssign}>
                  <DialogTitle>{t(tokens.nav.confirmAssign)}</DialogTitle>
                  <DialogContent>
                    <DialogContentText>Bạn có chắc chắn muốn nhận {checkedOrderIds.length} đơn hàng?</DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={onCloseConfirmAssign} color="inherit">
                      {t(tokens.nav.cancel)}
                    </Button>
                    <Button onClick={onConfirmAssign} color="primary" variant="contained">
                      {t(tokens.nav.submit)}
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
                onSubmit={(data) => onChangeStatusOrders(data, checkedOrderIds)}
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
      )}
    </Box>
  );
};

export default OrderTabs;
