import { Dock, DockIcon } from '@/components/magicui/dock';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/Auth';
import { slugify } from '@/utils/slugify';
import { IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react';
import {
  CircleHelp,
  CircleUserRound,
  HomeIcon,
  LogInIcon,
  UserPlus,
} from 'lucide-react';
import Link from 'next/link';

export default function DockComponent() {
  const { user } = useAuthStore();

  const Navigation = {
    navbar: [
      { href: '/', icon: HomeIcon, label: 'Home' },
      { href: '/register', icon: UserPlus, label: 'Register' },
      { href: '/question', icon: CircleHelp, label: 'Question' },
      { href: '/login', icon: LogInIcon, label: 'Login' },
      { href: '/logout', icon: LogInIcon, label: 'Logout' },
    ],
    contact: {
      social: {
        Github: {
          name: 'GitHub',
          url: 'https://github.com/Polqt/stackoverflow-clone',
          icon: IconBrandGithub,
        },
        LinkedIn: {
          name: 'LinkedIn',
          url: 'https://www.linkedin.com/in/janpol-hidalgo-64174a241/',
          icon: IconBrandLinkedin,
        },
      },
    },
  };

  if (user) {
    Navigation.navbar.push({
      href: `/users/${user.$id}/${slugify(user.name)}`,
      icon: CircleUserRound,
      label: 'Profile',
    });
  }

  return (
    <TooltipProvider>
      <Dock direction="middle">
        {Navigation.navbar.map(item => (
          <DockIcon key={item.label}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  aria-label={item.label}
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'icon' }),
                    'size-12 rounded-full',
                  )}
                >
                  <item.icon className="size-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        ))}
        <Separator orientation="vertical" className="h-full" />
        {Object.entries(Navigation.contact.social).map(([name, social]) => (
          <DockIcon key={name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={social.url}
                  aria-label={social.name}
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'icon' }),
                    'size-12 rounded-full',
                  )}
                >
                  <social.icon className="size-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{social.name}</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        ))}
      </Dock>
    </TooltipProvider>
  );
}
