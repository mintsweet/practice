'use client';

import { Button, Input } from '@mints/ui';
import Link from 'next/link';
import { useRef, useState } from 'react';

export default function SignupPage() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const name = nameRef.current?.value.trim() || '';
    const email = emailRef.current?.value.trim() || '';
    const password = passwordRef.current?.value || '';

    if (!name) return setError('请输入姓名');
    if (!email.includes('@')) return setError('请输入有效邮箱');
    if (password.length < 6) return setError('密码至少 6 位');

    setError('');
    console.log({ name, email, password });
  };

  return (
    <div className="flex items-center justify-center px-4 min-h-full">
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
          <Input ref={nameRef} type="text" placeholder="名字" />
          <Input ref={emailRef} type="email" placeholder="邮箱" />
          <Input ref={passwordRef} type="password" placeholder="密码" />

          <Button type="submit" className="w-full text-sm py-2">
            注册
          </Button>
        </form>

        <p className="text-center text-xs text-zinc-500">
          注册即表示您同意我们的{' '}
          <Link href="/privacy" className="underline text-zinc-800">
            隐私政策
          </Link>{' '}
          和{' '}
          <Link href="/terms" className="underline text-zinc-800">
            服务条款
          </Link>
        </p>

        <p className="text-center text-sm text-zinc-600">
          已有账户？{' '}
          <Link href="/signin" className="text-zinc-900 underline">
            登录
          </Link>
        </p>
      </div>
    </div>
  );
}
