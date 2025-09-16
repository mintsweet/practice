import { operator } from '@mints/request';
import { Button, Input, Callout } from '@mints/ui';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router';

import API from '@/api';

export function Signup() {
  const [form, setFrom] = useState({
    email: '',
    password: '',
    nickname: '',
  });
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.nickname) return setError('请输入姓名');
    if (!form.email.includes('@')) return setError('请输入有效邮箱');
    if (form.password.length < 6) return setError('密码至少 6 位');

    const [success] = await operator(() => API.auth.signup(form));

    if (success) {
      setError('');
      navigate('/signin');
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
            type="text"
            placeholder="名字"
            value={form.nickname}
            onChange={(e) =>
              setFrom((prev) => ({ ...prev, nickname: e.target.value }))
            }
          />
          <Input
            type="email"
            placeholder="邮箱"
            value={form.email}
            onChange={(e) =>
              setFrom((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <Input
            type="password"
            placeholder="密码"
            value={form.password}
            onChange={(e) =>
              setFrom((prev) => ({ ...prev, password: e.target.value }))
            }
          />

          <Button
            type="submit"
            className="w-full text-sm py-2"
            onClick={handleSubmit}
          >
            注册
          </Button>
        </div>

        <p className="text-center text-xs text-zinc-500">
          注册即表示您同意我们的{' '}
          <Link to="/privacy" className="underline text-zinc-800">
            隐私政策
          </Link>{' '}
          和{' '}
          <Link to="/terms" className="underline text-zinc-800">
            服务条款
          </Link>
        </p>

        <p className="text-center text-sm text-zinc-600">
          已有账户？{' '}
          <Link to="/signin" className="text-zinc-900 underline">
            登录
          </Link>
        </p>
      </div>
    </div>
  );
}
