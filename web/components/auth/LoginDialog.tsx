'use client';

import Link from 'next/link';

import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useUser } from '@/lib/hooks/useUser';
import { createClient } from '@/utils/supabase/client';

export default function LoginDialog() {
  const supabase = createClient();
  const user = useUser();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error('Google login failed:', error);
    }
  };

  return (
    <div>
      {user ? (
        <p>Welcome, {user.email}</p>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='outline'>Sign In</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sign In</DialogTitle>
              <DialogDescription>
                Sign in with your Google account to continue.
              </DialogDescription>
            </DialogHeader>
            <div className='my-4 flex justify-center'>
              <Button
                onClick={handleGoogleLogin}
                variant='outline'
                className='flex w-full items-center justify-center space-x-2'
              >
                <GoogleIcon className='h-6 w-6' />
                <span>Sign In with Google</span>
              </Button>
            </div>
            <DialogFooter>
              <Link
                href='/policies/terms'
                target='_blank'
                className='hover:underline'
              >
                By signing in, you agree to our terms and conditions.
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
