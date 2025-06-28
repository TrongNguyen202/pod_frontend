const buildQueryString = ({
  selectedCategory,
  boardId,
  sortBy,
  sortDirection,
  startCreateDate,
  endCreateDate,
  startUpdateDate,
  endUpdateDate,
  minPrice,
  maxPrice,
  minPriceDe,
  maxPriceDe,
  searchText,
  page,
  limit,
}) => {
  const params = new URLSearchParams();

  if (selectedCategory && selectedCategory !== 'ALL') {
    params.append('status', selectedCategory);
  }

  if (searchText) {
    params.append('searchText', searchText);
  }

  if (boardId) params.append('boardId', boardId);
  if (sortBy) params.append('sortBy', sortBy);
  if (sortDirection) params.append('sortDirection', sortDirection);

  if (startCreateDate) params.append('startCreateDate', startCreateDate.toISOString());
  if (endCreateDate) params.append('endCreateDate', endCreateDate.toISOString());
  if (startUpdateDate) params.append('startUpdateDate', startUpdateDate.toISOString());
  if (endUpdateDate) params.append('endUpdateDate', endUpdateDate.toISOString());

  if (minPrice) params.append('minPrice', minPrice);
  if (maxPrice) params.append('maxPrice', maxPrice);
  if (minPriceDe) params.append('minPriceDe', minPriceDe);
  if (maxPriceDe) params.append('maxPriceDe', maxPriceDe);

  params.append('pageNumber', page);
  params.append('pageSize', limit);

  return `${params.toString()}`;
};

export default buildQueryString;
