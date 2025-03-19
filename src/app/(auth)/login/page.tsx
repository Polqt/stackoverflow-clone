'use client';

import { useAuthStore } from '@/store/Auth';
import { FormEvent, useState } from 'react';

export default function LoginPage() {
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
    }

    setIsLoading(() => false);
  };

  // TODO: Design the UI
  return (
    <div>
      <h2>Stackover Flow Clone</h2>
    </div>
  );
}
