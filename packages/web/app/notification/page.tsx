import { Avatar } from '@mints/ui';
import Link from 'next/link';

import { getNotification } from '@/lib/notification';

export default async function NoticePage({
  searchParams,
}: {
  searchParams: Promise<{ type: 'user' | 'system' }>;
}) {
  const { type } = await searchParams;

  const data = await getNotification(type);

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow border border-zinc-200">
        <div className="flex gap-6 mb-4 text-sm font-medium">
          <Link
            href="/notification?type=user"
            className={`pb-1 ${
              !type || type === 'user'
                ? 'text-zinc-900 border-b-2 border-zinc-900'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            用户消息
          </Link>
          <Link
            href="/notification?type=system"
            className={`pb-1 ${
              type === 'system'
                ? 'text-zinc-900 border-b-2 border-zinc-900'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            系统消息
          </Link>
        </div>

        <div className="space-y-4">
          {data.length > 0 ? (
            data.map((item, i) => (
              <div
                key={i}
                className={`flex items-start p-4 rounded-xl border shadow-sm text-sm ${
                  item.isRead
                    ? 'bg-white border-zinc-200'
                    : 'bg-zinc-50 border-zinc-300'
                }`}
              >
                {item.type === 'system' ? (
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-zinc-700">
                        系统通知
                      </span>
                      <time className="text-xs text-zinc-400">
                        {item.createdAt}
                      </time>
                    </div>
                    <div className="text-zinc-700">{item.message}</div>
                  </div>
                ) : (
                  <>
                    <Link href={`/user/${item.actor?.id}`}>
                      <Avatar
                        src={item.actor?.avatar}
                        name={item.actor?.nickname ?? item.actor?.email}
                        className="w-10 h-10 mr-4"
                      />
                    </Link>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <Link
                          href={`/user/${item.actor?.id}`}
                          className="font-medium text-zinc-900"
                        >
                          {item.actor?.nickname}
                        </Link>
                        <time className="text-xs text-zinc-400">
                          {item.createdAt}
                        </time>
                      </div>
                      <div className="text-zinc-700">
                        {item.message}
                        {item.target?.type === 'topic' && item.target.title && (
                          <>
                            ：
                            <Link
                              href={`/topic/${item.target.id}`}
                              className="underline"
                            >
                              {item.target.title}
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="text-sm text-zinc-400 text-center py-8">
              暂无消息
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
