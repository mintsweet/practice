'use client';

import { Button } from '@mints/ui';
import { useState } from 'react';

export default function TopicCreatePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('标题不能为空');
      return;
    }
    if (!content.trim()) {
      setError('内容不能为空');
      return;
    }

    setError('');
    // TODO: 发起提交请求
    console.log({ title, content, tags });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-4 text-zinc-800">发布话题</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-zinc-800 text-white px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block mb-1 text-sm text-zinc-600">
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
            className="w-full border border-zinc-300 rounded px-3 py-2 text-sm text-zinc-800"
          />
        </div>

        <div>
          <label htmlFor="tag" className="block mb-1 text-sm text-zinc-600">
            标签：
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-sm text-zinc-700 bg-zinc-200 rounded px-2 py-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-zinc-500 hover:text-zinc-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              id="tag"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              className="flex-1 border border-zinc-300 rounded px-3 py-2 text-sm text-zinc-800"
              placeholder="输入标签后回车添加"
            />
            <Button type="button" onClick={handleAddTag}>
              添加
            </Button>
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block mb-1 text-sm text-zinc-600">
            内容：
          </label>
          <textarea
            id="content"
            name="content"
            rows={10}
            placeholder="请输入内容..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-zinc-300 rounded px-3 py-2 text-sm text-zinc-800"
          />
        </div>

        <Button type="submit" className="px-6 py-2 text-sm">
          发布话题
        </Button>
      </form>
    </div>
  );
}
