// components/history/HistoryCard.tsx
import Link from 'next/link';
import { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';

import { Card } from '@/components/ui/card';
import { History } from '@/db/database.types';
import { getThumbnail } from '@/lib/helpers';
import { formatISOToHumanReadable } from '@/lib/helpers';
import { createClient } from '@/utils/supabase/client';

export default function HistoryCard({
  item,
  onDelete,
}: {
  item: History;
  onDelete: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    setIsDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('history')
        .delete()
        .eq('id', item.id);
      if (error) console.error('Error deleting history item:', error);
      else onDelete();
    } catch (error) {
      console.error('Error deleting history item:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className='flex w-full flex-col rounded-lg border border-gray-100 p-4 shadow-sm transition-shadow duration-200 hover:shadow-md md:flex-row'>
      <div className='flex w-full flex-col md:w-64'>
        <Link
          href={item.url}
          className='text-sm font-semibold hover:underline'
          target='_blank'
        >
          {item.title}
        </Link>
        <p className='text-sm text-gray-500'>
          {formatISOToHumanReadable(item.created_at || '')}
        </p>
        <img
          src={getThumbnail(item.url)}
          alt={`${item.title} thumbnail`}
          className='mt-2 h-auto w-full rounded-md md:w-64'
        />
      </div>
      {/* Conditional rendering for summary: accordion on mobile, visible text on larger screens */}
      <div className='ml-0 mt-4 w-full text-xs md:ml-4 md:mt-0'>
        <details className='md:hidden'>
          <summary className='cursor-pointer text-blue-600'>
            View Summary
          </summary>
          <p className='mt-2 text-gray-700'>{item.summary}</p>
        </details>
        <p className='hidden text-gray-700 md:block'>{item.summary}</p>
      </div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className='mt-4 flex items-center text-red-500 hover:text-red-700 md:ml-4 md:mt-0'
        aria-label='Delete'
      >
        {isDeleting ? 'Deleting...' : <FiTrash2 size={18} />}
      </button>
    </Card>
  );
}
