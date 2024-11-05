import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer>
      <Link
        href='https://github.com/adnjoo/fast-youtube-summary'
        className='flex w-full flex-col p-4 text-center text-sm hover:underline'
        target='_blank'
      >
        built by drew
        <Image
          src='/github-mark.svg'
          alt='GitHub Logo'
          width={20}
          height={20}
          className='mx-auto'
        />
      </Link>
    </footer>
  );
}
