'use client';

import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import HistoryCard from '@/components/HistoryCard';
import { useUser } from '@/lib/hooks/useUser';
import { supabase } from '@/utils/supabase/client';
import { Button } from '@/components/ui';

export default function Page() {
  const user = useUser();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(0);

  async function fetchHistory() {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const { data, error, count } = await supabase
      .from('history')
      .select('*', { count: 'exact' }) // Get total count for pagination
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) throw new Error(error.message);

    // Set total pages based on count
    if (count) setTotalPages(Math.ceil(count / pageSize));

    return data;
  }

  const {
    data: history,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['history', page],
    queryFn: fetchHistory,
    placeholderData: keepPreviousData
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('history').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <div className='container mx-auto max-w-4xl p-4 sm:py-12'>
      <h2 className='text-xl font-semibold mb-4'>History</h2>
      <section className='flex flex-col gap-4 sm:p-4'>
        {!user ? (
          <p className='text-gray-500'>
            You must be logged in to view your history.
          </p>
        ) : isLoading ? (
          <div className='flex justify-center'>
            <Loader2 className='animate-spin text-gray-500' />
          </div>
        ) : history && history.length > 0 ? (
          history.map((item) => (
            <HistoryCard
              item={item}
              key={item.id}
              onDelete={() => deleteMutation.mutate(item.id)}
            />
          ))
        ) : (
          <p className='text-gray-500'>No history available.</p>
        )}
      </section>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              disabled={page === i + 1}
              className={page === i + 1 ? 'bg-blue-500' : ''}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
