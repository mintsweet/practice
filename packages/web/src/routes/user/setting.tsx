import { Avatar, Input, Button } from '@mints/ui';
import { Link } from 'react-router';

import { useAuth } from '@/auth-context';

export function UserSetting() {
  const { user } = useAuth();

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

  const { email, avatar, nickname, location, signature } = user;

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
              className="text-zinc-900 border-b-2 border-zinc-900 pb-2 -mb-[1px]"
            >
              Profile
            </Link>
            <Link
              to="/user/update-password"
              className="text-zinc-600 hover:text-zinc-900 pb-2"
            >
              Password
            </Link>
          </div>

          <div className="p-6">
            <form className="space-y-6">
              <div className="space-y-4">
                <label
                  htmlFor="file"
                  className="block text-sm font-medium text-zinc-900"
                >
                  Avatar
                </label>
                <div className="flex items-center gap-6">
                  <Avatar
                    src={avatar}
                    name={nickname ?? email}
                    className="w-24 h-24 ring-4 ring-zinc-100"
                  />
                  <div className="flex-1 space-y-3">
                    <input
                      id="file"
                      type="file"
                      name="file"
                      className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-zinc-900 file:text-white hover:file:bg-zinc-800 file:cursor-pointer"
                    />
                    <p className="text-xs text-zinc-500">JPG, PNG up to 1MB</p>
                  </div>
                </div>
              </div>

              <Input
                label="Email Address"
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                disabled
              />

              <Input
                label="Nickname"
                id="nickname"
                placeholder="Enter your nickname"
                value={nickname}
              />

              <Input
                label="Location"
                id="location"
                placeholder="Enter your location"
                value={location}
              />

              <Input
                label="Bio"
                id="signature"
                placeholder="Tell us about yourself"
                value={signature}
              />

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Save Changes
                </Button>
                <Link to="/" className="flex-1">
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
