"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LandingBody() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: any) => {
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
    <main className="flex min-h-screen flex-col items-center  p-24">
      <h1 className="text-2xl mb-4">YouTube URL Summarizer</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col items-center"
      >
        <Input
          type="url"
          placeholder="Enter YouTube URL e.g. https://www.youtube.com/watch?v=62wEk02YKs0&pp=ygUIYmJjIG5ld3M%3D"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
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
      {summary && (
        <div className="mt-8 p-4 border border-gray-300 rounded">
          <h2 className="text-xl mb-2">Summary</h2>
          <p>{summary}</p>
        </div>
      )}
    </main>
  );
}
