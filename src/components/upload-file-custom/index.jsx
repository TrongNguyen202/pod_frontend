'use client';

import React, { useState } from "react";
import { Controller } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  Typography,
  IconButton,
} from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";

const UploadFileComponent = ({ control }) => {
  const [fileList, setFileList] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFileList(files);
  };

  const handleDelete = (file) => {
    setFileList((prevFiles) => prevFiles.filter((item) => item !== file));
  };

  return (
    <FormControl fullWidth margin="normal">
      <Box display="flex" flexDirection="column">
        <Controller
          name="product_attributes.file"
          control={control}
          render={({ field }) => (
            <>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="upload-file"
                type="file"
                multiple
                onChange={(e) => {
                  handleFileChange(e);
                  field.onChange(e.target.files);
                }}
              />
              <label htmlFor="upload-file">
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                  startIcon={<CloudUpload />}
                >
                  Upload Files
                </Button>
              </label>
              <Box mt={2}>
                {fileList.map((file, index) => (
                  <Box key={index} display="flex" alignItems="center" mt={1}>
                    <Typography variant="body2">{file.name}</Typography>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDelete(file)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </>
          )}
        />
      </Box>
    </FormControl>
  );
};

export default UploadFileComponent;
