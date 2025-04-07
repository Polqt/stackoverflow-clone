'use client';

import { useAuthStore } from '@/store/Auth';
import { useState } from 'react';

export default function RegisterPage() {
  const { createAccount, login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Collect form data
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firtName') as string;
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

      if (loginResponse.error) {
        setError(() => loginResponse.error!.message);
      }
    }

    setIsLoading(() => false);
  };

  return (
    <div>
      <div>
        {' '}
        <h1>Register</h1>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}
