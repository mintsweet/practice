import Topics from '@/components/topics';

export default function Home({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const currentTab = searchParams.tab || 'all';
  const user = {
    _id: 'user123',
    nickname: '小明',
    avatar: 'avatar.png',
    signature: '热爱前端，喜欢写代码。',
  };
  const top100 = [
    { _id: 'u1', nickname: 'Alice', score: 1200 },
    { _id: 'u2', nickname: 'Bob', score: 1150 },
  ];
  const config = {
    API: 'https://api.example.com',
    tabs: {
      share: '分享',
      ask: '问答',
      job: '招聘',
    },
    friend_links: [
      { link: 'https://xxx.com', logo: '/logo1.png' },
      { link: 'https://yyy.com', logo: '/logo2.png' },
    ],
  };

  const items = [
    { name: '全部', tag: 'all' },
    { name: '精华', tag: 'good' },
    ...Object.entries(config.tabs).map(([k, v]) => ({ name: v, tag: k })),
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-4 py-6">
      <div className="flex-1">
        <div className="mb-4">
          <div className="flex gap-2 border-b">
            {items.map((item) => (
              <a
                key={item.tag}
                href={`?tab=${item.tag}`}
                className={`px-3 py-1 border-b-2 text-sm ${
                  currentTab === item.tag
                    ? 'border-[#16982B] text-[#16982B]'
                    : 'border-transparent text-[#555] hover:text-black'
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
        <div className="bg-[#fefefe] p-4 rounded shadow">
          <Topics
            topics={[]}
            config={{
              API: '',
              tabs: {},
            }}
            currentPage={1}
            totalPage={1}
            tab="all"
          />
        </div>
      </div>
      <aside className="w-full lg:w-[280px] shrink-0 space-y-4">
        {user && (
          <>
            <div className="bg-[#fefefe] rounded p-4">
              <h2 className="text-base font-bold mb-2">个人信息</h2>
              <div className="flex items-center mb-3">
                <img
                  src={`${config.API}/upload/${user.avatar}`}
                  className="w-10 h-10 rounded"
                />
                <a href={`/user/${user._id}`} className="ml-3 font-semibold">
                  {user.nickname}
                </a>
              </div>
              <div className="italic text-sm text-[#8a8a8a]">
                “ {user.signature || '这家伙很懒，什么都没留下'} ”
              </div>
            </div>
            <div className="bg-[#fefefe] rounded p-4">
              <a
                href="/topic/create"
                className="inline-block px-4 py-1 text-white text-sm bg-[#16982B] hover:bg-[#117A22] rounded"
              >
                发布话题
              </a>
            </div>
          </>
        )}
        <div className="bg-[#fefefe] rounded p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-base font-bold">积分榜</span>
            <a href="/users/top100" className="text-sm text-[#16982B]">
              更多
            </a>
          </div>
          <ul className="space-y-1">
            {top100.map((item) => (
              <li key={item._id} className="flex justify-between text-sm">
                <a href={`/user/${item._id}`} className="text-gray-700">
                  {item.nickname}
                </a>
                <span className="text-[#16982B]">{item.score}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[#fefefe] rounded p-4">
          <h2 className="text-base font-bold mb-2">无人回复</h2>
          <ul className="space-y-1 text-sm text-[#8a8a8a]">
            <li>
              <a href="#" className="block truncate">
                TODO: 无人回复话题
              </a>
            </li>
          </ul>
        </div>
        <div className="bg-[#fefefe] rounded p-4">
          <h2 className="text-base font-bold mb-2">友情社区</h2>
          <ul className="space-y-2">
            {config.friend_links.map((item, idx) => (
              <li key={idx}>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  <img src={item.logo} alt="friend logo" className="h-6" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
