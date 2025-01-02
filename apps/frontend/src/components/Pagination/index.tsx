'use client';

import { Paging } from '@frontend/services/types/pagination';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './Pagination.module.scss';

interface Props {
  paging: Paging;
}

function Pagination({ paging }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') ?? '1', 10);
  const totalPages = paging?.totalPages || 1;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`, {
      scroll: true,
    });
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 10;
    const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
    const startPage = Math.max(1, currentPage - halfMaxPagesToShow);
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (startPage > 1) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`${styles.button} ${currentPage === 1 ? styles.active : ''}`}
          aria-current={currentPage === 1 ? 'page' : undefined}
          type="button"
        >
          1
        </button>,
      );
      if (startPage > 2) {
        pageNumbers.push(
          <button
            key="start-ellipsis"
            onClick={() => handlePageChange(startPage - 1)}
            className={styles.button}
            type="button"
          >
            ...
          </button>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i += 1) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`${styles.button} ${currentPage === i ? styles.active : ''}`}
          type="button"
        >
          {i}
        </button>,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <button
            key="end-ellipsis"
            onClick={() => handlePageChange(endPage + 1)}
            className={styles.button}
            type="button"
          >
            ...
          </button>,
        );
      }
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`${styles.button} ${currentPage === totalPages ? styles.active : ''}`}
          type="button"
        >
          {totalPages}
        </button>,
      );
    }

    return pageNumbers;
  };

  if (paging.totalPages > 1) {
    return (
      <div className={styles.paginationContainer}>
        <div className={styles.pagination}>
          {currentPage > 1 && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={styles.button}
              type="button"
            >
              Previous
            </button>
          )}
          {renderPageNumbers()}
          {currentPage < totalPages && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className={styles.button}
              type="button"
            >
              Next
            </button>
          )}
        </div>
      </div>
    );
  }
  return null;
}

export default Pagination;
