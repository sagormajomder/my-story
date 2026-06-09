import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getValidPayload } from '@/lib/auth';
import { BookOpen, MessageSquare, PenLine, Shield, Users } from 'lucide-react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Dashboard — MyStory',
  description: 'Manage your stories, comments, and account settings.',
};

const roleConfig = {
  super_admin: {
    label: 'Super Admin',
    description: 'Full access to delete anything in the system.',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: Shield,
    capabilities: [
      'Create & manage posts',
      'Delete any post or comment',
      'Manage all users',
      'Full system access',
    ],
  },
  moderator: {
    label: 'Moderator',
    description: 'Can delete any post or comment, but cannot manage users.',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: Users,
    capabilities: [
      'Create & manage posts',
      'Delete any post or comment',
      'Community moderation',
    ],
  },
  user: {
    label: 'Regular User',
    description:
      'Can create posts and comments. Can only edit or delete your own content.',
    color: 'bg-violet-100 text-violet-700 border-violet-200',
    icon: PenLine,
    capabilities: [
      'Create posts',
      'Comment on posts',
      'Edit/delete own content',
    ],
  },
  guest: {
    label: 'Guest',
    description: 'Read-only access. Can view all posts and comments.',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: BookOpen,
    capabilities: ['View all posts', 'View all comments'],
  },
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) redirect('/login');

  const payload = getValidPayload(token);
  if (!payload) redirect('/login');

  const role = payload.role || 'user';
  const config = roleConfig[role] || roleConfig.user;
  const Icon = config.icon;

  const quickStats = [
    {
      label: 'Posts Written',
      value: '0',
      icon: PenLine,
      color: 'text-violet-500',
      bg: 'bg-violet-50',
    },
    {
      label: 'Comments Made',
      value: '0',
      icon: MessageSquare,
      color: 'text-pink-500',
      bg: 'bg-pink-50',
    },
    {
      label: 'Total Reads',
      value: '0',
      icon: BookOpen,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
  ];

  return (
    <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      {/* Welcome Banner */}
      <div className='relative overflow-hidden rounded-2xl bg-linear-to-r from-violet-600 via-purple-600 to-pink-600 p-8 mb-8 text-white'>
        <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl' />
        <div className='relative'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-lg'>
              {payload.userId?.slice(-2).toUpperCase() || 'U'}
            </div>
            <div>
              <p className='text-white/70 text-sm'>Welcome back</p>
              <h1 className='text-2xl font-bold'>My Dashboard</h1>
            </div>
          </div>
          <Badge className={`${config.color} border font-medium text-xs`}>
            <Icon size={11} className='mr-1' />
            {config.label}
          </Badge>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        {quickStats.map(({ label, value, icon: StatIcon, color, bg }) => (
          <Card
            key={label}
            className='border-border hover:border-primary/30 hover:shadow-md transition-all'>
            <CardContent className='p-6 flex items-center gap-4'>
              <div className={`${bg} ${color} p-3 rounded-xl`}>
                <StatIcon size={20} />
              </div>
              <div>
                <p className='text-2xl font-bold'>{value}</p>
                <p className='text-sm text-muted-foreground'>{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role Info */}
      <Card className='border-border'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <Icon size={18} className='text-primary' />
            Your Role & Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground text-sm mb-4'>
            {config.description}
          </p>
          <ul className='space-y-2'>
            {config.capabilities.map(cap => (
              <li key={cap} className='flex items-center gap-2 text-sm'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary shrink-0' />
                {cap}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
