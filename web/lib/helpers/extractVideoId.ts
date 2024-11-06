export function extractVideoId(videoUrl: string): string | null {
  try {
    const url = new URL(videoUrl);

    if (url.hostname === 'youtu.be') {
      return url.pathname.slice(1);
    }
    if (url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com') {
      return url.searchParams.get('v');
    }

    return null; // Unsupported domain
  } catch {
    return null;
  }
}
