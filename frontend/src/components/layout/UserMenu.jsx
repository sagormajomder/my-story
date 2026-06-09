'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { startTransition } from 'react';

import { logoutAction } from '@/actions/auth';

const roleLabelMap = {
  super_admin: { label: 'Super Admin', color: 'bg-red-100 text-red-700' },
  moderator: { label: 'Moderator', color: 'bg-yellow-100 text-yellow-700' },
  user: { label: 'User', color: 'bg-violet-100 text-violet-700' },
  guest: { label: 'Guest', color: 'bg-gray-100 text-gray-700' },
};

export default function UserMenu({ user }) {
  const router = useRouter();
  const roleInfo = roleLabelMap[user?.role] || roleLabelMap.user;
  const initials = user?.userId?.slice(0, 2).toUpperCase() || 'U';

  async function handleSignOut() {
    await logoutAction();
    startTransition(() => {
      router.push('/');
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='focus:outline-none group' aria-label='User menu'>
          <Avatar className='w-9 h-9 cursor-pointer ring-2 ring-transparent group-hover:ring-primary transition-all'>
            <AvatarFallback className='bg-linear-to-br from-violet-500 to-pink-500 text-white font-semibold text-sm'>
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuGroup>
          <DropdownMenuLabel className='pb-1'>
            <div className='flex flex-col gap-1'>
              <div className='flex items-center gap-2'>
                <User size={14} className='text-muted-foreground' />
                <span className='text-sm font-medium truncate'>
                  {user?.userId
                    ? `User ${user.userId.slice(-4)}`
                    : 'My Account'}
                </span>
              </div>
              <Badge
                className={`w-fit text-xs font-medium px-2 py-0.5 rounded-full ${roleInfo.color} border-0`}>
                {roleInfo.label}
              </Badge>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className='text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer gap-2'>
          <LogOut size={14} />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
