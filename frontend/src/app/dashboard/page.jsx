import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getValidPayload } from '@/lib/auth';
import { BookOpen, MessageSquare, PenLine, Shield, ShieldCheck, Users, User } from 'lucide-react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PostManager from '@/components/dashboard/PostManager';
import AdminManager from '@/components/dashboard/AdminManager';

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
  description: 'Manage your stories and comments.',
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/login');
  }

  const payload = getValidPayload(token);
  if (!payload) {
    redirect('/login');
  }

  const role = payload.role;

  const roleConfig = {
    super_admin: {
      label: 'Super Admin',
      color: 'bg-red-500/10 text-red-500 border-red-500/20',
      icon: ShieldCheck,
      description: 'Full access to delete anything in the system.',
      capabilities: [
        'Create & manage posts',
        'Delete any post or comment',
        'Manage all users',
        'Full system access',
      ],
    },
    moderator: {
      label: 'Moderator',
      color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      icon: ShieldCheck,
      description: 'Can delete any post or comment, but cannot manage users.',
      capabilities: [
        'Create & manage posts',
        'Delete any post or comment',
        'Community moderation',
      ],
    },
    user: {
      label: 'Author',
      color: 'bg-green-500/10 text-green-500 border-green-500/20',
      icon: PenLine,
      description: 'Can create posts and comments. Can only edit or delete your own content.',
      capabilities: [
        'Create posts',
        'Comment on posts',
        'Edit/delete own content',
      ],
    },
    guest: {
      label: 'Guest',
      color: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
      icon: User,
      description: 'Read-only access. Can view all posts and comments.',
      capabilities: ['View all posts', 'View all comments'],
    },
  };

  const config = roleConfig[role] || roleConfig.guest;
  const Icon = config.icon;

  let totalPosts = 0;
  let totalComments = 0;
  let myPosts = [];
  
  // Admin Data
  let adminUsers = [];
  let adminPosts = [];
  let adminComments = [];

  if (role !== 'guest') {
    try {
      const [postsRes, commentsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/my`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store'
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/my/count`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store'
        })
      ]);

      if (postsRes.ok) {
        const postsData = await postsRes.json();
        myPosts = postsData.data || [];
        totalPosts = postsData.meta?.total || myPosts.length;
      }
      
      if (commentsRes.ok) {
        const commentsData = await commentsRes.json();
        totalComments = commentsData.count || 0;
      }

      // Fetch admin data if super_admin or moderator
      if (role === 'super_admin' || role === 'moderator') {
        const adminPromises = [];
        
        if (role === 'super_admin') {
          adminPromises.push(
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
              .then(res => res.ok ? res.json() : { data: [] })
              .then(data => { adminUsers = data.data || []; })
          );
        }

        adminPromises.push(
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/posts`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
            .then(res => res.ok ? res.json() : { data: [] })
            .then(data => { adminPosts = data.data || []; })
        );

        adminPromises.push(
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/comments`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
            .then(res => res.ok ? res.json() : { data: [] })
            .then(data => { adminComments = data.data || []; })
        );

        await Promise.all(adminPromises);
      }
    } catch (e) {
      console.error('Failed to fetch dashboard stats:', e);
    }
  }

  const quickStats = [
    {
      label: 'Posts Written',
      value: totalPosts.toString(),
      icon: PenLine,
      color: 'text-violet-500',
      bg: 'bg-violet-50',
    },
    {
      label: 'Comments Made',
      value: totalComments.toString(),
      icon: MessageSquare,
      color: 'text-pink-500',
      bg: 'bg-pink-50',
    },
  ];

  return (
    <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      {/* Welcome Banner */}
      <div className='relative overflow-hidden rounded-2xl bg-linear-to-r from-violet-600 via-purple-600 to-pink-600 p-8 mb-8 text-white shadow-lg'>
        <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl' />
        <div className='relative'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-lg border border-white/30'>
              {payload.userId?.slice(-2).toUpperCase() || 'U'}
            </div>
            <div>
              <p className='text-white/80 text-sm font-medium'>Welcome back</p>
              <h1 className='text-3xl font-bold tracking-tight'>My Dashboard</h1>
            </div>
          </div>
          <Badge className={`${config.color} border font-semibold text-xs py-1 px-3 mt-2 shadow-sm`}>
            <Icon size={12} className='mr-1.5' />
            {config.label}
          </Badge>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        {quickStats.map(({ label, value, icon: StatIcon, color, bg }) => (
          <Card
            key={label}
            className='border-border hover:border-primary/30 hover:shadow-md transition-all'>
            <CardContent className='p-6 flex items-center gap-4'>
              <div className={`${bg} ${color} p-3 rounded-xl shadow-sm`}>
                <StatIcon size={20} />
              </div>
              <div>
                <p className='text-3xl font-bold tracking-tight'>{value}</p>
                <p className='text-sm font-medium text-muted-foreground'>{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role Info & Management Wrappers */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* Render Admin Manager exclusively for super_admin and moderator */}
        {(role === 'super_admin' || role === 'moderator') && (
          <AdminManager 
            initialUsers={adminUsers} 
            initialPosts={adminPosts} 
            initialComments={adminComments} 
            currentUserId={payload.userId} 
            userRole={role}
          />
        )}

        {/* PostManager for regular users */}
        {role === 'user' && <PostManager initialPosts={myPosts} />}

        <Card className='border-border shadow-sm'>
          <CardHeader className="pb-4">
            <CardTitle className='flex items-center gap-2 text-lg'>
              <Icon size={18} className='text-primary' />
              Your Role & Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground text-sm mb-5 font-medium'>
              {config.description}
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              {config.capabilities.map(cap => (
                <div key={cap} className='flex items-center gap-2.5 text-sm p-2 rounded-lg bg-muted/40'>
                  <div className='w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0'>
                    <span className='w-1.5 h-1.5 rounded-full bg-primary' />
                  </div>
                  <span className="font-medium">{cap}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
