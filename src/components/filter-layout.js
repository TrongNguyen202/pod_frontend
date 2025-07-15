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
import { useTranslation } from 'react-i18next';
import { tokens } from 'src/locales/tokens';

const mapNameFilterVi = {
  price: 'Giá',
  price_: 'Giá',
  created_date: 'Ngày tạo',
  last_modified_date: 'Ngày cập nhật',
};

const mapNameFilterEn = {
  price: 'Price',
  price_: 'Price',
  created_date: 'Created Date',
  last_modified_date: 'Last Updated Date',
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
  const { t, i18n } = useTranslation();
  const language = i18n.language;
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
            {t(tokens.nav.advancedFilter)}
          </Typography>
          <Button variant="outlined" color="secondary" onClick={onClear} sx={{ borderRadius: 2 }}>
            {t(tokens.nav.clearFilter)}
          </Button>
        </Box>

        {/* Ngày tạo */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight="medium">
            {t(tokens.nav.createdDate)}
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
            <ToggleButton value="asc">{t(tokens.nav.increase)}</ToggleButton>
            <ToggleButton value="desc">{t(tokens.nav.descending)}</ToggleButton>
          </ToggleButtonGroup>

          {/* Bộ lọc ngày tạo */}
          <DatePicker
            label={t(tokens.nav.from)}
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
            label={t(tokens.nav.to)}
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
          <Typography variant="subtitle2">{t(tokens.nav.lastUpdate)}</Typography>
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
            <ToggleButton value="asc">{t(tokens.nav.increase)}</ToggleButton>
            <ToggleButton value="desc">{t(tokens.nav.descending)}</ToggleButton>
          </ToggleButtonGroup>

          {/* Bộ lọc ngày cập nhật */}
          <DatePicker
            label={t(tokens.nav.from)}
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
            label={t(tokens.nav.to)}
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
            <Typography variant="subtitle2">{t(tokens.nav.price)}</Typography>
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
              <ToggleButton value="asc">{t(tokens.nav.increase)}</ToggleButton>
              <ToggleButton value="desc">{t(tokens.nav.descending)}</ToggleButton>
            </ToggleButtonGroup>

            <TextField
              label={t(tokens.nav.from)}
              type="number"
              value={minPrice || ''}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              sx={{ mt: 1, width: '100%' }}
            />
            <TextField
              label={t(tokens.nav.to)}
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
              label={t(tokens.nav.from)}
              type="number"
              value={minPriceDe || ''}
              onChange={(e) => setMinPriceDe(Number(e.target.value))}
              sx={{ mt: 1, width: '100%' }}
            />
            <TextField
              label={t(tokens.nav.to)}
              type="number"
              value={maxPriceDe || ''}
              onChange={(e) => setMaxPriceDe(Number(e.target.value))}
              sx={{ mt: 2, width: '100%' }}
            />
          </Box>
        )}
      </Box>
      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', ml: 3, gap: 1 }}>
        <Typography variant="subtitle2">{t(tokens.nav.sortBy)}: </Typography>
        {sortBy && (
          <Chip
            label={`${language === 'vi' ? mapNameFilterVi[sortBy ? sortBy : 'created_date'] : mapNameFilterEn[sortBy ? sortBy : 'created_date']} ${sortDirection === 'asc' ? '↑' : '↓'}`}
          />
        )}
        {minPrice && <Chip label={`${t(tokens.nav.from)}: ${minPrice.toLocaleString()}`} sx={{ mr: 1 }} />}
        {maxPrice && <Chip label={`${t(tokens.nav.to)}: ${maxPrice.toLocaleString()}`} sx={{ mr: 1 }} />}
        {startCreateDate && (
          <Chip label={`${t(tokens.nav.from)}: ${dayjs(startCreateDate).format('DD/MM/YYYY')}`} sx={{ mr: 1 }} />
        )}
        {endCreateDate && (
          <Chip label={`${t(tokens.nav.to)}: ${dayjs(endCreateDate).format('DD/MM/YYYY')}`} sx={{ mr: 1 }} />
        )}
        {startUpdateDate && (
          <Chip label={`${t(tokens.nav.from)}: ${dayjs(startUpdateDate).format('DD/MM/YYYY')}`} sx={{ mr: 1 }} />
        )}
        {endUpdateDate && (
          <Chip label={`${t(tokens.nav.to)}: ${dayjs(endUpdateDate).format('DD/MM/YYYY')}`} sx={{ mr: 1 }} />
        )}
      </Box>
    </Drawer>
  );
};

export default OrderFilterDrawer;
