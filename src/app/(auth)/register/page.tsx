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
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const { createAccount, login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Collect form data
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validate form data
    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    // Call the createAccount function from the auth store
    setIsLoading(true);
    setError('');

    const response = await createAccount(
      `${firstName} ${lastName}`,
      email.toString(),
      password.toString(),
    );

    if (response.error) {
      setError(() => response.error!.message);
    } else {
      const loginResponse = await login(email.toString(), password.toString());
      router.push('/login');

      if (loginResponse.error) {
        setError(() => loginResponse.error!.message);
      }
    }

    setIsLoading(() => false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Card className="relative w-[350px] overflow-hidden">
        <CardHeader>
          <CardTitle>Join the Community</CardTitle>
          <CardDescription>
            Create an account to join the community
          </CardDescription>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid w-full items-center gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1 space-y-1.5">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Jepoy"
                  />
                </div>
                <div className="col-span-1 space-y-1.5">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Hidalgo"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="poyhidalgo@example.com"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" />
              </div>
            </div>

            <Button
              variant={'outline'}
              className="w-full mb-4"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? 'Signing up...' : 'Sign up'}
            </Button>
          </form>
          <CardFooter className="flex flex-col justify-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <Link href={'/login'}>Sign in here!</Link>
            </p>
            <BorderBeam duration={8} size={100} />
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}
