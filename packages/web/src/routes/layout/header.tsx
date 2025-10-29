import { Button, Dropdown, Avatar, Bell } from '@mints/ui';
import { Link, useNavigate } from 'react-router';

import { useAuth } from '@/auth-context';

const DROPDOWN_MENU_ITEMS = [
  {
    label: 'Profile',
    to: '/user/setting',
  },
  {
    label: 'Change Password',
    to: '/user/update-password',
  },
];

export function Header() {
  const { user, signout } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    await signout();
    navigate('/', { replace: true });
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-zinc-200">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-14 px-4">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <img src="/logo.svg" alt="logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-zinc-900">Mints</h1>
          </Link>
        </div>

        {!user ? (
          <div className="flex items-center gap-2">
            <Link to="/signin">
              <Button variant="link" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/notification"
              className="relative p-2 hover:bg-zinc-100 rounded-lg transition"
              aria-label="Notifications"
            >
              <Bell />
            </Link>

            <Dropdown
              menu={[
                ...DROPDOWN_MENU_ITEMS.map((item) => ({
                  label: (
                    <Link
                      className="block p-2 text-sm text-nowrap"
                      to={item.to}
                    >
                      {item.label}
                    </Link>
                  ),
                })),
                {
                  label: (
                    <button
                      className="block w-full text-left p-2 text-sm text-red-600 cursor-pointer"
                      onClick={logout}
                    >
                      Sign Out
                    </button>
                  ),
                },
              ]}
            >
              <Avatar src={user.avatar} name={user.nickname ?? user.email} />
            </Dropdown>
          </div>
        )}
      </div>
    </header>
  );
}
