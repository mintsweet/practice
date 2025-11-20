import { useHotkeys } from '@mints/hooks';
import { operator } from '@mints/request';
import { Button, Input, Callout } from '@mints/ui';
import { useState } from 'react';
import { Link } from 'react-router';

// import API from '@/api';
import { Logo } from '@/components';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [operating, setOperating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');

    // TODO: Implement forgot password API call
    const [success] = await operator(
      async () => {
        // API.auth.forgotPassword({ email })
        // Simulate API call for now
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { status: 'OK' };
      },
      {
        setOperating,
      },
    );

    if (success) {
      setSuccess(true);
    }
  };

  useHotkeys('enter', () => {
    if (!success) {
      handleSubmit();
    }
  });

  if (success) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 overflow-hidden">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16">
              <Logo />
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">
              Check Your Email
            </h1>
            <p className="text-sm text-zinc-600">
              We&apos;ve sent password reset instructions to your email
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 p-8 space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">📧</div>
              <p className="text-sm text-zinc-600 mb-6">
                Please check your inbox and follow the link to reset your
                password. If you don&apos;t see the email, check your spam
                folder.
              </p>
              <Link to="/signin" className="block">
                <Button className="w-full">Back to Sign In</Button>
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-zinc-500 mt-6">
            Didn&apos;t receive the email?{' '}
            <button
              onClick={() => setSuccess(false)}
              className="underline hover:text-zinc-700"
            >
              Try again
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 overflow-hidden">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">
            Forgot Password?
          </h1>
          <p className="text-sm text-zinc-600">
            No worries, we&apos;ll send you reset instructions
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />

            <Button type="submit" className="w-full" disabled={operating}>
              {operating ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-zinc-500">
                Remember your password?
              </span>
            </div>
          </div>

          <Link to="/signin" className="block">
            <Button variant="outline" className="w-full">
              Back to Sign In
            </Button>
          </Link>
        </form>

        <p className="text-center text-xs text-zinc-500 mt-6">
          Need help?{' '}
          <Link to="/help" className="underline hover:text-zinc-700">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}
