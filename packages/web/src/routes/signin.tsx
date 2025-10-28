import { useHotkeys } from '@mints/hooks';
import { operator } from '@mints/request';
import { Button, Input, Callout } from '@mints/ui';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router';

import API from '@/api';

export function Signin() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [operating, setOperating] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!form.email || !form.password) {
      setError('Please enter your email and password');
      return;
    }

    const [success] = await operator(() => API.auth.signin(form), {
      setOperating,
    });

    if (success) {
      navigate('/', { replace: true });
    }
  };

  useHotkeys('enter', () => {
    handleSubmit();
  });

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 overflow-hidden">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16">
            <img src="/logo.svg" alt="Logo" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-zinc-600">
            Sign in to continue to Mints Community
          </p>
        </div>

        <form
          className="bg-white rounded-2xl shadow-xl border border-zinc-200 p-8 space-y-6"
          onSubmit={handleSubmit}
        >
          {error && (
            <Callout variant="danger" className="text-sm">
              {error}
            </Callout>
          )}

          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
            />

            <Input
              label={
                <span className="w-full flex justify-between items-center">
                  <span>Password</span>
                  <Link
                    to="/forgot-password"
                    tabIndex={-1}
                    className="text-xs text-zinc-600 hover:text-zinc-900 transition"
                  >
                    Forgot password?
                  </Link>
                </span>
              }
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
            />

            <Button type="submit" className="w-full" disabled={operating}>
              {operating ? 'Signing in...' : 'Sign In'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-zinc-500">New to Mints?</span>
            </div>
          </div>

          <Link to="/signup" className="block">
            <Button variant="outline" className="w-full">
              Create an Account
            </Button>
          </Link>
        </form>

        <p className="text-center text-xs text-zinc-500 mt-6">
          By signing in, you agree to our{' '}
          <Link to="/terms" className="underline hover:text-zinc-700">
            Terms
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="underline hover:text-zinc-700">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
