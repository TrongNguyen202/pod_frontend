import { Autocomplete, Box, Button, Card, Checkbox, TextField } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAppSelector } from 'src/redux/hook';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { ModalAddAtribu } from './modals/modal-add-atribu';
import { EditOutlined } from '@mui/icons-material';
import { flatMapArray } from 'src/utils';
import { ModalEditPrice } from './modals/modal-edit-price';
import { variationsOption } from 'src/constants';

export const ProductCreateAddVariationForm = (props) => {
  const { setValueOrigin, closeModal } = props;
  const [showModalPrice, setShowModalPrice] = useState(false);
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const [variationsData, setVariationsData] = useState([]);
  const [isOpenModalAddAtribu, setIsOpenModalAddAtribu] = useState(false);
  const [isDisplayBtnEditPrice, setIsDisplayBtnEditPrice] = useState(false);
  const [isOpenModalEditPrice, setIsOpenModalEditPrice] = useState(false);
  const [dataEditPrice, setDataEditPrice] = useState([]);
  const [dataEditPriceNew, setDataEditPriceNew] = useState([]);
  const [nameAtribu, setNameAtribu] = useState('');
  const searchParams = useSearchParams();
  const shopId = searchParams.get('id');

  const {
    control,
    getValues,
    formState: { errors },
  } = useForm();

  const [colorOptions, setColorOptions] = useState([
    {
      label: 'Black',
      value: 'Black',
    },
    {
      label: 'White',
      value: 'White',
    },
  ]);

  const [sizeOptions, setSizeOptions] = useState([
    {
      label: 'S',
      value: 'S',
    },
    {
      label: 'M',
      value: 'M',
    },
  ]);

  const setValueSize = (newValue) => {
    setSizeOptions((prev) => {
      return [...prev, { label: newValue, value: newValue }];
    });
    // setValue("size", [
    //   ...getValues("size"),
    //   { label: newValue, value: newValue },
    // ]);
  };

  const setValueColor = (newValue) => {
    setColorOptions((prev) => {
      return [...prev, { label: newValue, value: newValue }];
    });
    //  setValue("color", [
    //   ...getValues("color"),
    //   { label: newValue, value: newValue },
    // ]);
  };

  const checkDisplayBtnEditPrice = () => {
    if (getValues('color')?.length && getValues('size')?.length) {
      setIsDisplayBtnEditPrice(true);
    } else {
      setIsDisplayBtnEditPrice(false);
    }
  };

  const handleEditPrice = () => {
    const valueColor = getValues('color');
    const valueSize = getValues('size');

    const data = [];

    valueColor.forEach((color) => {
      valueSize.forEach((size) => {
        data.push({
          color: color.value,
          size: size.value,
        });
      });
    });

    setDataEditPrice(data);
    setIsOpenModalEditPrice(true);
  };

  const handSetDataPriceProduct = (value) => {
    setDataEditPriceNew(value);
  };

  const onSubmit = () => {
    console.log(dataEditPriceNew);
    const dataSubmit = dataEditPriceNew.map((price) => ({
      ...price,
      variations: [
        {
          id: variationsOption[0].value,
          name: variationsOption[0].label,
          value_name: price.color,
        },
        {
          id: variationsOption[1].value,
          name: variationsOption[1].label,
          value_name: price.size,
        },
      ],
    }));
    setValueOrigin('skus', dataSubmit);
    closeModal();
  };

  return (
    <Box>
      <Box className={'mb-4'}>
        <Controller
          name="size"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <Box className={'flex gap-2 items-center'}>
              <Autocomplete
                multiple
                limitTags={3}
                id="size"
                options={sizeOptions}
                disableCloseOnSelect
                className="w-full"
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                renderOption={(props, option, { selected }) => {
                  const { key, ...optionProps } = props;
                  return (
                    <Box key={key} {...optionProps} className="w-[200px] text-sm flex items-center p-2">
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        style={{ marginRight: 6 }}
                        checked={selected}
                      />
                      {option.label}
                    </Box>
                  );
                }}
                renderInput={(params) => <TextField label={'Size'} {...params} />}
                onChange={(event, value) => {
                  field.onChange(value);
                  checkDisplayBtnEditPrice();
                }}
              />
              <Button
                size="small"
                variant="contained"
                className="text-nowrap p-2"
                onClick={() => {
                  setIsOpenModalAddAtribu(true);
                  setNameAtribu('size');
                }}
              >
                Thêm size mới
              </Button>
            </Box>
          )}
        />
      </Box>
      <Box>
        <Controller
          name="color"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <Box className={'flex gap-2 items-center'}>
              <Autocomplete
                {...field}
                multiple
                limitTags={2}
                id="color"
                options={colorOptions}
                disableCloseOnSelect
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                className="w-full"
                renderOption={(props, option, { selected }) => {
                  const { key, ...optionProps } = props;
                  return (
                    <Box key={key} {...optionProps} className="w-[200px] text-sm flex items-center p-2">
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        style={{ marginRight: 6 }}
                        checked={selected}
                      />
                      {option.label}
                    </Box>
                  );
                }}
                renderInput={(params) => <TextField {...params} label={'Color'} placeholder={''} />}
                onChange={(event, value) => {
                  field.onChange(value);
                  checkDisplayBtnEditPrice();
                }}
              />
              <Button
                size="small"
                variant="contained"
                className="text-nowrap p-2"
                onClick={() => {
                  setIsOpenModalAddAtribu(true);
                  setNameAtribu('color');
                }}
              >
                Thêm color mới
              </Button>
            </Box>
          )}
        />
      </Box>
      {isDisplayBtnEditPrice && (
        <Box className={'mt-6 flex gap-3 justify-end flex-row'}>
          <Button onClick={handleEditPrice} size="small" variant="contained">
            <EditOutlined fontSize="16" className="mr-1" />
            Chỉnh sửa giá
          </Button>
        </Box>
      )}
      <Box className={'flex gap-3 justify-start flex-row mt-4'}>
        <Button onClick={onSubmit} size="small" variant="contained">
          Thêm biến thể
        </Button>
        <Button onClick={closeModal} size="small" variant="outlined" className="">
          Hủy
        </Button>
      </Box>
      {isOpenModalAddAtribu && (
        <ModalAddAtribu
          isOpen={isOpenModalAddAtribu}
          handleClose={() => setIsOpenModalAddAtribu(false)}
          name={nameAtribu}
          setValueSize={setValueSize}
          setValueColor={setValueColor}
        />
      )}
      {isOpenModalEditPrice && (
        <ModalEditPrice
          isOpen={isOpenModalEditPrice}
          handleClose={() => setIsOpenModalEditPrice(false)}
          products={dataEditPrice}
          shopId={shopId}
          handSetDataPriceProduct={handSetDataPriceProduct}
        />
      )}
    </Box>
  );
};
