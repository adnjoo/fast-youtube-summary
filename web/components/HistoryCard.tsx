// components/history/HistoryCard.tsx
import Link from 'next/link';

import { Card } from '@/components/ui/card';
import { History } from '@/db/databse.types';
import { getThumbnail } from '@/lib/helpers';
import { formatISOToHumanReadable } from '@/lib/helpers';

export default function HistoryCard({ item }: { item: History }) {
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
    </Card>
  );
}
