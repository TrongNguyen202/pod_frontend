import {
  Box,
  Drawer,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const mapNameFilter = {
  price: 'Giá',
  price_: 'Giá',
  created_date: 'Ngày tạo',
  last_modified_date: 'Ngày cập nhật',
};

const OrderFilterDrawer = ({
  open,
  onClose,
  role,
  sortBy,
  sortDirection,
  setSortBy,
  setSortDirection,
  startCreateDate,
  endCreateDate,
  setStartCreateDate,
  setEndCreateDate,
  startUpdateDate,
  endUpdateDate,
  setStartUpdateDate,
  setEndUpdateDate,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  minPriceDe,
  maxPriceDe,
  setMinPriceDe,
  setMaxPriceDe,
  onClear,
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        zIndex: 13009,
        '& .MuiDrawer-paper': {
          width: 432,
          backgroundColor: '#fafafa',
          boxShadow: 6,
        },
      }}
    >
      <Box sx={{ width: 432, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Bộ lọc nâng cao
          </Typography>
          <Button variant="outlined" color="secondary" onClick={onClear} sx={{ borderRadius: 2 }}>
            Xóa bộ lọc
          </Button>
        </Box>

        {/* Ngày tạo */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight="medium">
            Ngày tạo
          </Typography>
          <ToggleButtonGroup
            value={sortBy === 'created_date' ? sortDirection : ''}
            exclusive
            onChange={(e, val) => {
              if (val) {
                setSortBy('created_date');
                setSortDirection(val);
              }
            }}
            sx={{ mt: 1 }}
            fullWidth
          >
            <ToggleButton value="asc">Tăng dần</ToggleButton>
            <ToggleButton value="desc">Giảm dần</ToggleButton>
          </ToggleButtonGroup>

          {/* Bộ lọc ngày tạo */}
          <DatePicker
            label="Từ ngày"
            value={startCreateDate}
            onChange={(val) => setStartCreateDate(val)}
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: 'zIndex',
                    enabled: true,
                    phase: 'write',
                    fn({ state }) {
                      state.styles.popper.zIndex = '130009';
                    },
                  },
                ],
              },
            }}
            sx={{ mt: 1, width: '100%' }}
          />
          <DatePicker
            label="Đến ngày"
            value={endCreateDate}
            onChange={(val) => setEndCreateDate(val)}
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: 'zIndex',
                    enabled: true,
                    phase: 'write',
                    fn({ state }) {
                      state.styles.popper.zIndex = '130009';
                    },
                  },
                ],
              },
            }}
            sx={{ mt: 2, width: '100%' }}
          />
        </Box>

        {/* Ngày cập nhật */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2">Ngày cập nhật</Typography>
          <ToggleButtonGroup
            value={sortBy === 'last_modified_date' ? sortDirection : ''}
            exclusive
            onChange={(e, val) => {
              if (val) {
                setSortBy('last_modified_date');
                setSortDirection(val);
              }
            }}
            sx={{ mt: 1 }}
            fullWidth
          >
            <ToggleButton value="asc">Tăng dần</ToggleButton>
            <ToggleButton value="desc">Giảm dần</ToggleButton>
          </ToggleButtonGroup>

          {/* Bộ lọc ngày cập nhật */}
          <DatePicker
            label="Từ ngày"
            value={startUpdateDate}
            onChange={(val) => setStartUpdateDate(val)}
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: 'zIndex',
                    enabled: true,
                    phase: 'write',
                    fn({ state }) {
                      state.styles.popper.zIndex = '130009';
                    },
                  },
                ],
              },
            }}
            sx={{ mt: 1, width: '100%' }}
          />
          <DatePicker
            label="Đến ngày"
            value={endUpdateDate}
            onChange={(val) => setEndUpdateDate(val)}
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: 'zIndex',
                    enabled: true,
                    phase: 'write',
                    fn({ state }) {
                      state.styles.popper.zIndex = '130009';
                    },
                  },
                ],
              },
            }}
            sx={{ mt: 2, width: '100%' }}
          />
        </Box>

        {/* Giá (theo role) */}
        {role === 'customer' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2">Giá</Typography>
            <ToggleButtonGroup
              value={sortBy === 'price' ? sortDirection : ''}
              exclusive
              onChange={(e, val) => {
                if (val) {
                  setSortBy('price');
                  setSortDirection(val);
                }
              }}
              sx={{ mt: 1 }}
              fullWidth
            >
              <ToggleButton value="asc">Tăng dần</ToggleButton>
              <ToggleButton value="desc">Giảm dần</ToggleButton>
            </ToggleButtonGroup>

            <TextField
              label="Giá từ"
              type="number"
              value={minPrice || ''}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              sx={{ mt: 1, width: '100%' }}
            />
            <TextField
              label="Giá đến"
              type="number"
              value={maxPrice || ''}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              sx={{ mt: 2, width: '100%' }}
            />
          </Box>
        )}

        {role === 'designer' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2">Giá nhận</Typography>
            <ToggleButtonGroup
              value={sortBy === 'price_' ? sortDirection : ''}
              exclusive
              onChange={(e, val) => {
                if (val) {
                  setSortBy('price_');
                  setSortDirection(val);
                }
              }}
              sx={{ mt: 1 }}
              fullWidth
            >
              <ToggleButton value="asc">Tăng dần</ToggleButton>
              <ToggleButton value="desc">Giảm dần</ToggleButton>
            </ToggleButtonGroup>

            <TextField
              label="Giá nhận từ"
              type="number"
              value={minPriceDe || ''}
              onChange={(e) => setMinPriceDe(Number(e.target.value))}
              sx={{ mt: 1, width: '100%' }}
            />
            <TextField
              label="Giá nhận đến"
              type="number"
              value={maxPriceDe || ''}
              onChange={(e) => setMaxPriceDe(Number(e.target.value))}
              sx={{ mt: 2, width: '100%' }}
            />
          </Box>
        )}
      </Box>
      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', ml: 3, gap: 1 }}>
        <Typography variant="subtitle2">Sắp xếp theo: </Typography>
        {sortBy && (
          <Chip label={`${mapNameFilter[sortBy ? sortBy : 'created_date']} ${sortDirection === 'asc' ? '↑' : '↓'}`} />
        )}
        {minPrice && <Chip label={`Giá từ: ${minPrice.toLocaleString()}`} sx={{ mr: 1 }} />}
        {maxPrice && <Chip label={`Giá đến: ${maxPrice.toLocaleString()}`} sx={{ mr: 1 }} />}
        {startCreateDate && <Chip label={`Tạo từ: ${dayjs(startCreateDate).format('DD/MM/YYYY')}`} sx={{ mr: 1 }} />}
        {endCreateDate && <Chip label={`Tạo đến: ${dayjs(endCreateDate).format('DD/MM/YYYY')}`} sx={{ mr: 1 }} />}
        {startUpdateDate && (
          <Chip label={`Cập nhật từ: ${dayjs(startUpdateDate).format('DD/MM/YYYY')}`} sx={{ mr: 1 }} />
        )}
        {endUpdateDate && <Chip label={`Cập nhật đến: ${dayjs(endUpdateDate).format('DD/MM/YYYY')}`} sx={{ mr: 1 }} />}
      </Box>
    </Drawer>
  );
};

export default OrderFilterDrawer;
