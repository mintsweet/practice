'use client';

import { Button, Input } from '@mints/ui';
import Link from 'next/link';
import { useRef, useState } from 'react';

export default function SigninPage() {
  const [error, setError] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const email = emailRef.current?.value.trim() || '';
    const password = passwordRef.current?.value || '';

    const emailRegex =
      /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;

    if (!email || !emailRegex.test(email)) {
      setError('请输入有效邮箱');
      return;
    }

    if (!password) {
      setError('请输入密码');
      return;
    }

    setError('');
    console.log({ email, password });
    // TODO: 登录逻辑
  };

  return (
    <div className=" flex items-center justify-center px-4 min-h-full">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        <h1 className="text-center text-2xl font-bold text-zinc-900">
          欢迎来到 Mints
        </h1>

        {error && (
          <div className="text-sm bg-zinc-800 text-white px-4 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input ref={emailRef} type="email" placeholder="邮箱" />

          <div className="space-y-1">
            <div className="flex justify-end items-center text-sm text-zinc-600">
              <Link
                href="/forgot-password"
                className="text-zinc-800 underline hover:text-zinc-900"
              >
                忘记密码？
              </Link>
            </div>
            <Input
              ref={passwordRef}
              id="password"
              type="password"
              placeholder="请输入密码"
            />
          </div>

          <Button type="submit" className="w-full text-sm py-2">
            登录
          </Button>
        </form>

        <p className="text-center text-sm text-zinc-600">
          没有账户？{' '}
          <Link href="/signup" className="text-zinc-900 underline">
            注册
          </Link>
        </p>
      </div>
    </div>
  );
}
