import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAppSelector } from 'src/redux/hook';
import { useEffect, useState } from 'react';

export const EcommerceStats = () => {
  const { finance } = useAppSelector((state) => state.statistics);
  const [data, setData] = useState({
    firstDay: '',
    lastDay: '',
    revenue_amount: 0,
    settlement_amount: 0,
    fee_amount: 0,
    adjustment_amount: 0,
  });

  useEffect(() => {
    if (finance?.data?.length) {
      const sorted = [...(finance?.data || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
      if (sorted.length) {
        const [revenue_amount, settlement_amount, fee_amount, adjustment_amount] = sorted.reduce(
          (acc, item) => {
            acc[0] += item?.statements?.status?.TOTAL?.revenue_amount || 0;
            acc[1] += item?.statements?.status?.TOTAL?.settlement_amount || 0;
            acc[2] += item?.statements?.status?.TOTAL?.fee_amount || 0;
            acc[3] += item?.statements?.status?.TOTAL?.adjustment_amount || 0;
            return acc;
          },
          [0, 0, 0, 0],
        );
        const firstDay = sorted[sorted.length - 1];
        const lastDay = sorted[0];
        const newData = {
          firstDay: firstDay?.date,
          lastDay: lastDay?.date,
          revenue_amount: revenue_amount.toFixed(2),
          settlement_amount: settlement_amount.toFixed(2),
          fee_amount: fee_amount.toFixed(2),
          adjustment_amount: adjustment_amount.toFixed(2),
        };
        setData(newData);
      }
    }
  }, [finance]);

  return (
    <Card>
      <CardHeader title={`Chỉ số từ ngày ${data.firstDay} đến ngày ${data.lastDay}`} sx={{ pb: 0, pt: 2 }} />
      <CardContent className="!p-4">
        <Grid container spacing={3}>
          <Grid xs={12} md={3}>
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
              sx={{
                backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.800' : 'info.lightest'),
                borderRadius: 2.5,
                p: 2,
              }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  height: 40,
                  width: 40,
                  '& img': {
                    width: '100%',
                  },
                }}
              >
                <img src="/assets/iconly/iconly-glass-chart.svg" />
              </Box>
              <div>
                <Typography color="text.secondary" variant="body2">
                  Doanh thu
                </Typography>
                <Typography variant="h5">{data.revenue_amount}$</Typography>
              </div>
            </Stack>
          </Grid>

          <Grid xs={12} md={3}>
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
              sx={{
                backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.800' : 'error.lightest'),
                borderRadius: 2.5,
                p: 2,
              }}
              className="h-full"
            >
              <Box
                sx={{
                  flexShrink: 0,
                  height: 40,
                  width: 40,
                  '& img': {
                    width: '100%',
                  },
                }}
              >
                <img src="/assets/iconly/iconly-glass-discount.svg" />
              </Box>
              <div>
                <Typography color="text.secondary" variant="body2">
                  Phí
                </Typography>
                <Typography variant="h5">{data.fee_amount}$</Typography>
              </div>
            </Stack>
          </Grid>
          <Grid xs={12} md={3}>
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
              sx={{
                backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.800' : 'warning.lightest'),
                borderRadius: 2.5,
                p: 2,
              }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  height: 40,
                  width: 40,
                  '& img': {
                    width: '100%',
                  },
                }}
              >
                <img src="/assets/iconly/iconly-glass-volume.svg" />
              </Box>
              <div>
                <Typography color="text.secondary" variant="body2">
                  Phí điều chỉnh
                </Typography>
                <Typography variant="h5">{data.adjustment_amount}$</Typography>
              </div>
            </Stack>
          </Grid>
          <Grid xs={12} md={3}>
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
              sx={{
                backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.800' : 'success.lightest'),
                borderRadius: 2.5,
                p: 2,
              }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  height: 40,
                  width: 40,
                  '& img': {
                    width: '100%',
                  },
                }}
              >
                <img src="/assets/iconly/iconly-glass-tick.svg" />
              </Box>
              <div>
                <Typography color="text.secondary" variant="body2">
                  Thực nhận
                </Typography>
                <Typography variant="h5">{data.settlement_amount}$</Typography>
              </div>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

EcommerceStats.propTypes = {
  cost: PropTypes.number.isRequired,
  profit: PropTypes.number.isRequired,
  sales: PropTypes.number.isRequired,
};
