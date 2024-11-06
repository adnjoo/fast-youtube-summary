'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { type Example } from '@/app/(landing)/page';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useUser } from '@/lib/hooks/useUser';
import { getThumbnail, getTitle } from '@/lib/utils';
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
  const [hoveredExample, setHoveredExample] = useState<Example | null>(null);
  const [showExamples, setShowExamples] = useState<boolean | undefined>(
    undefined
  );
  const [thumbnailTitle, setThumbnailTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedValue = localStorage.getItem('showExamples');
    setShowExamples(storedValue ? Boolean(JSON.parse(storedValue)) : true);
  }, []);

  useEffect(() => {
    if (typeof showExamples === 'boolean') {
      localStorage.setItem('showExamples', JSON.stringify(showExamples));
    }
  }, [showExamples]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (isValidYouTubeUrl(url)) {
      fetchThumbnail(url);
      getTitle(url).then((title) => {
        setThumbnailTitle(title);
      });

      // set query
      const params = new URLSearchParams();
      params.set('url', url);
      router.push(`?${params.toString()}`);

      // Run summarize function if URL is present
      handleSummarize(url);
    }
  }, [url]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = event.target.value;
    setUrl(newUrl);

    // Fetch thumbnail URL when URL input changes
    if (isValidYouTubeUrl(newUrl)) {
      fetchThumbnail(newUrl);
      getTitle(newUrl).then((title) => {
        setThumbnailTitle(title);
      });
    } else {
      setThumbnailUrl(''); // Clear thumbnail if URL is invalid
      setThumbnailTitle('');
    }
  };

  const isValidYouTubeUrl = (url: string) => {
    try {
      const { hostname, pathname, searchParams } = new URL(url);

      return (
        ((hostname === 'www.youtube.com' || hostname === 'youtube.com') &&
          pathname === '/watch' &&
          searchParams.has('v')) ||
        (hostname === 'youtu.be' && pathname.length > 1)
      );
    } catch (error) {
      return false;
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
    } catch (error) {
      console.error("Error processing summary:", error);
    } finally {
      setLoading(false);
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

  const handleMouseEnter = (example: Example) => {
    setHoveredExample(example);
  };

  const handleMouseLeave = () => {
    setHoveredExample(null);
  };

  return (
    <main className='mt-4 flex min-h-screen flex-col sm:p-8'>
      <div className='mx-auto mb-8 flex items-center'>
        <span className='mr-2 text-lg font-semibold'>Show Examples</span>
        <Switch checked={showExamples} onCheckedChange={setShowExamples} />
      </div>

      {showExamples && (
        <div className='mx-auto mb-8 flex flex-col'>
          <div className='mx-auto mb-8 grid grid-cols-2 gap-4 animate-in lg:grid-cols-3'>
            {examples.map((example: Example) => (
              <div
                key={example.url}
                className='relative cursor-pointer'
                onMouseEnter={() => handleMouseEnter(example)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleThumbnailClick(example.url)}
              >
                <img
                  className='z-50 max-w-[120px] cursor-pointer rounded-sm shadow-md sm:max-w-[180px]'
                  src={example.thumbnail}
                  alt='thumbnail'
                />
                <div
                  className={`absolute bottom-0 left-0 z-0 w-full bg-black bg-opacity-75 p-1 text-center text-xs text-white transition ${
                    example === hoveredExample ? 'opacity-100' : 'opacity-0'
                  }`}
                >
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
      {summary && !loading && (
        <div className='mx-auto mt-8 max-w-5xl rounded border border-gray-300 p-2 text-sm sm:p-4 sm:text-base'>
          <h2 className='mb-2 text-xl'>Summary</h2>
          <p>{summary}</p>
        </div>
      )}
    </main>
  );
}
