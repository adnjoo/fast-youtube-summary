import { extractVideoId, isValidYouTubeUrl } from './';

// https://noembed.com/
type NoEmbedYouTubeEmbed = {
  provider_name: string;
  thumbnail_width: number;
  width: number;
  html: string;
  height: number;
  provider_url: string;
  type: string;
  title: string;
  thumbnail_url: string;
  author_name: string;
  author_url: string;
  version: string;
  thumbnail_height: number;
  url: string;
};

export async function getTitle(videoUrl: string): Promise<string> {
  if (!isValidYouTubeUrl(videoUrl)) {
    console.warn('Invalid YouTube URL');
    return '';
  }

  try {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      console.warn('Could not extract video ID');
      return '';
    }

    const response = await fetch(
      `https://noembed.com/embed?dataType=json&url=https://www.youtube.com/watch?v=${videoId}`
    );

    if (!response.ok) {
      console.warn(`Fetch failed with status: ${response.status}`);
      return '';
    }

    const data: NoEmbedYouTubeEmbed = await response.json();
    return data.title || 'Title not found';
  } catch (error) {
    console.error('Error fetching video title:', error);
    return '';
  }
}
