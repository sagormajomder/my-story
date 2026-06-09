'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, startTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { loginAction } from '@/actions/auth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data) {
    try {
      const res = await loginAction(data);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success('Login successful!');
      startTransition(() => {
        router.push('/dashboard');
        router.refresh();
      });
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  }

  return (
    <Card className='w-full shadow-xl border-border/50'>
      <CardHeader className='space-y-1 pb-6'>
        <div className='flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mx-auto mb-2'>
          <LogIn size={22} className='text-primary' />
        </div>
        <CardTitle className='text-2xl font-bold text-center'>
          Welcome back
        </CardTitle>
        <CardDescription className='text-center'>
          Sign in to your MyStory account
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='space-y-4'>

          {/* Email */}
          <div className='space-y-1.5'>
            <Label htmlFor='login-email'>Email address</Label>
            <Input
              id='login-email'
              type='email'
              placeholder='you@example.com'
              autoComplete='email'
              {...register('email')}
              className={
                errors.email
                  ? 'border-destructive focus-visible:ring-destructive'
                  : ''
              }
            />
            {errors.email && (
              <p className='text-xs text-destructive'>{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className='space-y-1.5'>
            <Label htmlFor='login-password'>Password</Label>
            <div className='relative'>
              <Input
                id='login-password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your password'
                autoComplete='current-password'
                {...register('password')}
                className={`pr-10 ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                aria-label='Toggle password visibility'>
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && (
              <p className='text-xs text-destructive'>
                {errors.password.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className='flex flex-col gap-4 mt-4'>
          <Button
            type='submit'
            className='w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20'
            disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 size={15} className='mr-2 animate-spin' />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          <p className='text-sm text-muted-foreground text-center'>
            Don&apos;t have an account?{' '}
            <Link
              href='/register'
              className='text-primary font-medium hover:underline'>
              Create one
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
