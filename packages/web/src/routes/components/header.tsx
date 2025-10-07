import { Input, Button, Dropdown, Avatar, Bell } from '@mints/ui';
import { Link, useNavigate } from 'react-router';

import { useAuth } from '@/auth-context';

export function Header() {
  const { user, signout } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    await signout();
    navigate('/', { replace: true });
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-zinc-200 shadow-sm">
      <div className="flex items-center justify-between mx-auto max-w-6xl h-14 px-4">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <img src="/logo.svg" alt="logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-zinc-900">Mints</h1>
          </Link>
          <div className="hidden md:block">
            <Input placeholder="搜索话题..." size="sm" />
          </div>
        </div>

        {!user ? (
          <div className="flex items-center gap-2">
            <Link to="/signin">
              <Button variant="outline" size="sm">
                登录
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">注册</Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/notification"
              className="relative p-2 hover:bg-zinc-100 rounded-lg transition"
            >
              <Bell />
            </Link>

            <Dropdown
              menu={[
                {
                  label: (
                    <Link
                      className="block px-4 py-2 text-sm"
                      to="/user/setting"
                    >
                      个人中心
                    </Link>
                  ),
                },
                {
                  label: (
                    <Link
                      className="block px-4 py-2 text-sm"
                      to="/user/update-password"
                    >
                      修改密码
                    </Link>
                  ),
                },
                {
                  label: (
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 cursor-pointer"
                      onClick={logout}
                    >
                      登出
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
