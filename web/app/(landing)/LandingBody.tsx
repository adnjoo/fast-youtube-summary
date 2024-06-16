"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { getThumbnail, getTitle } from "@/lib/utils";
import { Example } from "./page";

export default function LandingBody({ examples }: { examples: Example[] }) {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoveredExample, setHoveredExample] = useState<Example | null>(null);
  const [showExamples, setShowExamples] = useState<boolean | undefined>(
    undefined
  );
  const [thumbnailTitle, setThumbnailTitle] = useState("");

  useEffect(() => {
    const storedValue = localStorage.getItem("showExamples");
    setShowExamples(storedValue ? Boolean(JSON.parse(storedValue)) : true);
  }, []);

  useEffect(() => {
    if (typeof showExamples === "boolean") {
      localStorage.setItem("showExamples", JSON.stringify(showExamples));
    }
  }, [showExamples]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = event.target.value;
    setUrl(newUrl);

    // Fetch thumbnail URL when URL input changes
    if (isValidYouTubeUrl(newUrl)) {
      fetchThumbnail(newUrl);
      getTitle(newUrl).then((title) => {
        setThumbnailTitle(title);
      });
    } else {
      setThumbnailUrl(""); // Clear thumbnail if URL is invalid
      setThumbnailTitle("");
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
    const thumbnail = getThumbnail(videoUrl);
    setThumbnailUrl(thumbnail);
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

  const handleThumbnailClick = async (exampleUrl: string) => {
    setUrl(exampleUrl);
    fetchThumbnail(exampleUrl);
    getTitle(exampleUrl).then((title) => {
      setThumbnailTitle(title);
    });

    // Simulate form submission
    try {
      setLoading(true);
      const response = await fetch(
        `/summarize?url=${encodeURIComponent(exampleUrl)}`
      );
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

  const handleMouseEnter = (example: Example) => {
    setHoveredExample(example);
  };

  const handleMouseLeave = () => {
    setHoveredExample(null);
  };

  return (
    <main className="mt-4 flex min-h-screen flex-col sm:p-8">
      <div className="flex items-center mb-8 mx-auto">
        <span className="mr-2 text-lg font-semibold">Show Examples</span>
        <Switch checked={showExamples} onCheckedChange={setShowExamples} />
      </div>

      {showExamples && (
        <div className="flex flex-col mb-8 mx-auto">
          <div className="animate-in grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8 mx-auto">
            {examples.map((example: Example) => (
              <div
                key={example.url}
                className="relative cursor-pointer"
                onMouseEnter={() => handleMouseEnter(example)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleThumbnailClick(example.url)}
              >
                <img
                  className="max-w-[120px] sm:max-w-[180px] rounded-sm shadow-md cursor-pointer z-50"
                  src={example.thumbnail}
                  alt="thumbnail"
                />
                <div
                  className={`absolute transition bottom-0 left-0 w-full bg-black bg-opacity-75 text-white text-center text-xs p-1 z-0 ${
                    example === hoveredExample ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {example.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col items-center mx-auto"
      >
        <Input
          type="url"
          placeholder="Enter YouTube URL e.g. https://www.youtube.com/watch?v=62wEk02YKs0&pp=ygUIYmJjIG5ld3M%3D"
          value={url}
          onChange={handleInputChange}
          className="mb-4"
        />

        <Button type="submit" disabled={loading} className="relative">
          Summarize
        </Button>
      </form>
      {thumbnailUrl && (
        <div className="mt-4 mx-auto">
          <h3 className="text-lg mb-2 sr-only">Thumbnail</h3>
          <img
            src={thumbnailUrl}
            alt="YouTube Thumbnail"
            className="w-full h-auto max-w-md rounded"
          />
          {thumbnailTitle && (
            <div className="text-center text-xs mt-1">{thumbnailTitle}</div>
          )}
        </div>
      )}
      {loading && <Loader2 className="w-12 h-12 mx-auto mt-8 animate-spin" />}
      {summary && !loading && (
        <div className="mt-8 p-2 text-sm sm:text-base sm:p-4 border border-gray-300 rounded">
          <h2 className="text-xl mb-2">Summary</h2>
          <p>{summary}</p>
        </div>
      )}
    </main>
  );
}
