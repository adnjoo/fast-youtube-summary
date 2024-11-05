import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    'use server';

    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect('/login');
  };

  return user ? (
    <div className='flex items-center gap-4'>
      <span className='hidden md:block'>Hey, {user.user_metadata.name}!</span>
      <form action={signOut}>
        <Button className='' variant='default'>
          Logout
        </Button>
      </form>
    </div>
  ) : (
    <Button asChild>
      <Link
        href='/login'
        className='bg-btn-background hover:bg-btn-background-hover flex rounded-md px-4 py-2 no-underline'
      >
        Login
      </Link>
    </Button>
  );
}
