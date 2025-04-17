'use client';

import Link from 'next/link';

import TopicsNoReply from '@/components/topics-no-reply';

export default function TopicDetailPage() {
  const config = { API: 'https://api.example.com' };
  const user = { id: 'u1' };
  const like = true;
  const collect = false;

  const topic = {
    _id: 't1',
    author_id: 'u1',
    author_avatar: 'avatar.png',
    author_nickname: '小明',
    created_at: '2024-04-01',
    visit_count: 123,
    title: '这是一个测试话题',
    content: '<p>这里是内容，可以包含 HTML...</p>',
    like_count: 10,
    reply_count: 2,
    collect_count: 5,
    replys: [
      {
        _id: 'r1',
        author_id: 'u2',
        author_avatar: 'avatar2.png',
        author_nickname: '小红',
        created_at_ago: '1 天前',
        content: '这是评论内容。',
      },
    ],
  };

  const author = {
    author_id: 'u123',
    author_avatar: 'avatar123.png',
    author_nickname: '前端小强',
    author_score: 2480,
    author_signature: '写代码使我快乐。',
    apiBase: 'https://api.example.com',
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-4 py-6">
      <div className="flex-1 space-y-6">
        <div className="bg-[#fefefe] rounded p-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href={`/user/${topic.author_id}`}>
              <img
                src={`${config.API}/upload/${topic.author_avatar}`}
                className="w-10 h-10 rounded"
              />
            </Link>
            <div className="text-sm text-[#555]">
              <Link href={`/user/${topic.author_id}`} className="font-semibold">
                {topic.author_nickname}
              </Link>
              <span className="ml-2">{topic.created_at}</span>
              <span className="ml-2 text-[#8a8a8a]">
                阅读 {topic.visit_count}
              </span>
            </div>
          </div>

          <h1 className="text-xl font-bold mb-4">{topic.title}</h1>

          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: topic.content }}
          />

          {user && user.id === topic.author_id && (
            <div className="flex gap-2 mt-4">
              <Link
                href={`/topic/${topic._id}/edit`}
                className="btn border border-[#fd7e14] text-[#fd7e14] hover:bg-[#fd7e14] hover:text-white px-4 py-1 text-sm rounded"
              >
                编辑
              </Link>
              <Link
                href={`/topic/${topic._id}/delete`}
                className="btn border border-[#dc3545] text-[#dc3545] hover:bg-[#dc3545] hover:text-white px-4 py-1 text-sm rounded"
              >
                删除
              </Link>
            </div>
          )}
        </div>

        <div id="reply" className="bg-[#fefefe] rounded p-4">
          <h2 className="text-base font-bold mb-4">评论</h2>

          {user ? (
            <form className="flex flex-col gap-2 mb-6">
              <div className="flex gap-3 items-start">
                <img
                  src={`${config.API}/upload/${topic.author_avatar}`}
                  className="w-8 h-8 rounded"
                />
                <textarea
                  name="content"
                  rows={2}
                  placeholder="说说你的看法..."
                  className="flex-1 border border-[#e6e6e6] rounded px-3 py-2 text-sm"
                />
              </div>
              <button
                type="submit"
                className="self-end bg-[#16982B] hover:bg-[#117A22] text-white px-4 py-1 rounded text-sm"
              >
                评论
              </button>
            </form>
          ) : (
            <p className="text-sm text-[#555]">
              评论，请先{' '}
              <Link href="/signin" className="text-[#16982B] underline">
                登录
              </Link>
            </p>
          )}

          <ul className="space-y-4">
            {topic.replys.length > 0 ? (
              topic.replys.map((reply) => (
                <li key={reply._id} className="flex gap-3">
                  <Link href={`/user/${reply.author_id}`}>
                    <img
                      src={`${config.API}/upload/${reply.author_avatar}`}
                      className="w-8 h-8 rounded"
                    />
                  </Link>
                  <div className="flex-1 text-sm">
                    <div className="flex justify-between text-[#555]">
                      <Link
                        href={`/user/${reply.author_id}`}
                        className="font-semibold"
                      >
                        {reply.author_nickname}
                      </Link>
                      <span className="text-xs text-[#8a8a8a]">
                        {reply.created_at_ago}
                      </span>
                    </div>
                    <div className="mt-1">{reply.content}</div>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-sm text-[#8a8a8a]">暂无评论</li>
            )}
          </ul>
        </div>

        <div className="flex gap-3 justify-end text-sm text-[#555]">
          <button
            id="topic_like"
            data-id={topic._id}
            className={`flex items-center gap-1 ${like ? 'text-[#16982B]' : ''}`}
          >
            ⭐ <span className="number">{topic.like_count}</span>
          </button>
          <a href="#reply" className="flex items-center gap-1">
            💬{' '}
            <span id="reply_count" className="number">
              {topic.reply_count}
            </span>
          </a>
          <button
            id="topic_collect"
            className={`flex items-center gap-1 ${collect ? 'text-[#16982B]' : ''}`}
          >
            📁 <span className="number">{topic.collect_count}</span>
          </button>
        </div>
      </div>

      <aside className="w-full lg:w-[280px] shrink-0 space-y-4">
        <div className="bg-[#fefefe] rounded p-4">
          <h2 className="text-base font-bold mb-2">作者信息</h2>
          <div className="flex items-center gap-3 mb-2">
            <Link href={`/user/${author.author_id}`} className="shrink-0">
              <img
                src={`${author.apiBase}/upload/${author.author_avatar}`}
                alt={author.author_nickname}
                className="w-9 h-9 rounded"
              />
            </Link>
            <Link
              href={`/user/${author.author_id}`}
              className="font-semibold text-sm text-[#555]"
            >
              {author.author_nickname}
            </Link>
          </div>
          <div className="text-sm text-[#555] mb-1">
            <span className="text-[#8a8a8a]">积分：</span>
            {author.author_score}
          </div>
          <div className="italic text-sm text-[#8a8a8a]">
            “ {author.author_signature || '这家伙很懒，什么都没留下'} ”
          </div>
        </div>

        <TopicsNoReply />
      </aside>
    </div>
  );
}
