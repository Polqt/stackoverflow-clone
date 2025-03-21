'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/Auth';
import { IconBrandGithub, IconBrandGoogle } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('flex w-full flex-col space-y-2', className)}>
      {children}
    </div>
  );
};

export default function LoginPage() {
  const router = useRouter()

  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Collect Data
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    // Validate Data
    if (!email || !password) {
      setError(() => 'Please fill out all fields');
      return;
    }

    setIsLoading(() => true);
    setError('');

    // Login
    const loginResponse = await login(email.toString(), password.toString());

    if (loginResponse.error) {
      setError(() => loginResponse.error!.message);
    } else {
      router.push('/')
    }

    setIsLoading(() => false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-amber-500/20 bg-zinc-900 shadow-xl">
        <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-amber-600" />
        <div className="p-6 sm:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-amber-400">
              Login to Stackoverflow Clone
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Access your account or{' '}
              <Link
                href="/register"
                className="text-amber-400 hover:text-amber-300 transition-colors"
              >
                create a new one
              </Link>{' '}
              to get started
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-md bg-red-900/20 p-3 text-sm text-red-400 border border-red-900/50">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <LabelInputContainer>
              <Label htmlFor="email" className="text-zinc-300">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                placeholder="poyhidalgo@email.com"
                type="email"
                className="border-zinc-700 bg-zinc-800 text-zinc-100 focus:border-amber-500 focus:ring-amber-500/20"
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <div className="flex justify-between">
                <Label htmlFor="password" className="text-zinc-300">
                  Password
                </Label>
              </div>
              <Input
                id="password"
                name="password"
                placeholder="••••••••"
                type="password"
                className="border-zinc-700 bg-zinc-800 text-zinc-100 focus:border-amber-500 focus:ring-amber-500/20"
              />
            </LabelInputContainer>

            <button
              className="group/btn relative mt-2 flex h-11 w-full items-center justify-center rounded-md bg-gradient-to-r from-amber-500 to-amber-600 font-medium text-black transition-all hover:from-amber-400 hover:to-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-70"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Logging in...</span>
                </span>
              ) : (
                <span>Sign In</span>
              )}
            </button>

            <div className="relative mt-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-700" />
              </div>
              <div className="relative">
                <span className="bg-zinc-900 px-4 text-xs text-zinc-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                className="group/btn relative flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-700 bg-zinc-800 px-4 transition-colors hover:bg-zinc-700"
                type="button"
                disabled={isLoading}
              >
                <IconBrandGoogle className="h-4 w-4 text-zinc-300" />
                <span className="text-sm text-zinc-300">Google</span>
              </button>
              <button
                className="group/btn relative flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-700 bg-zinc-800 px-4 transition-colors hover:bg-zinc-700"
                type="button"
                disabled={isLoading}
              >
                <IconBrandGithub className="h-4 w-4 text-zinc-300" />
                <span className="text-sm text-zinc-300">GitHub</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
