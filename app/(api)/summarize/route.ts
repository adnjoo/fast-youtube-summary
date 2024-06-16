import { NextRequest } from "next/server";
import OpenAI from "openai";
import { YoutubeTranscript } from "youtube-transcript";

async function getYouTubeTranscript(videoUrl: string) {
  const videoId = new URL(videoUrl).searchParams.get("v") as string;
  const transcript = await YoutubeTranscript.fetchTranscript(videoId);
  return transcript.map((item) => item.text).join(" ");
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
    model: "gpt-4o",
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

  const transcript = await getYouTubeTranscript(url);
  const summary = await summarizeTranscript(transcript);

  return new Response(JSON.stringify({ summary }));
}
