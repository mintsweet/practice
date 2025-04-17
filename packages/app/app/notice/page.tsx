'use client';

import Link from 'next/link';

interface NoticeItem {
  type: 'follow' | 'reply' | 'like' | 'collect' | 'mention';
  typeName: string;
  create_at: string;
  author_id: string;
  author_avatar: string;
  author_nickname?: string;
  author?: {
    id: string;
    nickname: string;
  };
  topic_id?: string;
  topic_title?: string;
}

interface Props {
  params: {
    type: 'user' | 'system';
  };
}

export default function NoticePage({ params }: Props) {
  const type = params.type;
  const config = { API: 'https://api.example.com' };

  const data: NoticeItem[] = []; // TODO: 来自接口

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-4 py-6">
      <div className="flex-1 space-y-6">
        <div className="flex gap-4 border-b pb-2">
          <Link
            href="/notice/user"
            className={`text-sm ${type === 'user' ? 'text-[#16982B] font-bold' : 'text-[#555]'}`}
          >
            用户消息
          </Link>
          <Link
            href="/notice/system"
            className={`text-sm ${type === 'system' ? 'text-[#16982B] font-bold' : 'text-[#555]'}`}
          >
            系统消息
          </Link>
        </div>

        {data.length > 0 ? (
          data.map((item, i) => (
            <div
              key={i}
              className={`flex gap-4 items-start bg-[#fefefe] p-4 rounded text-sm ${item.type === 'follow' ? 'border-l-4 border-[#16982B]' : ''}`}
            >
              <Link href={`/user/${item.author_id}`}>
                <img
                  src={`${config.API}/upload/${item.author_avatar}`}
                  alt="avatar"
                  className="w-10 h-10 rounded"
                />
              </Link>

              {item.type === 'follow' ? (
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-[#555]">
                      {item.typeName}
                    </span>
                    <time className="text-xs text-[#8a8a8a]">
                      {item.create_at}
                    </time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/user/${item.author?.id}`}
                      className="text-[#16982B] font-medium"
                    >
                      {item.author?.nickname}
                    </Link>
                    <button className="px-2 py-1 border border-[#16982B] text-[#16982B] rounded text-xs hover:bg-[#16982B] hover:text-white">
                      关注
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <div className="flex justify-between">
                    <Link
                      href={`/user/${item.author_id}`}
                      className="font-medium text-[#555]"
                    >
                      {item.author_nickname}
                    </Link>
                    <time className="text-xs text-[#8a8a8a]">
                      {item.create_at}
                    </time>
                  </div>
                  <div className="mt-1 text-[#555]">
                    <span>{item.typeName}你的话题：</span>
                    <Link
                      href={`/topic/${item.topic_id}`}
                      className="text-[#16982B] underline"
                    >
                      {item.topic_title}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-[#8a8a8a] text-sm">暂无消息</div>
        )}
      </div>
    </div>
  );
}
