import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { Innertube } from 'youtubei.js/web';

import { createClient } from '@/utils/supabase/server';

const fetchTranscript = async (url: string) => {
  const youtube = await Innertube.create({
    lang: 'en',
    location: 'US',
    retrieve_player: false,
  });

  try {
    const info = await youtube.getInfo(url);
    const title = info.primary_info?.title.text;
    const transcriptData = await info.getTranscript();
    const transcript =
      transcriptData?.transcript?.content?.body?.initial_segments.map(
        (segment) => segment.snippet.text
      );

    return { title, transcript };
  } catch (error) {
    console.error('Error fetching transcript:', error);
    throw error;
  }
};

async function getYouTubeTranscript(videoUrl: string) {
  const videoId = extractVideoId(videoUrl); // Use helper to extract video ID

  if (!videoId) {
    throw new Error('Invalid video URL or missing video ID');
  }

  const { title, transcript } = await fetchTranscript(videoId);

  return {
    title: title || 'Title not available',
    transcript: transcript?.join(' ') || 'Transcript not available',
  };
}

// Helper function to extract video ID from different YouTube URL formats
function extractVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);

    // Handle shortened youtu.be URLs
    if (parsedUrl.hostname === 'youtu.be') {
      return parsedUrl.pathname.slice(1); // Extract the video ID from the pathname
    }

    // Handle standard YouTube URLs
    if (
      parsedUrl.hostname === 'www.youtube.com' ||
      parsedUrl.hostname === 'youtube.com'
    ) {
      return parsedUrl.searchParams.get('v');
    }
  } catch (e) {
    console.error('Error extracting video ID:', e);
    return null;
  }

  return null;
}

async function summarizeTranscript(transcript: string): Promise<string | null> {
  const OPEN_AI = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  const prompt = `
  Summarize the following YouTube transcript, start with in this Youtube video, and end with in conclusion {conclusion}

  ${transcript}

  Summary:
  `;

  const response = await OPEN_AI.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url') as string;
  const supabase = await createClient();

  // Fetch the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user ? user.id : null;

  try {
    // Step 1: Check if a summary already exists
    let existingSummary;
    if (userId) {
      // Check by both URL and user_id if user is logged in
      const { data, error } = await supabase
        .from('history')
        .select('title, summary')
        .eq('url', url)
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw error;
      existingSummary = data;
    } else {
      // Check by URL alone if there is no logged-in user
      const { data, error } = await supabase
        .from('history')
        .select('title, summary')
        .eq('url', url)
        .maybeSingle();
      if (error) throw error;
      existingSummary = data;
    }

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
    const { title, transcript } = await getYouTubeTranscript(url);
    const summary = await summarizeTranscript(transcript);

    // Step 3: Save the new summary to history (if user is logged in)
    const insertData: any = { url, title, summary };
    if (userId) insertData.user_id = userId;

    const { error: insertError } = await supabase
      .from('history')
      .insert(insertData);
    if (insertError) {
      console.error('Error saving to history:', insertError);
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
