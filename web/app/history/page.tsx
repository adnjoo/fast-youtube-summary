'use client';

import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import HistoryCard from '@/components/HistoryCard';
import { useUser } from '@/lib/hooks/useUser';
import { createClient } from '@/utils/supabase/client';

export default function Page() {
  const supabase = createClient();
  const user = useUser();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        setLoading(true);
        const { data, error } = await supabase
          .from('history')
          .select()
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching history:', error);
        } else {
          setHistory(data || []);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  return (
    <div className='container mx-auto max-w-4xl px-4 py-12'>
      <h2 className='text-xl font-semibold'>History</h2>
      <section className='p-4'>
        {!user ? (
          <p className='text-gray-500'>
            You must be logged in to view your history.
          </p>
        ) : loading ? (
          <div className='flex justify-center'>
            <Loader2 className='animate-spin text-gray-500' />
          </div>
        ) : history.length > 0 ? (
          history.map((item) => (
            <div key={item.id} className='mb-4'>
              <HistoryCard item={item} />
            </div>
          ))
        ) : (
          <p className='text-gray-500'>No history available.</p>
        )}
      </section>
    </div>
  );
}
