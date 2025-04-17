'use client';

export default function UserInfoPage() {
  const info = {
    _id: 'u1',
    id: 'u1',
    avatar: 'avatar.png',
    nickname: '小明',
    location: '上海',
    signature: '热爱开源，喜欢 TypeScript。',
    following_count: 3,
    follower_count: 10,
  };
  const user = { _id: 'u1' };
  const type = 'action';
  const data = [];
  const config = { API: 'https://api.example.com' };

  const tabs = [
    { label: '动态', href: `/user/${info._id}`, key: 'action' },
    { label: '专栏', href: `/user/${info._id}/create`, key: 'create' },
    { label: '喜欢', href: `/user/${info._id}/like`, key: 'like' },
  ];

  const moreTabs = [
    { label: '关注', href: `/user/${info._id}/following`, key: 'following' },
    { label: '粉丝', href: `/user/${info._id}/follower`, key: 'follower' },
    { label: '收藏集', href: `/user/${info._id}/collect`, key: 'collect' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-4 py-6">
      <div className="flex-1 space-y-6">
        <div className="flex gap-4 items-center">
          <img
            src={`${config.API}/upload/${info.avatar}`}
            className="w-16 h-16 rounded"
          />
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2">
              {info.nickname}
              {info.location && (
                <span className="inline-block text-sm bg-[#16982B]/10 text-[#16982B] px-2 py-0.5 rounded">
                  {info.location}
                </span>
              )}
            </h1>
            <h2 className="text-sm text-[#8a8a8a]">{info.signature}</h2>
            {user && user._id === info._id ? (
              <a
                href="/setting"
                className="inline-block mt-2 text-[#16982B] text-sm underline"
              >
                编辑个人资料
              </a>
            ) : user ? (
              <a
                href="javascript:;"
                data-id={info.id}
                id="follow_user"
                className="inline-block mt-2 text-[#16982B] text-sm underline"
              >
                {info.follow ? '取消关注' : '关注'}
              </a>
            ) : null}
          </div>
        </div>

        <div className="border-b">
          <div className="flex gap-4 text-sm">
            {tabs.map((t) => (
              <a
                key={t.key}
                href={t.href}
                className={`py-2 ${type === t.key ? 'border-b-2 border-[#16982B] text-[#16982B]' : 'text-[#555]'}`}
              >
                {t.label}
              </a>
            ))}
            <div className="relative group">
              <span
                className={`py-2 cursor-pointer ${['following', 'follower', 'collect'].includes(type) ? 'border-b-2 border-[#16982B] text-[#16982B]' : 'text-[#555]'}`}
              >
                更多
              </span>
              <div className="absolute top-full left-0 mt-1 bg-white border border-[#e6e6e6] rounded shadow hidden group-hover:block z-10">
                {moreTabs.map((m) => (
                  <a
                    key={m.key}
                    href={m.href}
                    className={`block px-4 py-2 text-sm ${type === m.key ? 'text-[#16982B]' : 'text-[#555]'}`}
                  >
                    {m.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <ul className="space-y-4">
          {data.length ? (
            data.map((item) => (
              <li key={item.id} className="text-sm text-[#555]">
                {item.type === 'follow' ? (
                  <div>
                    <span>关注了用户</span>
                    <time className="ml-2 text-xs text-[#8a8a8a]">
                      {item.create_at}
                    </time>
                    <div className="flex gap-2 mt-2">
                      <a href={`/user/${item.id}`} className="w-10 h-10">
                        <img
                          src={`${config.API}/upload/${item.avatar}`}
                          className="rounded w-full h-full"
                        />
                      </a>
                      <div>
                        <a href={`/user/${item.id}`} className="font-semibold">
                          {item.nickname}
                        </a>
                        <div className="text-xs text-[#8a8a8a]">
                          {item.signature}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span>
                      {item.type === 'create'
                        ? '发布了话题'
                        : item.type === 'like'
                          ? '喜欢了话题'
                          : '收藏了话题'}
                    </span>
                    <time className="ml-2 text-xs text-[#8a8a8a]">
                      {item.create_at}
                    </time>
                    <a
                      href={`/topic/${item.id}`}
                      className="block text-[#16982B] underline mt-1"
                    >
                      {item.title}
                    </a>
                  </div>
                )}
              </li>
            ))
          ) : (
            <li className="text-sm text-[#8a8a8a]">暂无内容</li>
          )}
        </ul>
      </div>

      <aside className="w-full lg:w-[280px] shrink-0 space-y-4">
        <div className="bg-[#fefefe] rounded p-4">
          <h2 className="text-base font-bold mb-2">关注情况</h2>
          <div className="flex text-sm text-center">
            <div className="flex-1">
              <span>关注了</span>
              <div>
                <a
                  href={`/user/${info._id}/following`}
                  className="text-[#16982B]"
                >
                  {info.following_count}
                </a>
              </div>
            </div>
            <div className="flex-1 border-l border-[#e6e6e6]">
              <span>关注者</span>
              <div>
                <a
                  href={`/user/${info._id}/follower`}
                  className="text-[#16982B]"
                >
                  {info.follower_count}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#fefefe] rounded p-4">
          <a
            href={`/user/${info._id}/collect`}
            className="text-[#16982B] text-sm underline"
          >
            收藏集
          </a>
        </div>
      </aside>
    </div>
  );
}
