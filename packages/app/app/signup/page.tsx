'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';

export default function SignupPage() {
  const [error, setError] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nicknameRef = useRef<HTMLInputElement>(null);
  const captchaRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const email = emailRef.current?.value.trim() || '';
    const password = passwordRef.current?.value || '';
    const nickname = nicknameRef.current?.value.trim() || '';
    const captcha = captchaRef.current?.value.trim() || '';

    const emailRegex =
      /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
    const passwordRegex =
      /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]{6,18}$/;

    if (!email || !emailRegex.test(email)) {
      setError('请填写正确格式的邮箱');
      return;
    }

    if (!password || !passwordRegex.test(password)) {
      setError('请填写6-18位数字、字母和特殊字符任意两种组合');
      return;
    }

    if (!nickname || nickname.length < 2 || nickname.length > 10) {
      setError('请填写2-10位的昵称');
      return;
    }

    if (!captcha || captcha.length !== 5) {
      setError('请填写5位的图形验证码');
      return;
    }

    setError('');
    console.log({ email, password, nickname, captcha });
    // TODO: 发起注册请求
  };

  return (
    <div className="bg-white p-6 sm:p-10 min-h-[400px] w-[960px] mx-auto">
      <div className="mb-6 text-xl font-bold flex items-center">
        <span className="mr-2">📝</span>
        用户注册
      </div>
      <div className="flex sm:flex-row flex-col">
        {/* 表单 */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-4">
          {error && (
            <div className="bg-red-100 text-red-600 border border-red-300 px-4 py-2 rounded">
              {error}
            </div>
          )}
          <div className="flex items-center">
            <label htmlFor="email" className="w-24 text-right mr-4">
              邮箱：
            </label>
            <input
              ref={emailRef}
              id="email"
              type="text"
              name="email"
              placeholder="请输入邮箱"
              autoComplete="off"
              className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:border-green-600"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="password" className="w-24 text-right mr-4">
              密码：
            </label>
            <input
              ref={passwordRef}
              id="password"
              type="password"
              name="password"
              minLength={6}
              maxLength={18}
              placeholder="请输入密码"
              autoComplete="off"
              className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:border-green-600"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="nickname" className="w-24 text-right mr-4">
              昵称：
            </label>
            <input
              ref={nicknameRef}
              id="nickname"
              type="text"
              name="nickname"
              minLength={2}
              maxLength={10}
              placeholder="请输入昵称"
              autoComplete="off"
              className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:border-green-600"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="captcha" className="w-24 text-right mr-4">
              验证码：
            </label>
            <input
              ref={captchaRef}
              id="captcha"
              type="text"
              name="captcha"
              minLength={5}
              maxLength={5}
              placeholder="请输入验证码"
              autoComplete="off"
              className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:border-green-600"
            />
            <img
              src="/api/captcha" // TODO: 替换为实际验证码接口
              alt="验证码"
              className="ml-4 w-[100px] h-[36px] border border-gray-300"
            />
          </div>
          <div className="text-center pt-2">
            <button
              type="submit"
              className="bg-white text-green-700 border border-green-700 px-6 py-2 rounded hover:bg-green-700 hover:text-white transition-all"
            >
              立即注册
            </button>
          </div>
        </form>

        {/* 边栏说明 */}
        <div className="hidden sm:block flex-1 ml-10 pl-10 border-l border-gray-200 text-sm text-gray-600">
          <p className="mb-2">已经拥有账号？</p>
          <p className="mb-2">
            请直接
            <Link href="/signin" className="text-green-700 mx-1">
              登录
            </Link>
          </p>
          <p className="mb-2">忘记密码？</p>
          <p>
            请点击
            <Link href="/forget-pass" className="text-green-700 mx-1">
              忘记密码
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
