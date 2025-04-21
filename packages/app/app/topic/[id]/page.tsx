import { Avatar, Button } from '@mints/ui';
import clsx from 'clsx';
import Link from 'next/link';

import { getUser } from '@/lib/auth';
import { getTopic } from '@/lib/topic';

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;

  const user = await getUser();
  const {
    id,
    title,
    content,
    author,
    like,
    comment,
    collect,
    view,
    createdAt,
    replys,
  } = await getTopic(topicId);

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-4 py-6">
      <div className="flex-1 space-y-6">
        <div className="bg-zinc-50 border border-zinc-200 rounded p-4">
          <div className="flex justify-between mb-4 text-sm text-zinc-600">
            <div className="flex items-center gap-3">
              <Link href={`/user/${author.id}`}>
                <Avatar
                  name={author.nickname ?? author.email}
                  className="w-10 h-10"
                />
              </Link>
              <div>
                <Link
                  href={`/user/${author.id}`}
                  className="font-semibold text-zinc-800"
                >
                  {author.nickname ?? author.email}
                </Link>
                <span className="ml-2">
                  {new Date(createdAt).toLocaleDateString()}
                </span>
                <span className="ml-2 text-zinc-400">阅读 {view}</span>
              </div>
            </div>

            <div className="flex gap-3 text-sm">
              <button
                id="topic_like"
                data-id={id}
                className={clsx(
                  'flex items-center gap-1',
                  like && 'text-zinc-900',
                )}
              >
                ⭐ <span>{like}</span>
              </button>
              <a href="#reply" className="flex items-center gap-1">
                💬 <span>{comment}</span>
              </a>
              <button
                id="topic_collect"
                className={clsx(
                  'flex items-center gap-1',
                  collect && 'text-zinc-900',
                )}
              >
                📁 <span>{collect}</span>
              </button>
            </div>
          </div>

          <h1 className="text-xl font-bold mb-4 text-zinc-800">{title}</h1>

          <div
            className="prose prose-sm max-w-none text-zinc-700"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {user && user.id === author.id && (
            <div className="flex gap-2 mt-4">
              <Link href={`/topic/${id}/edit`}>
                <Button variant="outline" className="text-sm px-3 py-1">
                  编辑
                </Button>
              </Link>
              <Link href={`/topic/${id}/delete`}>
                <Button variant="outline" className="text-sm px-3 py-1">
                  删除
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div
          id="reply"
          className="bg-zinc-50 border border-zinc-200 rounded p-4"
        >
          <h2 className="text-base font-bold mb-4 text-zinc-800">评论</h2>

          {user ? (
            <form className="flex flex-col gap-2 mb-6">
              <div className="flex gap-3 items-start">
                <Avatar name={user.id} className="w-8 h-8" />
                <textarea
                  name="content"
                  rows={2}
                  placeholder="说说你的看法..."
                  className="flex-1 border border-zinc-300 rounded px-3 py-2 text-sm text-zinc-800"
                />
              </div>
              <Button className="self-end text-sm px-4 py-1">评论</Button>
            </form>
          ) : (
            <p className="text-sm text-zinc-600">
              评论，请先{' '}
              <Link href="/signin" className="text-zinc-900 underline">
                登录
              </Link>
            </p>
          )}

          <ul className="space-y-8">
            {replys.length > 0 ? (
              replys.map((it) => (
                <li key={it.id} className="flex gap-3">
                  <Link href={`/user/${it.author.id}`}>
                    <Avatar
                      name={it.author.nickname ?? it.author.email}
                      className="w-8 h-8"
                    />
                  </Link>
                  <div className="flex-1 text-sm text-zinc-700">
                    <div className="flex justify-between text-zinc-600">
                      <Link
                        href={`/user/${it.author.id}`}
                        className="font-semibold"
                      >
                        {it.author.nickname ?? it.author.email}
                      </Link>
                      <span className="text-xs text-zinc-400">
                        {it.createdAt}
                      </span>
                    </div>
                    <div className="mt-1">{it.content}</div>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-sm text-zinc-400">暂无评论</li>
            )}
          </ul>
        </div>
      </div>

      <aside className="w-full lg:w-[280px] shrink-0 space-y-4">
        <div className="bg-zinc-50 border border-zinc-200 rounded p-4">
          <h2 className="text-base font-bold mb-2 text-zinc-700">作者信息</h2>
          <div className="flex items-center gap-3 mb-2">
            <Link href={`/user/${author.id}`}>
              <Avatar
                name={author.nickname ?? author.email}
                className="w-9 h-9"
              />
            </Link>
            <Link
              href={`/user/${author.id}`}
              className="font-semibold text-sm text-zinc-800"
            >
              {author.nickname ?? author.email}
            </Link>
          </div>
          <div className="italic text-sm text-zinc-500">
            “ 这家伙很懒，什么都没留下 ”
          </div>
        </div>
      </aside>
    </div>
  );
}
