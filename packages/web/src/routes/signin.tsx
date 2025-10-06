import { operator } from '@mints/request';
import { Button, Input, Callout } from '@mints/ui';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router';

import API from '@/api';

export function Signin() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [operating, setOperating] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError('请输入邮箱和密码');
      return;
    }

    const [success] = await operator(() => API.auth.signin(form), {
      setOperating,
    });

    if (success) {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="flex items-center justify-center px-4 min-h-full">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        <h1 className="text-center text-2xl font-bold text-zinc-900">
          欢迎来到 Mints
        </h1>

        {error && <Callout variant="danger">{error}</Callout>}

        <div className="space-y-4">
          <Input
            type="email"
            required
            placeholder="邮箱"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <div className="space-y-1">
            <div className="flex justify-end items-center text-sm text-zinc-600">
              <Link
                to="/forgot-password"
                className="text-zinc-800 underline hover:text-zinc-900"
              >
                忘记密码？
              </Link>
            </div>
            <Input
              type="password"
              required
              placeholder="请输入密码"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
            />
          </div>
          <Button
            type="submit"
            className="w-full text-sm py-2"
            disabled={operating}
            onClick={handleSubmit}
          >
            {operating ? '登录中...' : '登录'}
          </Button>
        </div>

        <p className="text-center text-sm text-zinc-600">
          没有账户？{' '}
          <Link to="/signup" className="text-zinc-900 underline">
            注册
          </Link>
        </p>
      </div>
    </div>
  );
}
