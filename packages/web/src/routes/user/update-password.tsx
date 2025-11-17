import { Input, Button, Callout } from '@mints/ui';
import { useState } from 'react';
import { Link } from 'react-router';

import { useAuth } from '@/auth-context';

export function UserUpdatePassword() {
  const { user } = useAuth();
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100">
        <div className="text-center space-y-4 bg-white rounded-2xl shadow-xl border border-zinc-200 p-8 max-w-md">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-zinc-900">Sign In Required</h2>
          <p className="text-sm text-zinc-600">
            Please sign in to access your settings
          </p>
          <Link to="/signin">
            <Button className="w-full mt-4">Sign In Now</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const passwordPattern =
      /^(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)[\w~!@#$%^&*?]{6,18}$/;

    if (!oldPass) {
      setError('Current password is required');
      return;
    }

    if (!newPass || !passwordPattern.test(newPass)) {
      setError(
        'Password must be 6-18 characters with at least 2 of: letters, numbers, special characters',
      );
      return;
    }

    if (newPass !== confirmPass) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    console.log({ oldPass, newPass });
  };

  return (
    <div className="bg-zinc-50 flex-1">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">
            Account Settings
          </h1>
          <p className="text-sm text-zinc-600">
            Manage your profile and account preferences
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
          <div className="flex gap-6 px-6 pt-4 pb-3 border-b border-zinc-200 text-sm font-medium">
            <Link
              to="/user/setting"
              className="text-zinc-600 hover:text-zinc-900 pb-2"
            >
              Profile
            </Link>
            <Link
              to="/user/update-password"
              className="text-zinc-900 border-b-2 border-zinc-900 pb-2 -mb-[1px]"
            >
              Password
            </Link>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Callout variant="danger" className="text-sm">
                  {error}
                </Callout>
              )}

              <Input
                label={
                  <span className="w-full flex justify-between items-center">
                    <span>Current Password</span>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-zinc-600 hover:text-zinc-900 transition"
                    >
                      Forgot password?
                    </Link>
                  </span>
                }
                id="oldPass"
                type="password"
                placeholder="Enter your current password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
              />

              <Input
                label="New Password"
                id="newPass"
                type="password"
                placeholder="Enter your new password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />

              <Input
                label="Confirm New Password"
                id="confirmPass"
                type="password"
                placeholder="Confirm your new password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
              />

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Update Password
                </Button>
                <Link to="/user/setting" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
