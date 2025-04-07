'use client';

import { useAuthStore } from '@/store/Auth';
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
    <div className="">
      <div className="">
        <h1>Login in InquiHero</h1>
        <p></p>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
