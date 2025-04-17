'use client';

import { useState } from 'react';

import UserTop from '@/components/user-top';

export default function UserSettingsPage() {
  const [avatar] = useState('avatar.png');
  const [nickname, setNickname] = useState('小明');
  const [location, setLocation] = useState('上海');
  const [signature, setSignature] = useState('热爱前端，喜欢写代码');
  const [error, setError] = useState('');
  const config = { API: 'https://api.example.com' };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signature.length > 100) {
      setError('签名长度不能超过100个字符');
      return;
    }
    setError('');
    // TODO: 提交更新逻辑
  };

  const handleUpload = async () => {
    const input = document.getElementById('file') as HTMLInputElement;
    if (input?.files?.length) {
      const formData = new FormData();
      formData.append('file', input.files[0]);

      try {
        const res = await fetch('/avatar/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        console.log(data);
        // setAvatar(data.url)
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-4 py-6">
      <div className="flex-1 space-y-6">
        <div className="flex gap-4 border-b pb-2">
          <a href="/setting" className="text-[#16982B] font-bold">
            个人资料
          </a>
          <a href="/update-pass" className="text-[#555] hover:text-black">
            修改密码
          </a>
        </div>

        <div className="bg-[#fefefe] rounded p-4">
          <h2 className="text-base font-bold mb-4">个人资料</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-[#dc3545] text-white px-4 py-2 rounded text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="file" className="text-sm">
                头像
              </label>
              <img
                src={`${config.API}/upload/${avatar}`}
                alt="avatar"
                className="w-16 h-16 rounded"
              />
              <input id="file" type="file" name="file" className="text-sm" />
              <span className="text-xs text-[#8a8a8a]">
                支持 jpg、png 格式大小 1M 以内的图片
              </span>
              <button
                type="button"
                onClick={handleUpload}
                className="inline-block mt-1 px-3 py-1 text-sm border border-[#16982B] text-[#16982B] rounded hover:bg-[#16982B] hover:text-white"
              >
                点击上传
              </button>
            </div>

            <div className="flex flex-col">
              <label htmlFor="nickname" className="mb-1 text-sm">
                昵称
              </label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                placeholder="请输入昵称"
                autoComplete="off"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="border border-[#e6e6e6] rounded px-3 py-2 text-sm"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="location" className="mb-1 text-sm">
                所在地
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="请输入所在地"
                autoComplete="off"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border border-[#e6e6e6] rounded px-3 py-2 text-sm"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="signature" className="mb-1 text-sm">
                个人介绍
              </label>
              <input
                type="text"
                id="signature"
                name="signature"
                placeholder="请输入个人介绍"
                autoComplete="off"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                className="border border-[#e6e6e6] rounded px-3 py-2 text-sm"
              />
            </div>

            <button
              type="submit"
              className="bg-[#16982B] hover:bg-[#117A22] text-white px-4 py-2 rounded text-sm"
            >
              更新个人资料
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
