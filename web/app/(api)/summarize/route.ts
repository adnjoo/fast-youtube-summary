import { NextRequest } from "next/server";
import OpenAI from "openai";
import { Innertube } from "youtubei.js/web";

const fetchTranscript = async (
  url: string
): Promise<(string | undefined)[] | undefined> => {
  const youtube = await Innertube.create({
    lang: "en",
    location: "US",
    retrieve_player: false,
  });

  try {
    const info = await youtube.getInfo(url);
    const transcriptData = await info.getTranscript();
    return transcriptData?.transcript?.content?.body?.initial_segments.map(
      (segment) => segment.snippet.text
    );
  } catch (error) {
    console.error("Error fetching transcript:", error);
    throw error;
  }
};

async function getYouTubeTranscript(videoUrl: string) {
  const videoId = extractVideoId(videoUrl); // Use helper to extract video ID

  if (!videoId) {
    throw new Error("Invalid video URL or missing video ID");
  }

  const transcript = await fetchTranscript(videoId);

  return transcript?.join(" ") || "Transcript not available";
}

// Helper function to extract video ID from different YouTube URL formats
function extractVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);

    // Handle shortened youtu.be URLs
    if (parsedUrl.hostname === "youtu.be") {
      return parsedUrl.pathname.slice(1); // Extract the video ID from the pathname
    }

    // Handle standard YouTube URLs
    if (
      parsedUrl.hostname === "www.youtube.com" ||
      parsedUrl.hostname === "youtube.com"
    ) {
      return parsedUrl.searchParams.get("v");
    }
  } catch (e) {
    console.error("Error extracting video ID:", e);
    return null;
  }

  return null;
}

async function summarizeTranscript(transcript: string) {
  const OPEN_AI = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  const prompt = `
  Summarize the following YouTube transcript, start with in this Youtube video, and end with in conclusion {conclusion}

  ${transcript}

  Summary:
  `;

  const response = await OPEN_AI.chat.completions.create({
    // model: "gpt-4o", // out of money
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: prompt,
      },
    ],
  });

  return response.choices[0].message;
}

export async function GET(request: NextRequest, response: Response) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url") as string;
  // url is .. for /summarize?url=https://www.youtube.com/watch?v=62wEk02YKs0 // coffee and what it does ..

  const transcript = (await getYouTubeTranscript(url)) as string;
  const summary = await summarizeTranscript(transcript);

  return new Response(JSON.stringify({ summary }));
}
