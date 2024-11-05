/**
 * v0 by Vercel.
 * @see https://v0.dev/t/xYHqD5MkVkT
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Image from 'next/image';
import Link from 'next/link';

import AuthButton from './auth/AuthButton';

export const Nav = async () => {
  return (
    <nav className='fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-gray-950/90'>
      <div className='mx-auto w-full max-w-7xl px-4'>
        <div className='flex h-14 items-center justify-between'>
          <Link href='/' className='flex items-center' prefetch={false}>
            <Image
              src='/logo.png'
              alt='GitHub Logo'
              width={30}
              height={30}
              className='mx-auto'
            />
          </Link>
          <nav className='hidden gap-4 md:flex'>
            {/* <Link
              href='#'
              className='flex items-center text-sm font-medium transition-colors hover:underline'
              prefetch={false}
            >
              Home
            </Link> */}
          </nav>
          <div className='flex items-center gap-4'>
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
};
