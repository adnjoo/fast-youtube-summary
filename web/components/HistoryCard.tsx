// components/history/HistoryCard.tsx
import Link from 'next/link';
import { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';

// Import the trash icon
import { Card } from '@/components/ui/card';
import { History } from '@/db/database.types';
import { getThumbnail } from '@/lib/helpers';
import { formatISOToHumanReadable } from '@/lib/helpers';
import { createClient } from '@/utils/supabase/client';

export type HistoryCardProps = {
  item: History;
  onDelete: (id: number) => void;
};

export default function HistoryCard({ item, onDelete }: HistoryCardProps) {
  const supabase = createClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('history')
        .delete()
        .eq('id', item.id);

      if (error) {
        console.error('Error deleting history item:', error);
      } else {
        onDelete(item.id); // Call the parent delete handler to remove the item from the list
      }
    } catch (error) {
      console.error('Error deleting history item:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className='flex w-full flex-row rounded-lg border border-gray-100 p-4 shadow-sm transition-shadow duration-200 hover:shadow-md'>
      <div className='flex w-64 flex-col'>
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
          className='mt-2 h-auto w-64 rounded-md'
        />
      </div>
      <div className='ml-2 hidden w-full text-xs md:flex'>{item.summary}</div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className='ml-4 flex items-start text-red-500 hover:text-red-700'
        aria-label='Delete'
      >
        {isDeleting ? 'Deleting...' : <FiTrash2 size={18} />}{' '}
      </button>
    </Card>
  );
}
