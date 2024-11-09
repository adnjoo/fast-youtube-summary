import { FiShare2 } from 'react-icons/fi';

import { copyUrl } from '@/components/HistoryCard';
import { Notification } from '@/components/layout/Notification';
import { useCopyToClipboard } from '@/lib/hooks';

export const SummaryCard = ({ summary, loading, video_id }) => {
  const { copySuccess, handleCopyClick } = useCopyToClipboard();

  if (!summary || loading) return null;

  return (
    <div className='mx-auto mt-8 max-w-5xl rounded border border-gray-300 p-2 text-sm sm:p-4 sm:text-base'>
      <h2 className='mb-2 text-xl'>Summary</h2>
      <p>
        <button
          onClick={() => handleCopyClick(copyUrl(video_id))}
          className='flex items-center text-blue-500 hover:text-blue-700 my-2'
          aria-label='Copy URL'
        >
          <FiShare2 size={18} />
        </button>
        {summary}
      </p>
      <Notification isVisible={copySuccess} />
    </div>
  );
};
