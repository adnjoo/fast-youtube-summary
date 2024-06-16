import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer p-4 text-center text-sm fixed bottom-0 w-full">
      <Link href="https://github.com/adnjoo/youtube-summarizer">
        built by drew
      </Link>
    </footer>
  );
}
