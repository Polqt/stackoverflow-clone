'use client';

import { useAuthStore } from '@/store/Auth';
import React, { FormEvent, useState } from 'react';

export default function RegisterPage() {
  const { createAccount, login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Collect form data
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('first_name');
    const lastName = formData.get('last_name');
    const email = formData.get('email');
    const password = formData.get('password');

    // Validate form data
    if (!firstName || !lastName || !email || !password) {
      setError(() => 'Please fill out all fields');
      return;
    }

    // Call the store
    setIsLoading(true);
    setError('');

    const response = await createAccount(
      `${firstName} ${lastName}`,
      email?.toString(),
      password?.toString(),
    );

    if (response.error) {
      setError(() => response.error!.message);
    } else {
      const loginResponse = await login(email.toString(), password.toString());

      if (loginResponse.error) {
        setError(() => loginResponse.error!.message);
      }
    }

    setIsLoading(false);
  };

  // TODO: Design the UI
  return (
    <div>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}></form>
    </div>
  );
}
