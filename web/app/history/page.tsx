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

  async function fetchHistory() {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const { data, error } = await supabase
      .from('history')
      .select()
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) throw new Error(error.message);
    return data;
  }

  const {
    data: history,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['history', page],
    queryFn: fetchHistory,
    placeholderData: keepPreviousData,
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
      {history && history.length > 0 && (
        <div className="flex justify-between mt-4">
          <Button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={history.length < pageSize}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
