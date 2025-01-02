'use client';

import Page from '@frontend/components/Page/Page';
import Pagination from '@frontend/components/Pagination';
import PetCard from '@frontend/components/PetCard';
import SortControls from '@frontend/components/SortControls';
import petQueries from '@frontend/queries/petQueries';
import { SortOrder } from '@frontend/services/petService';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';
import styles from './Pets.module.scss';

function PetsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState<'asc' | 'desc'>(
    (searchParams.get('order') as 'asc' | 'desc') || 'asc',
  );

  useEffect(() => {
    const order = searchParams.get('order') as 'asc' | 'desc';
    if (order && order !== sortBy) {
      setSortBy(order);
    }
  }, [searchParams, sortBy]);

  const {
    data: petsData,
    isError,
    isFetching,
    isLoading,
  } = useQuery({
    ...petQueries.list({
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      order: searchParams.get('order') as SortOrder,
      pageSize: 10,
    }),
    staleTime: 3000,
  });

  const { paging, results: pets } = petsData ?? {};

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  if (isError) {
    return <Page>Error</Page>;
  }

  if (isLoading || isFetching) {
    return (
      <Page>
        <div className={styles.stack}>
          <div className={styles.spinner} />
        </div>
      </Page>
    );
  }

  if (!pets || !paging) {
    return <Page>No pets found</Page>;
  }

  return (
    <Suspense fallback={<p>loading</p>}>
      <Page>
        <h1 className={styles.heading}>Pets</h1>
        <p className={styles.text}>
          {paging?.totalResults} Total{' '}
          {paging?.totalResults === 1 ? 'result' : 'results'}
        </p>

        <div className={styles.sortControlsContainer}>
          {pets && pets.length > 0 && (
            <SortControls
              onChange={e => {
                router.push(`?${createQueryString('order', e)}`);
                setSortBy(e);
              }}
              sortBy={sortBy}
              selected={searchParams.get('order') === sortBy}
              options={[
                {
                  label: 'Ascending',
                  value: 'asc',
                },
                {
                  label: 'Descending',
                  value: 'desc',
                },
              ]}
            />
          )}
        </div>

        <div className={styles.grid}>
          {pets && pets.map(p => <PetCard pet={p} key={p.id} />)}
        </div>
        <div className={styles.paginationContainer}>
          <Pagination paging={paging} />
        </div>
      </Page>
    </Suspense>
  );
}

// workaround to get around
/* 
fix Generating static pages (0/7) [= ] ⨯ useSearchParams() should be wrapped in a suspense boundary at page "/pets". Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
*/
export default function PetsPage() {
  return (
    <Suspense fallback={<p>loading</p>}>
      <PetsContent />
    </Suspense>
  );
}
