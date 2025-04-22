'use client';

import { Input, Button } from '@mints/ui';
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(email)
    ) {
      setError('请填写正确格式的邮箱');
      return;
    }

    setError('');
    console.log({ email });
    // TODO: 发送重置请求
  };

  return (
    <div className="min-h-full flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        <h1 className="text-center text-2xl font-bold text-zinc-900">
          忘记密码
        </h1>

        {error && (
          <div className="text-sm bg-zinc-800 text-white px-4 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="请输入邮箱"
          />

          <Button type="submit" className="w-full text-sm py-2">
            发送重置链接
          </Button>
        </form>

        <div className="text-sm text-zinc-600 text-center space-x-4">
          <span>
            尚未拥有账号？
            <Link href="/signup" className="text-zinc-900 underline">
              注册
            </Link>
          </span>
          <span>
            已有账号？
            <Link href="/signin" className="text-zinc-900 underline">
              登录
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
