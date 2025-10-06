import { Avatar, Input, Button } from '@mints/ui';
import { Link } from 'react-router';

import { useAuth } from '@/auth-context';

export function UserSetting() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-2">
          <p className="text-lg text-zinc-800">未登录，无法访问该页面</p>
          <Link to="/signin" className="text-zinc-900 underline">
            点击登录
          </Link>
        </div>
      </div>
    );
  }

  const { email, avatar, nickname, location, signature } = user;

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow border border-zinc-200">
        <div className="flex gap-6 mb-6 pb-2 text-sm font-medium">
          <a
            href="/user/setting"
            className="text-zinc-900 border-b-2 border-zinc-900 pb-1"
          >
            个人资料
          </a>
          <a
            href="/user/update-password"
            className="text-zinc-600 hover:text-zinc-900 pb-1"
          >
            修改密码
          </a>
        </div>

        <h2 className="text-base font-bold mb-4 text-zinc-800">个人资料</h2>
        <form className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="file" className="text-sm font-medium text-zinc-700">
              头像
            </label>
            <Avatar
              src={avatar}
              name={nickname ?? email}
              className="w-20 h-20"
            />
            <input id="file" type="file" name="file" className="text-sm mt-2" />
            <p className="text-xs text-zinc-500">
              支持 jpg、png 格式，1MB 以内
            </p>
            <Button type="button" className="mt-2 w-fit text-sm px-4 py-1">
              上传头像
            </Button>
          </div>

          <Input
            label="昵称"
            id="nickname"
            placeholder="请输入昵称"
            value={nickname}
          />

          <Input
            label="所在地"
            id="location"
            placeholder="请输入所在地"
            value={location}
          />

          <Input
            label="个人介绍"
            id="signature"
            placeholder="请输入个人介绍"
            value={signature}
          />

          <Button type="submit" className="w-full text-sm py-2">
            更新个人资料
          </Button>
        </form>
      </div>
    </div>
  );
}
