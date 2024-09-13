"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { getThumbnail, getTitle } from "@/lib/utils";
import { Example } from "./page";

export default function LandingBody({ examples }: { examples: Example[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialUrl = searchParams.get("url") || "";

  const [url, setUrl] = useState(initialUrl);
  const [summary, setSummary] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoveredExample, setHoveredExample] = useState<Example | null>(null);
  const [showExamples, setShowExamples] = useState<boolean | undefined>(
    undefined
  );
  const [thumbnailTitle, setThumbnailTitle] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedValue = localStorage.getItem("showExamples");
    setShowExamples(storedValue ? Boolean(JSON.parse(storedValue)) : true);
  }, []);

  useEffect(() => {
    if (typeof showExamples === "boolean") {
      localStorage.setItem("showExamples", JSON.stringify(showExamples));
    }
  }, [showExamples]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (isValidYouTubeUrl(url)) {
      fetchThumbnail(url);
      getTitle(url).then((title) => {
        setThumbnailTitle(title);
      });

      // set query
      const params = new URLSearchParams();
      params.set("url", url);
      router.push(`?${params.toString()}`);

      // Run summarize function if URL is present
      handleSummarize(url);
    }
  }, [url]);

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
        ((hostname === "www.youtube.com" || hostname === "youtube.com") &&
          pathname === "/watch" &&
          searchParams.has("v")) ||
        (hostname === "youtu.be" && pathname.length > 1)
      );
    } catch (error) {
      return false;
    }
  };
  

  const fetchThumbnail = (videoUrl: string) => {
    const thumbnail = getThumbnail(videoUrl);
    setThumbnailUrl(thumbnail);
  };

  const handleSummarize = async (videoUrl: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/summarize?url=${encodeURIComponent(videoUrl)}`
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSummarize(url);
  };

  const handleThumbnailClick = async (exampleUrl: string) => {
    setUrl(exampleUrl);
    fetchThumbnail(exampleUrl);
    getTitle(exampleUrl).then((title) => {
      setThumbnailTitle(title);
    });

    handleSummarize(exampleUrl);
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
          ref={inputRef}
          className="mb-4"
        />

        <Button type="submit" disabled={loading} className="relative">
          Summarize
        </Button>
      </form>
      {thumbnailUrl && (
        <div className="mt-4 mx-auto max-w-md">
          <h3 className="text-lg mb-2 sr-only">Thumbnail</h3>
          <img
            src={thumbnailUrl}
            alt="YouTube Thumbnail"
            className="w-full h-auto rounded"
          />
          {thumbnailTitle && (
            <div className="text-center text-xs mt-1">{thumbnailTitle}</div>
          )}
        </div>
      )}
      {loading && <Loader2 className="w-12 h-12 mx-auto mt-8 animate-spin" />}
      {summary && !loading && (
        <div className="mt-8 p-2 mx-auto max-w-5xl text-sm sm:text-base sm:p-4 border border-gray-300 rounded">
          <h2 className="text-xl mb-2">Summary</h2>
          <p>{summary}</p>
        </div>
      )}
    </main>
  );
}
