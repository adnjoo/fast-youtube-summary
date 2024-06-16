import LandingBody from "./LandingBody";

export default function Home() {
  return (
    <main className="flex flex-col p-4 sm:p-24">
      <h1 className="text-4xl font-bold text-center">Youtube Summarizer</h1>
      <LandingBody />
    </main>
  );
}
