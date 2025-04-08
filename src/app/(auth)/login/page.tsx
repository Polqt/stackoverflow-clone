'use client';

import { BorderBeam } from '@/components/magicui/border-beam';
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
import { useAuthStore } from '@/store/Auth';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Collect form data
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validate form data
    if (!email || !password) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    // Call the login function from the auth store
    setIsLoading(true);
    setError('');

    const response = await login(email.toString(), password.toString());

    if (response.error) {
      setError(() => response.error!.message);
      return;
    }
    setIsLoading(() => false);
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Card className="relative w-[350px] overflow-hidden">
        <CardHeader>
          <CardTitle>InquiHero</CardTitle>
          <CardDescription>Sign in to continue to InquiHero</CardDescription>
          {error && (
            <p className='text-red-500'>{error}</p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="poyhidalgo@example.com"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>
            </div>
          </form>
          <CardFooter className="flex flex-col justify-center mt-4">
            <Button variant={'outline'} className="w-full mb-4" disabled={isLoading} type='button'>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            <p className='text-slate-500 text-sm'>Don&apos;t have an account? <Link href={'/register'}>Sign up here!</Link></p>
            <BorderBeam duration={8} size={100} />
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}
