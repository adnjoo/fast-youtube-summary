import { Suspense } from 'react';

import LandingBody from '@/app/(landing)/LandingBody';
import { getThumbnail, getYouTubeURL } from '@/lib/helpers';
import { createClient } from '@/utils/supabase/server';

export type Example = {
  thumbnail: string;
  title: string;
  video_id: string;
};

async function getData(): Promise<Example[]> {
  const supabase = await createClient();

  // Fetch the latest 5 summaries (only URLs) from Supabase
  const { data, error } = await supabase
    .from('history')
    .select('video_id, title')
    .order('created_at', { ascending: false })
    .limit(7);

  if (error) {
    console.error('Error fetching summaries:', error);
    return [];
  }

  return data.map(({ video_id, title }) => ({
    url: getYouTubeURL(video_id),
    thumbnail: getThumbnail(video_id),
    title,
    video_id,
  }));
}

export default async function Home() {
  const data = await getData();
  return (
    <main className='flex flex-col py-4 sm:py-24'>
      <h1 className='text-center text-4xl font-bold'>SummaTube</h1>
      <Suspense fallback={null}>
        <LandingBody examples={data} />
      </Suspense>
    </main>
  );
}
