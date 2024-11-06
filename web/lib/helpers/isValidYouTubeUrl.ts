/**
 * Validates if a given URL is a valid YouTube URL.
 * 
 * This function checks if the URL is from either youtube.com or youtu.be domains.
 * For youtube.com, it ensures the path is '/watch' and there is a 'v' parameter in the query string.
 * For youtu.be, it checks if the path is not empty, as video IDs are directly appended to the path.
 * 
 * @param {string} url - The URL to be validated.
 * @returns {boolean} - Returns true if the URL is a valid YouTube URL, false otherwise.
 */
export const isValidYouTubeUrl = (url: string): boolean => {
  try {
    const { hostname, pathname, searchParams } = new URL(url);
    const isYouTubeDomain = hostname === 'www.youtube.com' || hostname === 'youtube.com';
    const isYouTubeBeDomain = hostname === 'youtu.be';
    const hasValidPath = isYouTubeDomain ? pathname === '/watch' : isYouTubeBeDomain ? pathname.length > 1 : false;
    const hasVideoParam = isYouTubeDomain ? searchParams.has('v') : true; // youtu.be URLs always have a video ID in the path

    return hasValidPath && hasVideoParam;
  } catch (error) {
    return false;
  }
};
