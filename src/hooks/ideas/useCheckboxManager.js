import { useState } from 'react';

const useCheckboxManager = (orders) => {
  const [checkedOrderIds, setCheckedOrderIds] = useState([]);

  const handleToggleCheck = (id) => {
    setCheckedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleCheckAll = () => {
    const currentPageIds = orders.map((item) => item.id);
    const allChecked = currentPageIds.every((id) => checkedOrderIds.includes(id));

    if (allChecked) {
      setCheckedOrderIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      const newChecked = [...new Set([...checkedOrderIds, ...currentPageIds])];
      setCheckedOrderIds(newChecked);
    }
  };

  const resetChecked = () => setCheckedOrderIds([]);

  return {
    checkedOrderIds,
    handleToggleCheck,
    handleToggleCheckAll,
    resetChecked,
  };
};

export default useCheckboxManager;
