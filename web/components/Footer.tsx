import Link from 'next/link';
import { FaGithub, FaXTwitter } from 'react-icons/fa6';

import { Separator } from '@/components/ui/separator';
import { AppConfig } from '@/lib/constants';

export function Footer() {
  return (
    <footer className='w-full bg-background py-6'>
      <div className='container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row md:py-0'>
        <div className='flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0'>
          <p className='text-center text-sm leading-loose text-muted-foreground md:text-left'>
            © {new Date().getFullYear()} {AppConfig.APP_NAME}. All rights
            reserved.
          </p>
        </div>
        <nav className='flex items-center space-x-4 text-sm font-medium'>
          <Link
            href={AppConfig.SOCIAL.GITHUB}
            target='_blank'
            className='flex flex-row gap-1 text-muted-foreground hover:text-foreground'
          >
            <FaGithub className='h-5 w-5' />
          </Link>
          <Separator orientation='vertical' className='h-4' />
          <Link
            href={AppConfig.SOCIAL.X}
            target='_blank'
            className='flex flex-row gap-1 text-muted-foreground hover:text-foreground'
          >
            <FaXTwitter className='h-5 w-5' />
          </Link>
          <Separator orientation='vertical' className='h-4' />
          <Link
            href={AppConfig.SITE_MAP.PRIVACY}
            className='text-muted-foreground hover:text-foreground'
          >
            Privacy
          </Link>
          <Separator orientation='vertical' className='h-4' />
          <Link
            href={AppConfig.SITE_MAP.TERMS}
            className='text-muted-foreground hover:text-foreground'
          >
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
