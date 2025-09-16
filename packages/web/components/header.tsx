import { Input, Button, Dropdown, Avatar } from '@mints/ui';
import Link from 'next/link';
import { AiFillNotification } from 'react-icons/ai';

interface Props {
  title: string;
  user: {
    email: string;
    avatar?: string;
    nickname?: string;
  } | null;
}

export default function Header({ title, user }: Props) {
  return (
    <header className="sticky right-0 top-0 left-0 bg-white shadow-xl">
      <div className="flex items-center justify-between mx-auto max-w-5xl h-16">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="logo" className="w-10 h-10" />
            <h1 className="text-2xl text-zinc-800">{title}</h1>
          </Link>
          <Input placeholder="搜索" />
        </div>

        {!user ? (
          <div className="space-x-4">
            <Link href="/signin">
              <Button variant="outline">登录</Button>
            </Link>
            <Link href="/signup">
              <Button>注册</Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/notification">
              <AiFillNotification />
            </Link>
            <Dropdown
              menu={[
                {
                  label: (
                    <Link className="block" href="/user/setting">
                      个人中心
                    </Link>
                  ),
                },
                {
                  label: (
                    <Link className="block" href="/user/update-password">
                      修改密码
                    </Link>
                  ),
                },
                {
                  label: (
                    <Link className="block" href="/signout">
                      登出
                    </Link>
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
