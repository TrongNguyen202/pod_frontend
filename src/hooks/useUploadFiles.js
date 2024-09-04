import { useState } from "react";

const useFileUpload = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    setFiles([...event.target.files]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return {
    files,
    handleFileChange,
    removeFile,
  };
};

export default useFileUpload;
