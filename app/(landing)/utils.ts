export const getThumbnail = (videoUrl: string) => {
  const videoId = new URL(videoUrl).searchParams.get("v");
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : "";
};
