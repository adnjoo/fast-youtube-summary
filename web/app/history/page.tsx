'use client';

import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

import HistoryCard from '@/components/HistoryCard';
import { useUser } from '@/lib/hooks/useUser';
import { supabase } from '@/utils/supabase/client';

export default function Page() {
  const user = useUser();

  async function fetchHistory() {
    const { data, error } = await supabase
      .from('history')
      .select()
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  const {
    data: history,
    isLoading,
    refetch,
  } = useQuery({ queryKey: ['history'], queryFn: fetchHistory });

  return (
    <div className='container mx-auto max-w-4xl px-4 py-12'>
      <h2 className='text-xl font-semibold'>History</h2>
      <section className='p-4'>
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
            <HistoryCard item={item} key={item.id} onDelete={() => refetch()} />
          ))
        ) : (
          <p className='text-gray-500'>No history available.</p>
        )}
      </section>
    </div>
  );
}
