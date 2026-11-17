import { useState, useMemo } from 'react';

interface UsePaginationOptions<T> {
  data: T[];
  initialPage?: number;
  initialPageSize?: number;
}

export function usePagination<T>({
  data,
  initialPage = 1,
  initialPageSize = 10,
}: UsePaginationOptions<T>) {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  const totalElements = data.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));

  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedData = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, safeCurrentPage, pageSize]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  const nextPage = () => {
    if (safeCurrentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const prevPage = () => {
    if (safeCurrentPage > 1) setCurrentPage((p) => p - 1);
  };

  return {
    currentPage: safeCurrentPage,
    pageSize,
    setPageSize,
    totalElements,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: safeCurrentPage < totalPages,
    hasPrevPage: safeCurrentPage > 1,
  };
}
