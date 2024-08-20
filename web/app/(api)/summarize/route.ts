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
  const videoId = new URL(videoUrl).searchParams.get("v") as string;
  const transcript = await fetchTranscript(videoId);
  // console.log("transcript", transcript);
  return transcript?.join(" ");
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

  const transcript = await getYouTubeTranscript(url) as string;
  const summary = await summarizeTranscript(transcript);

  return new Response(JSON.stringify({ summary }));
}
