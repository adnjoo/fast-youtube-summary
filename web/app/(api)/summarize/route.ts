import { NextRequest } from 'next/server';

import { createClient } from '@/utils/supabase/server';

import { fetchTranscript } from './fetchTranscript';
import { summarizeTranscript } from './summarizeTranscript';

async function getYouTubeTranscript(video_id: string) {
  if (!video_id) {
    throw new Error('Invalid video URL or missing video ID');
  }

  const { title, transcript } = await fetchTranscript(video_id);

  return {
    title: title || 'Title not available',
    transcript: transcript?.join(' ') || 'Transcript not available',
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const video_id = searchParams.get('video_id') as string;
  const save = searchParams.get('save') === 'true'; // Check if 'save' is set to 'true'
  const supabase = await createClient();

  // Fetch the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user ? user.id : null;

  try {
    // Step 1: Check if a summary already exists
    let existingSummary;

    // Check by video id
    const { data, error } = await supabase
      .from('history')
      .select('title, summary')
      .eq('video_id', video_id)
      .limit(1) // Limit to 1 row
      .maybeSingle();
    if (error) throw error;
    existingSummary = data;

    // If a summary exists, return it immediately
    if (existingSummary) {
      return new Response(
        JSON.stringify({
          title: existingSummary.title,
          summary: existingSummary.summary,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Step 2: Generate a new summary if not found
    const { title, transcript } = await getYouTubeTranscript(video_id);
    const summary = await summarizeTranscript(transcript);
    

    // Step 3: Save the new summary to history (if save)
    if (save) {
      const insertData: any = { video_id, title, summary };
      if (userId) insertData.user_id = userId;

      const { error: insertError } = await supabase
        .from('history')
        .insert(insertData);
      if (insertError) {
        console.error('Error saving to history:', insertError);
      }
    }

    // Return the newly generated summary
    return new Response(
      JSON.stringify({
        title,
        summary,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    console.error('Error processing summary:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to process summary' }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    );
  }
}
