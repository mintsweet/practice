'use client';

import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(email)
    ) {
      setError('请填写正确格式的邮箱');
      return;
    }

    if (captcha.length !== 5) {
      setError('请填写正确格式的验证码');
      return;
    }

    setError('');
    // TODO: 发送请求
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="mb-6 flex items-center text-lg font-bold">
        <span className="inline-block w-6 h-6 rounded-full bg-[#16982B] mr-2"></span>
        忘记密码
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-[#fefefe] p-6 rounded shadow"
      >
        {error && (
          <div className="bg-[#dc3545] text-white px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1 text-sm">
            邮箱：
          </label>
          <input
            id="email"
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="请输入邮箱"
            autoComplete="off"
            className="border border-[#cacaca] rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="captcha" className="mb-1 text-sm">
            验证码：
          </label>
          <div className="flex gap-2 items-center">
            <input
              id="captcha"
              type="text"
              name="captcha"
              value={captcha}
              onChange={(e) => setCaptcha(e.target.value)}
              minLength={5}
              maxLength={5}
              placeholder="请输入验证码"
              autoComplete="off"
              className="flex-1 border border-[#cacaca] rounded px-3 py-2 text-sm"
            />
            <img
              id="js-captcha"
              src="/api/captcha"
              alt="图形验证码"
              className="h-10 rounded border border-[#e6e6e6]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#16982B] hover:bg-[#117A22] text-white py-2 rounded text-sm"
        >
          点击确认
        </button>
      </form>

      <div className="mt-6 text-sm text-[#555]">
        <p className="mb-1">尚未拥有账号？</p>
        <p className="mb-2">
          请点击{' '}
          <a href="/signup" className="text-[#16982B] underline">
            注册
          </a>
        </p>
        <p className="mb-1">已经拥有账号？</p>
        <p>
          请点击{' '}
          <a href="/signin" className="text-[#16982B] underline">
            登录
          </a>
        </p>
      </div>
    </div>
  );
}
