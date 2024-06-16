"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LandingBody() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = event.target.value;
    setUrl(newUrl);

    // Fetch thumbnail URL when URL input changes
    if (isValidYouTubeUrl(newUrl)) {
      fetchThumbnail(newUrl);
    } else {
      setThumbnailUrl(""); // Clear thumbnail if URL is invalid
    }
  };

  const isValidYouTubeUrl = (url: string) => {
    try {
      const { hostname, pathname, searchParams } = new URL(url);
      return (
        (hostname === "www.youtube.com" || hostname === "youtube.com") &&
        pathname === "/watch" &&
        searchParams.has("v")
      );
    } catch (error) {
      return false;
    }
  };

  const fetchThumbnail = (videoUrl: string) => {
    const videoId = new URL(videoUrl).searchParams.get("v");
    if (videoId) {
      setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await fetch(`/summarize?url=${encodeURIComponent(url)}`);
      const {
        summary: { content },
      } = await response.json();
      setSummary(content);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-2xl mb-4">YouTube URL Summarizer</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col items-center"
      >
        <Input
          type="url"
          placeholder="Enter YouTube URL e.g. https://www.youtube.com/watch?v=62wEk02YKs0&pp=ygUIYmJjIG5ld3M%3D"
          value={url}
          onChange={handleInputChange}
          className="mb-4"
        />
        <Button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Loading..." : "Summarize"}
        </Button>
      </form>
      {thumbnailUrl && (
        <div className="mt-4">
          <h3 className="text-lg mb-2 sr-only">Thumbnail</h3>
          <img
            src={thumbnailUrl}
            alt="YouTube Thumbnail"
            className="w-full h-auto max-w-md rounded"
          />
        </div>
      )}
      {summary && (
        <div className="mt-8 p-4 border border-gray-300 rounded">
          <h2 className="text-xl mb-2">Summary</h2>
          <p>{summary}</p>
        </div>
      )}
    </main>
  );
}
