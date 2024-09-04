import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { Box, Button, IconButton } from '@mui/material';
import { CloudUpload, Delete } from '@mui/icons-material';

const FileUpload = ({ field, onFileChange }) => {
  const [fileList, setFileList] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFileList((prevFiles) => [...prevFiles, ...files]);
    if (onFileChange) onFileChange(files);
    field.onChange(e.target.files);
  };

  const handleDelete = (fileToDelete) => {
    const updatedFiles = fileList.filter((file) => file !== fileToDelete);
    setFileList(updatedFiles);
    if (onFileChange) onFileChange(updatedFiles);
  };

  const renderPreview = (file) => {
    const url = URL.createObjectURL(file);
    return (
      <Image
        src={url}
        alt={file.name}
        width={100}
        height={100}
        style={{
          width: '100px',
          height: '100px',
          objectFit: 'cover',
          marginRight: '10px',
        }}
        className="rounded-md overflow-hidden"
      />
    );
  };

  return (
    <>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id={`upload-file-${field.name}`}
        type="file"
        multiple
        onChange={handleFileChange}
      />
      <label htmlFor={`upload-file-${field.name}`}>
        <Button variant="contained" color="primary" component="span" startIcon={<CloudUpload />}>
          Upload
        </Button>
      </label>
      <Box mt={2} display="flex" flexDirection="row" flexWrap="wrap">
        {fileList.map((file, index) => (
          <Box key={index} display="flex" alignItems="center" mt={1} className={'rounded-md'}>
            {renderPreview(file)}
            <Box>
              <IconButton color="secondary" onClick={() => handleDelete(file)}>
                <Delete />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
};

FileUpload.propTypes = {
  field: PropTypes.object.isRequired,
  onFileChange: PropTypes.func,
};

export default FileUpload;
