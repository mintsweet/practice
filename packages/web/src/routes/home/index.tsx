import { useUrlState } from '@mints/hooks';
import { useRequest } from '@mints/request/react';
import { Tabs, TabItem, Avatar, Button } from '@mints/ui';
import clsx from 'clsx';
import { Link } from 'react-router';

import API from '@/api';
import { useAuth } from '@/auth-context';

import { TopicList } from './topic-list';

const sortOptions = [
  { key: 'latest', label: '最新' },
  { key: 'popular', label: '最热' },
  { key: 'active', label: '活跃' },
  { key: 'no-comment', label: '尚无评论' },
];

export function Home() {
  const [{ sort, q, page }, setUrlState] = useUrlState({
    sort: 'latest',
    q: '',
    page: 1,
  });

  const { user } = useAuth();

  const { loading, data } = useRequest(() => API.topic.query({ page }));

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  const { topics, total } = data;

  return (
    <div className="bg-zinc-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="mb-5">
              {q ? (
                <h1 className="text-2xl font-bold text-zinc-900 mb-3">
                  关于 {q} 的话题
                </h1>
              ) : (
                <Tabs
                  value={sort}
                  onChange={(key) => setUrlState({ sort: key, q, page })}
                >
                  {sortOptions.map(({ key, label }) => (
                    <TabItem key={key} value={key} label={label}>
                      <TopicList topics={topics} />
                    </TabItem>
                  ))}
                </Tabs>
              )}
            </div>

            {total > 20 && (
              <div className="mt-6 flex justify-center gap-1.5">
                {Array.from({ length: Math.ceil(total / 20) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <Link
                      key={p}
                      to={`?sort=${sort}&page=${p}`}
                      className={clsx(
                        'min-w-[36px] h-9 flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200',
                        p === page
                          ? 'bg-zinc-900 text-white shadow-sm'
                          : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-900 hover:text-zinc-900',
                      )}
                    >
                      {p}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="w-full lg:w-[280px] shrink-0 space-y-4">
            {user ? (
              <>
                <div className="bg-zinc-900 rounded-lg p-5 text-white shadow-sm">
                  <Link
                    to="/user/setting"
                    className="flex flex-col items-center gap-2.5 hover:opacity-90 transition"
                  >
                    <div className="relative">
                      <Avatar
                        src={user.avatar}
                        name={user.nickname ?? user.email}
                        className="w-16 h-16 ring-2 ring-white/20"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-400 rounded-full border-2 border-zinc-900"></div>
                    </div>
                    <span className="font-semibold">{user.nickname}</span>
                  </Link>
                  <p className="mt-2.5 text-center text-xs text-white/80 italic leading-relaxed">
                    {'"'}
                    {user.signature || '这家伙很懒，什么都没留下'}
                    {'"'}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm border border-zinc-200">
                  <Link to="/topic/create">
                    <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm hover:shadow transition-all duration-200 font-medium py-2 text-sm">
                      <svg
                        className="w-4 h-4 inline-block mr-1.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      发布话题
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg p-5 shadow-sm border border-zinc-200">
                <div className="text-3xl mb-3 text-center">👋</div>
                <h3 className="text-base font-bold text-zinc-900 mb-2.5 text-center">
                  欢迎来到 Mints 社区
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-2.5">
                  这里汇聚了来自各地的分享者与探索者，讨论生活、职场、成长与灵感。
                </p>
                <p className="text-xs text-zinc-600 leading-relaxed mb-3.5">
                  注册账号即可发布话题、参与评论、收藏你感兴趣的内容。
                </p>
                <Link to="/signup">
                  <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm hover:shadow transition-all duration-200 font-medium py-2 text-sm">
                    立即加入
                  </Button>
                </Link>
              </div>
            )}

            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-amber-400 rounded-md flex items-center justify-center text-sm">
                  💡
                </div>
                <h3 className="text-sm font-semibold text-zinc-900">
                  社区提示
                </h3>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                发布高质量内容，遵守社区规范，让我们一起创造更好的讨论氛围。
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
