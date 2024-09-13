import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getThumbnail = (videoUrl: string) => {
  try {
    const url = new URL(videoUrl);

    let videoId = "";
    if (url.hostname === "youtu.be") {
      // Extract the video ID from the pathname in youtu.be URLs
      videoId = url.pathname.slice(1); // Removes the leading "/"
    } else if (
      url.hostname === "www.youtube.com" ||
      url.hostname === "youtube.com"
    ) {
      // Extract the video ID from the "v" parameter in standard YouTube URLs
      videoId = url.searchParams.get("v") || "";
    }

    return videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : "";
  } catch (error) {
    console.error("Invalid URL:", error);
    return "";
  }
};

export async function getTitle(videoUrl: string) {
  try {
    // Ensure the URL is either from YouTube or youtu.be
    const url = new URL(videoUrl);

    let videoId = "";
    if (url.hostname === "youtu.be") {
      videoId = url.pathname.slice(1); // Extract the video ID from youtu.be
    } else if (
      url.hostname === "www.youtube.com" ||
      url.hostname === "youtube.com"
    ) {
      videoId = url.searchParams.get("v") || "";
    }

    if (videoId) {
      // Use the original video URL or re-create one for youtu.be to fetch title
      const response = await fetch(
        `https://noembed.com/embed?dataType=json&url=https://www.youtube.com/watch?v=${videoId}`
      );
      const data = await response.json();

      if (data && data.title) {
        return data.title;
      } else {
        throw new Error("Title not found");
      }
    } else {
      throw new Error("Invalid video URL");
    }
  } catch (error) {
    console.error(error);
    return "";
  }
}
