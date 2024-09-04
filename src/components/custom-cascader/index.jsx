import { Autocomplete, Box, TextField } from "@mui/material";
import { useState } from "react";

export const Cascader = ({
  options,
  onSubSubcategoryChange,
  onChange,
  value,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [subOptions, setSubOptions] = useState([]);
  const [subSubOptions, setSubSubOptions] = useState([]);

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
    setSelectedSubcategory(null);
    setSubOptions(newValue ? newValue.children : []);
    setSubSubOptions([]);
    onChange({ category: newValue, subcategory: null, subsubcategory: null });
  };

  const handleSubcategoryChange = (event, newValue) => {
    setSelectedSubcategory(newValue);
    setSubSubOptions(newValue ? newValue.children : []);
    onChange({
      category: selectedCategory,
      subcategory: newValue,
      subsubcategory: null,
    });
  };

  const handleSubSubcategoryChange = (event, newValue) => {
    onChange({
      category: selectedCategory,
      subcategory: selectedSubcategory,
      subsubcategory: newValue,
    });
    if (newValue) {
      console.log(newValue.value);
      onSubSubcategoryChange(newValue.value);
    }
  };

  return (
    <Box className={"flex gap-3"}>
      <Autocomplete
        options={options}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        onChange={handleCategoryChange}
        renderInput={(params) => (
          <TextField {...params} label="Category" variant="filled" />
        )}
        value={value?.category || null}
        className="w-1/3"
      />
      <Autocomplete
        options={subOptions}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        onChange={handleSubcategoryChange}
        renderInput={(params) => (
          <TextField {...params} label="Subcategory" variant="filled" />
        )}
        value={value?.subcategory || null}
        disabled={!selectedCategory}
        className="w-1/3"
      />
      <Autocomplete
        options={subSubOptions}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        onChange={handleSubSubcategoryChange}
        renderInput={(params) => (
          <TextField {...params} label="Sub-subcategory" variant="filled" />
        )}
        value={value?.subsubcategory || null}
        disabled={!selectedSubcategory}
        className="w-1/3"
      />
    </Box>
  );
};
