// Helper function to extract video ID from different YouTube URL formats
export function extractVideoId(url: string): string | null {
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
