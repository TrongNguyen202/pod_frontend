import {
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { Cascader } from 'src/components/custom-cascader';
import { QuillEditor } from 'src/components/quill-editor';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { fetchGetAttributeByCategory } from 'src/redux/reducers/categories';
import { buildNestedArraysMenu } from 'src/utils';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

export const ProductInfor = (props) => {
  const { control, errors, setValue, shopId } = props;
  const dispatch = useAppDispatch();
  const { productById } = useAppSelector((state) => state.products);
  const { brands } = useAppSelector((state) => state.shopsBrand);
  const { categoriesIsLeaf, attributes } = useAppSelector((state) => state.categories);
  const categoriesData = buildNestedArraysMenu(categoriesIsLeaf);

  useEffect(() => {
    if (productById?.create_time && shopId) {
      const categories = productById?.category_list;
      const categoryId = categories[categories.length - 1].id;

      dispatch(fetchGetAttributeByCategory(shopId, categoryId));
    }
  }, [productById]);

  const convertBrand = useMemo(() => {
    return brands?.brand_list?.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  }, [brands]);

  const optionsBranch = convertBrand && [
    {
      value: '',
      label: 'No brand',
    },
    ...convertBrand,
  ];

  const getAttributeByCategory = (categoryId) => {
    if (categoryId && shopId) {
      dispatch(fetchGetAttributeByCategory({ shopId, categoryId }));
    }
  };

  return (
    <Card className="p-6">
      <Typography
        sx={{
          fontSize: 24,
          fontWeight: 600,
        }}
      >
        Thêm sản phẩm mới
      </Typography>

      <Controller
        name="product_name"
        control={control}
        defaultValue=""
        rules={{ required: 'Tên sản phẩm không được để trống.' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Tên sản phẩm"
            fullWidth
            margin="normal"
            error={!!errors.product_name}
            helperText={errors.product_name ? errors.product_name.message : ''}
          />
        )}
      />
      <Controller
        name="category"
        control={control}
        rules={{
          validate: (value) =>
            value?.category && value?.subcategory && value?.subsubcategory
              ? true
              : 'Vui lòng chọn hết các mục trang danh mục sản phẩm.',
        }}
        render={({ field, formState }) => (
          <>
            <FormControl fullWidth margin="normal" error={!!errors.category}>
              <Cascader
                options={categoriesData}
                onChange={field.onChange}
                onSubSubcategoryChange={getAttributeByCategory}
                value={field.value}
              />
              {errors.category && <FormHelperText>{errors.category.message}</FormHelperText>}
            </FormControl>
          </>
        )}
      />
      <Controller
        name="brand_id"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <FormControl fullWidth margin="normal">
            <InputLabel variant="filled">Thương hiệu</InputLabel>
            <Select {...field} label="Thương hiệu" variant="filled">
              {optionsBranch?.map((user) => {
                return (
                  <MenuItem value={user?.value} key={user?.value}>
                    {user?.label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}
      />
      <Controller
        name="description"
        control={control}
        defaultValue=""
        rules={{
          required: 'Mô tả sản phẩm không được để trống',
        }}
        render={({ field }) => (
          <Box>
            <InputLabel className={`${errors.description ? '!text-[#F04438]' : ''}`} variant="outlined">
              Mô tả
            </InputLabel>
            <FormControl fullWidth margin="normal" error={!!errors.description}>
              <QuillEditor {...field} onChange={(value) => setValue('description', value)} />
              <FormHelperText>{errors.description ? errors.description.message : ''}</FormHelperText>
            </FormControl>
          </Box>
        )}
      />
      {attributes?.attributes?.length && (
        <Box className="mt-6">
          <Typography variant="h6" className="pb-3">
            Thuộc tính:
          </Typography>
          <Grid container spacing={2}>
            {attributes?.attributes?.map((item, index) => {
              return (
                <Grid item xs={12} md={4} key={item?.id}>
                  {item.input_type.is_multiple_selected ? (
                    <Controller
                      name={`product_attributes.${item.id}`}
                      control={control}
                      render={({ field }) => (
                        <>
                          <Autocomplete
                            {...field}
                            multiple
                            limitTags={2}
                            id={item?.id}
                            options={item?.values || []}
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => (
                              <TextField {...params} label={item?.name || ''} variant="filled" />
                            )}
                            onChange={(event, value) => field.onChange(value)}
                            className="w-1/3"
                            fullWidth
                            renderOption={(props, option, { selected }) => {
                              const { key, ...optionProps } = props;
                              return (
                                <Box key={key} {...optionProps} className="w-[240px] text-sm flex items-center my-1">
                                  <Checkbox
                                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                  />
                                  {option.id} | {option.name}
                                </Box>
                              );
                            }}
                          />
                        </>
                      )}
                    />
                  ) : (
                    <Controller
                      name={`product_attributes.${item.id}`}
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <FormControl className="!m-0" fullWidth margin="normal">
                          <InputLabel variant="filled">{item?.name || ''}</InputLabel>
                          <Select
                            {...field}
                            label={item?.name || ''}
                            variant="filled"
                            renderValue={(selected) => {
                              if (!selected) {
                                return <em>{item?.name || ''}</em>;
                              }
                              const selectedValue = item.values.find((user) => user.id === selected.id);
                              return selectedValue ? selectedValue.name : '';
                            }}
                            onChange={(event) => {
                              const selectedValue = item.values.find((user) => user.id === event.target.value);
                              field.onChange(selectedValue);
                            }}
                          >
                            {item.values?.map((user) => (
                              <MenuItem value={user?.id} key={user?.id}>
                                {user?.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  )}
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </Card>
  );
};
