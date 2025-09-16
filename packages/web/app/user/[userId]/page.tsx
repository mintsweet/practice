import { Avatar } from '@mints/ui';
import clsx from 'clsx';
import Link from 'next/link';

import { getAuth } from '@/lib/auth';
import { getUser, getUserActions } from '@/lib/user';

export default async function UserIDPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ actionType: string }>;
}) {
  const { userId } = await params;
  const { actionType } = await searchParams;

  const auth = await getAuth();
  const {
    id,
    email,
    nickname,
    avatar,
    location,
    signature,
    followingCound,
    followerCount,
    isFollowed,
  } = await getUser(userId);

  const userActions = await getUserActions(userId, actionType);

  const tabs = [
    { label: '动态', href: `/user/${userId}`, key: 'action' },
    { label: '专栏', href: `/user/${userId}?actionType=create`, key: 'create' },
    { label: '喜欢', href: `/user/${userId}?actionType=like`, key: 'like' },
    {
      label: '关注',
      href: `/user/${userId}?actionType=following`,
      key: 'following',
    },
    {
      label: '粉丝',
      href: `/user/${userId}?actionType=follower`,
      key: 'follower',
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-4 py-6">
      <div className="flex-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow border border-zinc-200 flex gap-6 items-center">
          <Avatar src={avatar} name={nickname ?? email} className="w-20 h-20" />
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-zinc-900">{nickname}</h1>
              {location && (
                <span className="text-sm bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">
                  {location}
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-500">{signature}</p>
            {auth && auth.id === id ? (
              <Link href="/setting" className="text-sm text-zinc-900 underline">
                编辑个人资料
              </Link>
            ) : auth ? (
              <button
                className="text-sm text-zinc-900 underline"
                id="follow_user"
                data-id={id}
              >
                {isFollowed ? '取消关注' : '关注'}
              </button>
            ) : null}
          </div>
        </div>

        <div className="bg-white px-4 pt-2 rounded shadow-sm border border-zinc-200">
          <div className="flex gap-6 text-sm text-zinc-600">
            {tabs.map((t) => (
              <Link
                key={t.key}
                href={t.href}
                className={clsx(
                  'pb-2 transition',
                  actionType === t.key || (!actionType && t.key === 'action')
                    ? 'border-b-2 border-zinc-900 text-zinc-900 font-medium'
                    : 'hover:text-zinc-800',
                )}
              >
                {t.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {userActions.length ? (
            userActions.map(({ id, type, detail, createdAt }) => (
              <div
                key={id}
                className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm text-sm text-zinc-700"
              >
                <div className="flex justify-between items-center mb-2">
                  <span>
                    {type === 'follow'
                      ? '关注了用户'
                      : type === 'create'
                        ? '发布了话题'
                        : type === 'like'
                          ? '喜欢了话题'
                          : '收藏了话题'}
                  </span>
                  <time className="text-xs text-zinc-400">{createdAt}</time>
                </div>
                {type === 'follow' && detail.user ? (
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={detail.user.avatar}
                      name={detail.user.nickname ?? detail.user.email}
                      className="w-10 h-10"
                    />
                    <div>
                      <Link
                        href={`/user/${detail.user.id}`}
                        className="font-semibold text-zinc-900"
                      >
                        {detail.user.nickname}
                      </Link>
                      <div className="text-xs text-zinc-500">
                        {detail.user.signature}
                      </div>
                    </div>
                  </div>
                ) : type !== 'follow' && detail.topic ? (
                  <Link
                    href={`/topic/${detail.topic.id}`}
                    className="block text-zinc-900 underline mt-1"
                  >
                    {detail.topic.title}
                  </Link>
                ) : null}
              </div>
            ))
          ) : (
            <div className="text-sm text-zinc-400 text-center py-8 bg-white rounded-xl border border-dashed border-zinc-200">
              暂无内容
            </div>
          )}
        </div>
      </div>

      <aside className="w-full lg:w-[280px] shrink-0 space-y-4">
        <div className="bg-white rounded p-4 border border-zinc-200 shadow-sm">
          <h2 className="text-base font-bold mb-2 text-zinc-800">关注情况</h2>
          <div className="flex text-sm text-center text-zinc-700">
            <div className="flex-1">
              <span>关注了</span>
              <div>
                <Link
                  href={`/user/${id}?actionType=following`}
                  className="underline text-zinc-900"
                >
                  {followingCound}
                </Link>
              </div>
            </div>
            <div className="flex-1 border-l border-zinc-200">
              <span>关注者</span>
              <div>
                <Link
                  href={`/user/${id}?actionType=follower`}
                  className="underline text-zinc-900"
                >
                  {followerCount}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded p-4 border border-zinc-200 shadow-sm">
          <Link
            href={`/user/${id}?actionType=collect`}
            className="text-sm text-zinc-900 underline"
          >
            收藏集
          </Link>
        </div>
      </aside>
    </div>
  );
}
