'use client';

import { useState } from 'react';

const useOrderFilter = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [sortBy, setSortBy] = useState('created_date');
  const [sortDirection, setSortDirection] = useState('desc');

  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [minPriceDe, setMinPriceDe] = useState();
  const [maxPriceDe, setMaxPriceDe] = useState();

  const [startCreateDate, setStartCreateDate] = useState(null);
  const [endCreateDate, setEndCreateDate] = useState(null);
  const [startUpdateDate, setStartUpdateDate] = useState(null);
  const [endUpdateDate, setEndUpdateDate] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [searchTextInput, setSearchTextInput] = useState('');

  const clearFilters = () => {
    setSortBy('');
    setSortDirection('');
    setStartCreateDate(null);
    setEndCreateDate(null);
    setStartUpdateDate(null);
    setEndUpdateDate(null);
    setMinPrice(null);
    setMaxPrice(null);
    setMinPriceDe(null);
    setMaxPriceDe(null);
    setPage(1);
  };

  return {
    page,
    setPage,
    limit,
    setLimit,

    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,

    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    minPriceDe,
    maxPriceDe,
    setMinPriceDe,
    setMaxPriceDe,

    startCreateDate,
    endCreateDate,
    setStartCreateDate,
    setEndCreateDate,
    startUpdateDate,
    endUpdateDate,
    setStartUpdateDate,
    setEndUpdateDate,

    searchText,
    setSearchText,
    searchTextInput,
    setSearchTextInput,

    clearFilters,
  };
};

export default useOrderFilter;
