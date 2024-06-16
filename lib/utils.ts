import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getThumbnail = (videoUrl: string) => {
  const videoId = new URL(videoUrl).searchParams.get("v");
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : "";
};

export async function getTitle(videoUrl: string) {
try {
    const response = await fetch(
      `https://noembed.com/embed?dataType=json&url=${videoUrl}`
    );
    const data = await response.json();

    if (data && data.title) {
      return data.title;
    } else {
      throw new Error("Title not found");
    }
  } catch (error) {
    console.error(error);
    return "";
  }
}
