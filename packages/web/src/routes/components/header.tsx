import { Input, Button, Dropdown, Avatar, Bell } from '@mints/ui';
import { Link, useNavigate } from 'react-router';

import { useAuth } from '@/auth-context';

interface Props {
  title: string;
}

export function Header({ title }: Props) {
  const { user, signout } = useAuth();
  const naviagte = useNavigate();

  const logout = async () => {
    await signout();
    naviagte('/', { replace: true });
  };

  return (
    <header className="sticky right-0 top-0 left-0 bg-white shadow-xl">
      <div className="flex items-center justify-between mx-auto max-w-5xl h-16">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="logo" className="w-10 h-10" />
            <h1 className="text-2xl text-zinc-800">{title}</h1>
          </Link>
          <Input placeholder="搜索" />
        </div>

        {!user ? (
          <div className="space-x-4">
            <Link to="/signin">
              <Button variant="outline">登录</Button>
            </Link>
            <Link to="/signup">
              <Button>注册</Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/notification">
              <Bell />
            </Link>
            <Dropdown
              menu={[
                {
                  label: (
                    <Link className="block" to="/user/setting">
                      个人中心
                    </Link>
                  ),
                },
                {
                  label: (
                    <Link className="block" to="/user/update-password">
                      修改密码
                    </Link>
                  ),
                },
                {
                  label: (
                    <a
                      href="javascript:void;"
                      className="block"
                      onClick={logout}
                    >
                      登出
                    </a>
                  ),
                },
              ]}
            >
              <Avatar name={user.avatar ?? user.nickname ?? user.email} />
            </Dropdown>
          </div>
        )}
      </div>
    </header>
  );
}
