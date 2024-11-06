import { extractVideoId } from './extractVideoId';

export const getThumbnail = (videoUrl: string): string => {
  const videoId = extractVideoId(videoUrl);

  if (!videoId) {
    console.warn('Invalid YouTube URL for thumbnail');
    return '';
  }

  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};
