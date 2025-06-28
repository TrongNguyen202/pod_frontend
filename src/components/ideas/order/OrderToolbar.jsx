import React from 'react';
import { Box, Button, Card, CardContent, Grid, TextField } from '@mui/material';
import FormDialogSplitLayout from 'src/components/form-split';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';
import OrderFilterDrawer from 'src/components/filter-layout';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

const OrderToolbar = ({
  role,
  boardId,
  productTypeData,
  templatesData,
  fieldIdeas,
  onSubmitIdea,
  initialData,
  onMoreFilter,
  openDrawerFilter,
  onCloseDrawerFilter,
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
  searchText,
  setSearchText,
  searchTextInput,
  setSearchTextInput,
  onClearFilters,
}) => {
  const { t } = useTranslation();
  const isCustomer = role === 'customer';

  return (
    <Card>
      <CardContent>
        <Grid
          xs={12}
          sm={6}
          md={3}
          size={12}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 0 }}
        >
          {isCustomer && (
            <Grid width={'15%'} size={4} padding={0} display={'flex'}>
              <FormDialogSplitLayout
                title={t(tokens.nav.createNewIdea)}
                fields={fieldIdeas}
                onSubmit={onSubmitIdea}
                buttonLabel={t(tokens.nav.addnew)}
                initialData={initialData}
                productTypeData={productTypeData}
                templatesData={templatesData}
                buttonProps={{
                  variant: 'contained',
                  disabled: !boardId,
                }}
              />
            </Grid>
          )}

          <Grid
            size={isCustomer ? 8 : 12}
            position="static"
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              width: isCustomer ? '85%' : '100%',
              backgroundColor: '#fff',
            }}
          >
            <TextField
              value={searchTextInput}
              onChange={(e) => setSearchTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setSearchText(searchTextInput);
                }
              }}
              placeholder={t(tokens.nav.search)}
              variant="outlined"
              InputProps={{
                style: { color: '#000' },
                endAdornment: (
                  <InputAdornment position="end">
                    <Button onClick={() => setSearchText(searchTextInput)}>
                      <SearchIcon sx={{ color: '#666' }} />
                    </Button>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiInputBase-input::placeholder': {
                  color: '#000',
                  opacity: 1,
                },
                marginRight: 2,
                padding: 0,
                flexGrow: 1,
              }}
            />

            <Button variant="contained" onClick={onMoreFilter}>
              {t(tokens.nav.more_filter)}
            </Button>

            <OrderFilterDrawer
              open={openDrawerFilter}
              onClose={onCloseDrawerFilter}
              role={role}
              sortBy={sortBy}
              sortDirection={sortDirection}
              setSortBy={setSortBy}
              setSortDirection={setSortDirection}
              startCreateDate={startCreateDate}
              endCreateDate={endCreateDate}
              setStartCreateDate={setStartCreateDate}
              setEndCreateDate={setEndCreateDate}
              startUpdateDate={startUpdateDate}
              endUpdateDate={endUpdateDate}
              setStartUpdateDate={setStartUpdateDate}
              setEndUpdateDate={setEndUpdateDate}
              minPrice={minPrice}
              maxPrice={maxPrice}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              minPriceDe={minPriceDe}
              maxPriceDe={maxPriceDe}
              setMinPriceDe={setMinPriceDe}
              setMaxPriceDe={setMaxPriceDe}
              onClear={onClearFilters}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default OrderToolbar;
