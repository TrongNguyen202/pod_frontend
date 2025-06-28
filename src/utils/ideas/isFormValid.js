const isFormValid = (formData, requiredFields = []) => {
  if (!(formData instanceof FormData)) return false;

  return requiredFields.every((field) => {
    const values = formData.getAll(field);
    if (values.length === 0) return false;

    return values.every((value) => {
      if (value === undefined || value === null) return false;
      if (typeof value === 'string' && value.trim() === '') return false;
      if (value instanceof File && value.size === 0) return false;
      return true;
    });
  });
};

export default isFormValid;
