import LandingBody from "@/app/(landing)/LandingBody";
import { getThumbnail } from "@/lib/helpers";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";


async function getData(): Promise<Example[]> {
  const supabase = await createClient();

  // Fetch the latest 5 summaries (only URLs) from Supabase
  const { data, error } = await supabase
    .from('history')
    .select('url, title')
    .order('created_at', { ascending: false })
    .limit(7);

  if (error) {
    console.error("Error fetching summaries:", error);
    return [];
  }

  const summaries = await Promise.all(
    data.map(async ({ url, title}) => {
      const thumbnail = getThumbnail(url);
      return { url, thumbnail, title };
    })
  );
  return summaries;
}

export type Example = {
  url: string;
  thumbnail: string;
  title: string;
};

export default async function Home() {
  const data = await getData();
  return (
    <main className="flex flex-col py-4 sm:py-24">
      <h1 className="text-4xl font-bold text-center">SummaTube</h1>
      <Suspense fallback={null}>
        <LandingBody examples={data} />
      </Suspense>
    </main>
  );
}
