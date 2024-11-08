import Link from 'next/link';
import { useState } from 'react';
import { FiShare2, FiTrash2 } from 'react-icons/fi';

import { Notification } from '@/components/layout/Notification';
import { Card } from '@/components/ui/card';
import { History } from '@/db/database.types';
import { AppConfig } from '@/lib/constants';
import { getThumbnail } from '@/lib/helpers';
import { formatISOToHumanReadable } from '@/lib/helpers';
import { useCopyToClipboard } from '@/lib/hooks';

export const copyUrl = (url: string) => `${AppConfig.SITE_URL}/?url=${url}`;

export function HistoryCard({
  item,
  onDelete,
}: {
  item: History;
  onDelete: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { copySuccess, handleCopyClick } = useCopyToClipboard();

  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setIsDeleting(true);
      onDelete();
    }
  };

  return (
    <Card className='flex w-full flex-col rounded-lg border border-gray-100 px-2 py-4 shadow-sm transition-shadow duration-200 hover:shadow-md sm:px-4 md:flex-row'>
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
      <div className='ml-0 mt-4 w-full text-xs md:ml-4 md:mt-0'>
        <details className='md:hidden'>
          <summary className='cursor-pointer text-blue-600'>
            View Summary
          </summary>
          <p className='mt-2 text-gray-700'>{item.summary}</p>
        </details>
        <p className='hidden text-gray-700 md:block'>{item.summary}</p>
      </div>
      <div className='mt-4 flex gap-4 sm:flex-col md:ml-4 md:mt-0'>
        <button
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className='flex items-center text-red-500 hover:text-red-700'
          aria-label='Delete'
        >
          {isDeleting ? 'Deleting...' : <FiTrash2 size={18} />}
        </button>
        <button
          onClick={() => handleCopyClick(copyUrl(item.url))}
          className='flex items-center text-blue-500 hover:text-blue-700'
          aria-label='Copy URL'
        >
          <FiShare2 size={18} />
        </button>
      </div>
      <Notification isVisible={copySuccess} />
    </Card>
  );
}
