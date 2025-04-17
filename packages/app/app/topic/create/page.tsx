// app/topic/create/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import SimpleMDE from 'simplemde';
import 'simplemde/dist/simplemde.min.css';

export default function TopicCreatePage() {
  const config = {
    tabs: {
      share: '分享',
      ask: '问答',
      job: '招聘',
    },
  };

  const [tab, setTab] = useState('');
  const [tabName, setTabName] = useState('');
  const [title, setTitle] = useState('');
  const [, setContent] = useState('');
  const [error, setError] = useState('');
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const mde = useRef<SimpleMDE | null>(null);

  useEffect(() => {
    if (editorRef.current && !mde.current) {
      mde.current = new SimpleMDE({
        element: editorRef.current,
        spellChecker: false,
        status: false,
        toolbar: [
          'bold',
          'italic',
          'heading',
          '|',
          'quote',
          'unordered-list',
          'ordered-list',
          '|',
          'link',
          'preview',
          'guide',
        ],
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contentVal = mde.current?.value() || '';

    if (!tab) {
      setError('请选择分类');
      return;
    }
    if (!title.trim()) {
      setError('标题不能为空');
      return;
    }
    if (!contentVal.trim()) {
      setError('内容不能为空');
      return;
    }

    setError('');
    setContent(contentVal);
    // TODO: 发起提交请求
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-4">发布话题</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-[#dc3545] text-white px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <input type="hidden" name="tab" value={tab} />

        <div className="relative">
          <div
            className="cursor-pointer px-4 py-2 border border-[#e6e6e6] rounded text-sm text-[#555] bg-white"
            onClick={() => {
              const dropdown = document.getElementById('dropdown-options');
              dropdown?.classList.toggle('hidden');
            }}
          >
            {tabName || '请选择类别'}
          </div>
          <div
            id="dropdown-options"
            className="absolute left-0 mt-1 w-full bg-white border border-[#e6e6e6] rounded shadow hidden z-10"
          >
            {Object.entries(config.tabs).map(([key, name]) => (
              <div
                key={key}
                onClick={() => {
                  setTab(key);
                  setTabName(name);
                  document
                    .getElementById('dropdown-options')
                    ?.classList.add('hidden');
                }}
                className="px-4 py-2 text-sm text-[#555] hover:bg-[#f5f5f5] cursor-pointer"
              >
                {name}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block mb-1 text-sm">
            标题：
          </label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="请输入标题"
            autoComplete="off"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-[#e6e6e6] rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="editor" className="block mb-1 text-sm">
            内容：
          </label>
          <textarea ref={editorRef} id="editor" className="hidden" />
        </div>

        <button
          type="submit"
          className="bg-[#16982B] hover:bg-[#117A22] text-white px-6 py-2 rounded text-sm"
        >
          发布话题
        </button>
      </form>
    </div>
  );
}
