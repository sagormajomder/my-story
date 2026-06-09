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
import { Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'react-hot-toast';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data) {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || 'Registration failed. Please try again.');
        return;
      }

      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  }

  return (
    <Card className='w-full shadow-xl border-border/50'>
      <CardHeader className='space-y-1 pb-6'>
        <div className='flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mx-auto mb-2'>
          <UserPlus size={22} className='text-primary' />
        </div>
        <CardTitle className='text-2xl font-bold text-center'>
          Create an account
        </CardTitle>
        <CardDescription className='text-center'>
          Join MyStory and start sharing your stories
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='space-y-4'>

          {/* Name */}
          <div className='space-y-1.5'>
            <Label htmlFor='register-name'>Full name</Label>
            <Input
              id='register-name'
              type='text'
              placeholder='John Doe'
              autoComplete='name'
              {...register('name')}
              className={
                errors.name
                  ? 'border-destructive focus-visible:ring-destructive'
                  : ''
              }
            />
            {errors.name && (
              <p className='text-xs text-destructive'>{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className='space-y-1.5'>
            <Label htmlFor='register-email'>Email address</Label>
            <Input
              id='register-email'
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
            <Label htmlFor='register-password'>Password</Label>
            <div className='relative'>
              <Input
                id='register-password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Min. 6 characters'
                autoComplete='new-password'
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

          {/* Confirm Password */}
          <div className='space-y-1.5'>
            <Label htmlFor='register-confirm'>Confirm password</Label>
            <div className='relative'>
              <Input
                id='register-confirm'
                type={showConfirm ? 'text' : 'password'}
                placeholder='Re-enter your password'
                autoComplete='new-password'
                {...register('confirmPassword')}
                className={`pr-10 ${errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              <button
                type='button'
                onClick={() => setShowConfirm(!showConfirm)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                aria-label='Toggle confirm password visibility'>
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className='text-xs text-destructive'>
                {errors.confirmPassword.message}
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
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>

          <p className='text-sm text-muted-foreground text-center'>
            Already have an account?{' '}
            <Link
              href='/login'
              className='text-primary font-medium hover:underline'>
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
