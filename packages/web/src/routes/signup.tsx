import { useHotkeys } from '@mints/hooks';
import { operator } from '@mints/request';
import { Button, Input, Callout } from '@mints/ui';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router';

import API from '@/api';
import { Logo } from '@/components/logo';

export function Signup() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    nickname: '',
  });
  const [operating, setOperating] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!form.nickname) {
      setError('Please enter your name');
      return;
    }
    if (!form.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    const [success] = await operator(() => API.auth.signup(form), {
      setOperating,
    });

    if (success) {
      navigate('/signin');
    }
  };

  useHotkeys('enter', () => {
    handleSubmit();
  });

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 overflow-hidden">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">
            Create an Account
          </h1>
          <p className="text-sm text-zinc-600">
            Join Mints Community and start sharing
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
              label="Nickname"
              type="text"
              placeholder="Your nickname"
              value={form.nickname}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, nickname: e.target.value }))
              }
              autoComplete="name"
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              autoComplete="email"
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              autoComplete="new-password"
              required
            />

            <Button type="submit" className="w-full" disabled={operating}>
              {operating ? 'Creating account...' : 'Sign Up'}
            </Button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-gradient-to-br from-zinc-50 to-zinc-100 text-zinc-500">
                Already have an account?
              </span>
            </div>
          </div>

          <Link to="/signin" className="block">
            <Button variant="outline" className="w-full">
              Sign In
            </Button>
          </Link>
        </form>

        <p className="text-center text-xs text-zinc-500 mt-6">
          By signing up, you agree to our{' '}
          <Link
            to="/terms"
            className="underline hover:text-zinc-700 transition"
          >
            Terms
          </Link>{' '}
          and{' '}
          <Link
            to="/privacy"
            className="underline hover:text-zinc-700 transition"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
