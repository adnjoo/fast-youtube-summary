'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { type Example } from '@/app/(landing)/page';
import { SummaryCard } from '@/components/SummaryCard';
import { Button, Input, Switch } from '@/components/ui';
import { getThumbnail, getTitle, isValidYouTubeUrl } from '@/lib/helpers';
import { useUser } from '@/lib/hooks';
import { createClient } from '@/utils/supabase/client';

export default function LandingBody({ examples }: { examples: Example[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialUrl = searchParams.get('url') || '';
  const user = useUser();
  const supabase = createClient();

  const [url, setUrl] = useState(initialUrl);
  const [summary, setSummary] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showExamples, setShowExamples] = useState<boolean | undefined>(
    undefined
  );
  const [saveHistory, setSaveHistory] = useState<boolean | undefined>(
    undefined
  );
  const [thumbnailTitle, setThumbnailTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const showExamplesStored = localStorage.getItem('showExamples');
    const saveHistoryStored = localStorage.getItem('saveHistory');
    setShowExamples(showExamplesStored ? JSON.parse(showExamplesStored) : true);
    setSaveHistory(saveHistoryStored ? JSON.parse(saveHistoryStored) : false);
  }, []);

  useEffect(() => {
    if (typeof showExamples === 'boolean') {
      localStorage.setItem('showExamples', JSON.stringify(showExamples));
    }
    if (typeof saveHistory === 'boolean') {
      localStorage.setItem('saveHistory', JSON.stringify(saveHistory));
    }
  }, [showExamples, saveHistory]);

  useEffect(() => {
    if (isValidYouTubeUrl(url)) {
      fetchThumbnail(url);
      getTitle(url).then((title) => {
        setThumbnailTitle(title);
      });

      const params = new URLSearchParams();
      params.set('url', url);
      router.push(`?${params.toString()}`);

      handleSummarize(url);
    }
  }, [url]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = event.target.value;
    setUrl(newUrl);

    if (isValidYouTubeUrl(newUrl)) {
      fetchThumbnail(newUrl);
      getTitle(newUrl).then((title) => {
        setThumbnailTitle(title);
      });
    } else {
      setThumbnailUrl('');
      setThumbnailTitle('');
    }
  };

  const fetchThumbnail = (videoUrl: string) => {
    const thumbnail = getThumbnail(videoUrl);
    setThumbnailUrl(thumbnail);
  };

  const handleSummarize = async (videoUrl: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/summarize?url=${encodeURIComponent(videoUrl)}`
      );
      const { summary } = await response.json();
      setSummary(summary);

      if (saveHistory) {
        await saveSummaryHistory(videoUrl, summary);
      }
    } catch (error) {
      console.error('Error processing summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSummaryHistory = async (videoUrl: string, summary: string) => {
    try {
      const { error } = await supabase
        .from('summaries')
        .insert([{ url: videoUrl, summary, user_id: user?.id }]);

      if (error) throw new Error(`Supabase error: ${error.message}`);
    } catch (error) {
      console.log('Error saving summary:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSummarize(url);
  };

  const handleThumbnailClick = async (exampleUrl: string) => {
    setUrl(exampleUrl);
    fetchThumbnail(exampleUrl);
    getTitle(exampleUrl).then((title) => {
      setThumbnailTitle(title);
    });

    handleSummarize(exampleUrl);
  };

  return (
    <main className='mt-4 flex min-h-screen flex-col sm:p-8'>
      <div className='mx-auto mb-8 flex items-center'>
        <span className='mr-2 text-lg font-semibold'>Show Examples</span>
        <Switch checked={showExamples} onCheckedChange={setShowExamples} />

        {user ? (
          <>
            <span className='ml-6 mr-2 text-lg font-semibold'>
              Save History
            </span>
            <Switch checked={saveHistory} onCheckedChange={setSaveHistory} />
          </>
        ) : null}
      </div>

      {showExamples && (
        <div className='mx-auto mb-8 flex flex-col'>
          <div className='mx-auto mb-8 grid grid-cols-2 gap-4 animate-in lg:grid-cols-3'>
            {examples.map((example: Example) => (
              <div
                key={example.url}
                className='group relative cursor-pointer'
                onClick={() => handleThumbnailClick(example.url)}
              >
                <img
                  className='z-50 max-w-[120px] cursor-pointer rounded-sm shadow-md sm:max-w-[180px]'
                  src={example.thumbnail}
                  alt='thumbnail'
                />
                <div className='absolute bottom-0 left-0 z-0 w-full bg-black bg-opacity-75 p-1 text-center text-xs text-white opacity-0 transition-opacity group-hover:opacity-100'>
                  {example.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className='mx-auto flex w-full max-w-md flex-col items-center'
      >
        <Input
          type='url'
          placeholder='Enter YouTube URL e.g. https://www.youtube.com/watch?v=62wEk02YKs0&pp=ygUIYmJjIG5ld3M%3D'
          value={url}
          onChange={handleInputChange}
          ref={inputRef}
          className='mb-4'
        />

        <Button type='submit' disabled={loading} className='relative'>
          Summarize
        </Button>
      </form>
      {thumbnailUrl && (
        <div className='mx-auto mt-4 max-w-md'>
          <h3 className='sr-only mb-2 text-lg'>Thumbnail</h3>
          <img
            src={thumbnailUrl}
            alt='YouTube Thumbnail'
            className='h-auto w-full rounded'
          />
          {thumbnailTitle && (
            <div className='mt-1 text-center text-xs'>{thumbnailTitle}</div>
          )}
        </div>
      )}
      {loading && <Loader2 className='mx-auto mt-8 h-12 w-12 animate-spin' />}
      <SummaryCard summary={summary} loading={loading} />
    </main>
  );
}
