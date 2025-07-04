'use client';

import { useCallback, useEffect, useState } from "react";

export const useSelection = (items = []) => {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setSelected([]);
  }, [items]);

  const handleSelectAll = useCallback(
    (listSelect) => {
      if (listSelect) {
        setSelected([...listSelect]);
      } else {
        setSelected([...items]);
      }
    },
    [items]
  );

  const handleSelectOne = useCallback((item) => {
    setSelected((prevState) => [...prevState, item]);
  }, []);

  const handleDeselectAll = useCallback(() => {
    setSelected([]);
  }, []);

  const handleDeselectOne = useCallback((item) => {
    setSelected((prevState) => {
      return prevState.filter((_item) => _item !== item);
    });
  }, []);

  return {
    handleDeselectAll,
    handleDeselectOne,
    handleSelectAll,
    handleSelectOne,
    selected,
  };
};
