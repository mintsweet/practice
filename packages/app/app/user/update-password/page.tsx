'use client';

import { useState } from 'react';

import UserTop from '@/components/user-top';

export default function UpdatePasswordPage() {
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
    // TODO: 提交密码更新逻辑
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-4 py-6">
      <div className="flex-1 space-y-6">
        <div className="flex gap-4 border-b pb-2">
          <a href="/setting" className="text-[#555] hover:text-black">
            个人资料
          </a>
          <a href="/update-pass" className="text-[#16982B] font-bold">
            修改密码
          </a>
        </div>

        <div className="bg-[#fefefe] rounded p-4">
          <h2 className="text-base font-bold mb-4">修改密码</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-[#dc3545] text-white px-4 py-2 rounded text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col">
              <label htmlFor="oldPass" className="mb-1 text-sm">
                旧密码
              </label>
              <input
                type="password"
                id="oldPass"
                name="oldPass"
                placeholder="请输入旧密码"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                className="border border-[#e6e6e6] rounded px-3 py-2 text-sm"
              />
              <a
                href="/forget-pass"
                className="text-xs text-[#16982B] underline mt-1 w-fit"
              >
                忘记密码？
              </a>
            </div>

            <div className="flex flex-col">
              <label htmlFor="newPass" className="mb-1 text-sm">
                新密码
              </label>
              <input
                type="password"
                id="newPass"
                name="newPass"
                placeholder="请输入新密码"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="border border-[#e6e6e6] rounded px-3 py-2 text-sm"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="confirmPass" className="mb-1 text-sm">
                确认密码
              </label>
              <input
                type="password"
                id="confirmPass"
                name="confirmPass"
                placeholder="请再一次输入新密码"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="border border-[#e6e6e6] rounded px-3 py-2 text-sm"
              />
            </div>

            <button
              type="submit"
              className="bg-[#16982B] hover:bg-[#117A22] text-white px-4 py-2 rounded text-sm"
            >
              保存修改
            </button>
          </form>
        </div>
      </div>

      <aside className="w-full lg:w-[280px] shrink-0 space-y-4">
        <UserTop top100={[]} />
      </aside>
    </div>
  );
}
