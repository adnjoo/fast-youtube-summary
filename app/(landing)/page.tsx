import LandingBody from "@/app/(landing)/LandingBody";
import { getTitle, getThumbnail } from "@/lib/utils";

const examples = [
  "https://www.youtube.com/watch?v=ciW1ppBdkRc",
  "https://www.youtube.com/watch?v=KlFXl--H8eM",
  "https://www.youtube.com/watch?v=YpZff07df-Q",
  "https://www.youtube.com/watch?v=62wEk02YKs0",
  "https://www.youtube.com/watch?v=YCzL96nL7j0",
];

async function getData(): Promise<Example[]> {
  const data = await Promise.all(
    examples.map(async (url) => {
      const thumbnail = getThumbnail(url);
      const title = await getTitle(url);
      return { url, thumbnail, title };
    })
  );
  return data;
}

export type Example = {
  url: string;
  thumbnail: string;
  title: string;
};

export default async function Home() {
  const data = await getData();
  return (
    <main className="flex flex-col p-4 sm:p-24">
      <h1 className="text-4xl font-bold text-center">Fast Youtube Summary</h1>
      <LandingBody examples={data} />
    </main>
  );
}
