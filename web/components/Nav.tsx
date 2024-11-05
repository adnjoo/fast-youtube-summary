/**
 * v0 by Vercel.
 * @see https://v0.dev/t/xYHqD5MkVkT
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import LoginDialog from '@/components/auth/LoginDialog';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';

export const Nav = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    'use server';

    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect('/');
  };

  return (
    <nav className='fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-gray-950/90'>
      <div className='mx-auto w-full max-w-7xl px-4'>
        <div className='flex h-14 items-center justify-between'>
          <Link href='/' className='flex items-center' prefetch={false}>
            <Image
              src='/logo.png'
              alt='Logo'
              width={30}
              height={30}
              className='mx-auto'
            />
          </Link>
          <nav className='hidden gap-4 md:flex'></nav>
          <div className='flex items-center gap-4'>
            {user ? (
              <div className='flex items-center gap-4'>
                <span className='hidden md:block'>Hey, {user.email}!</span>
                <form action={signOut}>
                  <Button variant='default'>Logout</Button>
                </form>
              </div>
            ) : (
              <LoginDialog />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
