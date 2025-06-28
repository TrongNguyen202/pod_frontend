import React from 'react';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { Select } from 'antd';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';

const OrderPagination = ({
  page,
  totalPages,
  totalOrders,
  limit,
  onChangePage,
  onChangeLimit,
}) => {
  const { t } = useTranslation();

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalOrders);

  return (
    <Paper variant="outlined" sx={{ mt: 2, p: 2, pr: 8 }}>
      <Grid container spacing={2} justifyContent="flex-end" alignItems="center">
        <Grid item>
          <Typography>
            {startItem} - {endItem} {t(tokens.nav.of)} {totalOrders} {t(tokens.nav.records)}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            size="small"
            disabled={page === 1}
            onClick={() => onChangePage(page - 1)}
          >
            &lt;
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            size="small"
            disabled={page >= totalPages}
            onClick={() => onChangePage(page + 1)}
          >
            &gt;
          </Button>
        </Grid>
        <Grid item>
          <Select
            options={[
              { value: 20, label: <span>20</span> },
              { value: 30, label: <span>30</span> },
              { value: 50, label: <span>50</span> },
            ]}
            onChange={onChangeLimit}
            defaultValue={limit}
            placeholder={limit}
            style={{ width: 80 }}
          />
        </Grid>
        <Grid item>
          <Typography>
            {t(tokens.nav.page)} {page} {t(tokens.nav.of)} {totalPages}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default OrderPagination;
