import React, { useRef, useState } from "react";
import {
  Button,
  Divider,
  TextField,
  MenuItem,
  Select,
  Chip,
  Box,
  Typography,
  Autocomplete,
} from "@mui/material";
import { Plus as PlusIcon } from "@mui/icons-material";

let indexOption = 0;

const initialOptions = (optionsSelect, selectedDefault) => {
  if (!optionsSelect) return [];
  const options = [...optionsSelect];
  if (selectedDefault && selectedDefault?.length) {
    selectedDefault.forEach((item) => {
      if (!options.find((option) => option.value === item)) {
        options.push({ label: item, value: item });
      }
    });
  }
  return options;
};

export const CustomSelect = ({
  optionsSelect,
  type,
  onChange,
  selectedDefault,
}) => {
  const [options, setOptions] = useState(
    initialOptions(optionsSelect, selectedDefault)
  );
  const [valueTextAreas, setValueTextAreas] = useState("");

  const handleChangeSelect = (value) => {
    onChange(value);
  };

  return (
    <Box>
      <Autocomplete
        multiple
        limitTags={2}
        id="status"
        options={options}
        disableCloseOnSelect
        // size="small"
        // className="w-96"
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          return (
            <Box
              key={key}
              {...optionProps}
              className="w-[200px] text-sm flex items-center p-2"
            >
              {option.label}
            </Box>
          );
        }}
        renderInput={(params) => <TextField {...params} placeholder={type} />}
        onChange={(event, value) => handleChangeSelect(value)}
      />
      {/* {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
        <Divider sx={{ marginY: 2 }} />
        <Box className={"p-4"}>
          <Typography variant="body2">
            Thêm nhiều{" "}
            <span style={{ fontStyle: "italic", fontSize: 12 }}>
              (Các trường cách nhau bởi dấu phẩy)
            </span>
          </Typography>
          <TextField
            onChange={onChangeTextArea}
            onKeyDown={(e) => e.stopPropagation()}
            size="small"
            placeholder={`Thêm nhiều ${type}`}
          />
        </Box> */}
    </Box>
  );
};
