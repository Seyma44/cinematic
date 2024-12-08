import React from 'react';
import { TablePagination } from '@mui/material';

interface PaginationProps {
  rowsPerPageOptions: number[];
  component: React.ElementType;
  count: number;
  rowsPerPage: number;
  page: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  rowsPerPageOptions,
  component,
  count,
  rowsPerPage,
  page,
  onPageChange,
  onRowsPerPageChange
}) => {
  return (
    <TablePagination
      rowsPerPageOptions={rowsPerPageOptions}
      component={component}
      count={count}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );
};

export default Pagination;

