import LandingBody from "@/app/(landing)/LandingBody";
import { getTitle, getThumbnail } from "@/lib/helpers";
import { createClient } from "@/utils/supabase/client";
import { Suspense } from "react";

export type Example = {
  url: string;
  thumbnail: string;
  title: string;
};

async function getData(): Promise<Example[]> {
  const supabase = createClient();

  // Fetch the latest 5 summaries (only URLs) from Supabase
  const { data, error } = await supabase
    .from('history')
    .select('url')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching summaries:", error);
    return [];
  }

  // Fetch thumbnail and title for each URL
  const summaries = await Promise.all(
    data.map(async ({ url }) => {
      const thumbnail = getThumbnail(url);
      const title = await getTitle(url);
      return { url, thumbnail, title };
    })
  );

  return summaries;
}

export default async function Home() {
  const data = await getData();
  return (
    <main className="flex flex-col py-4 sm:py-24">
      <h1 className="text-4xl font-bold text-center">Fast Youtube Summary</h1>
      <Suspense fallback={null}>
        <LandingBody examples={data} />
      </Suspense>
    </main>
  );
}
