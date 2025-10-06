import { Input, Button } from '@mints/ui';
import { useState } from 'react';
import { Link } from 'react-router';

export function UserUpdatePassword() {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const passwordPattern =
      /^(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)[\w~!@#$%^&*?]{6,18}$/;

    if (!oldPass) {
      setError('旧密码不能为空');
      return;
    }

    if (!newPass || !passwordPattern.test(newPass)) {
      setError('请填写6-18位数字、字母和特殊字符任意两种组合的密码');
      return;
    }

    if (newPass !== confirmPass) {
      setError('两次密码不一致');
      return;
    }

    setError('');
    console.log({ oldPass, newPass });
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow border border-zinc-200">
        <div className="flex gap-6 mb-6 pb-2 text-sm font-medium">
          <Link
            to="/user/setting"
            className="text-zinc-600 hover:text-zinc-900 pb-1"
          >
            个人资料
          </Link>
          <Link
            to="/user/update-password"
            className="text-zinc-900 border-b-2 border-zinc-900 pb-1"
          >
            修改密码
          </Link>
        </div>

        <h2 className="text-base font-bold mb-4 text-zinc-800">修改密码</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-sm bg-zinc-800 text-white px-4 py-2 rounded">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <Input
              label="旧密码"
              id="oldPass"
              type="password"
              placeholder="请输入旧密码"
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
            />
            <Link
              to="/forget-pass"
              className="text-xs text-zinc-900 underline w-fit"
            >
              忘记密码？
            </Link>
          </div>

          <Input
            label="新密码"
            id="newPass"
            type="password"
            placeholder="请输入新密码"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />

          <Input
            label="确认密码"
            id="confirmPass"
            type="password"
            placeholder="请再一次输入新密码"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />

          <Button type="submit" className="w-full text-sm py-2">
            保存修改
          </Button>
        </form>
      </div>
    </div>
  );
}
