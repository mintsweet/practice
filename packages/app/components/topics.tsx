import Link from 'next/link';

interface Topic {
  _id: string;
  author_id: string;
  author_nickname: string;
  author_avatar: string;
  tab: string;
  title: string;
  created_at: string;
  like_count: number;
  reply_count: number;
  good?: boolean;
  top?: boolean;
}

interface Props {
  topics: Topic[];
  config: {
    API: string;
    tabs: Record<string, string>;
  };
  currentPage: number;
  totalPage: number;
  tab: string;
}

export default function Topics({
  topics,
  config,
  currentPage,
  totalPage,
  tab,
}: Props) {
  const baseUrl = `/?tab=${tab || ''}&page=`;

  return (
    <div className="space-y-4">
      {topics.length > 0 ? (
        topics.map((topic) => (
          <div
            key={topic._id}
            className="bg-[#fefefe] p-4 rounded flex gap-4 items-start"
          >
            <Link
              href={`/user/${topic.author_id}`}
              title={topic.author_nickname}
            >
              <img
                src={`${config.API}/upload/${topic.author_avatar}`}
                className="w-10 h-10 rounded"
                alt={topic.author_nickname}
              />
            </Link>
            <div className="flex-1">
              <div className="mb-1">
                {topic.top ? (
                  <span className="text-xs text-white bg-[#16982B] px-2 py-0.5 rounded mr-2">
                    置顶
                  </span>
                ) : topic.good ? (
                  <span className="text-xs text-white bg-[#16982B] px-2 py-0.5 rounded mr-2">
                    精华
                  </span>
                ) : (
                  <span className="text-xs text-[#16982B] bg-[#16982B]/10 px-2 py-0.5 rounded mr-2">
                    {config.tabs[topic.tab]}
                  </span>
                )}
                <Link
                  href={`/topic/${topic._id}`}
                  className="text-sm font-semibold text-[#555] hover:text-black"
                  title={topic.title}
                >
                  {topic.title}
                </Link>
              </div>
              <div className="flex gap-4 text-xs text-[#8a8a8a] mt-1">
                <span title="喜欢数">❤️ {topic.like_count}</span>
                <span title="回复数">💬 {topic.reply_count}</span>
                <span>{topic.created_at}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-[#8a8a8a] text-sm py-4 text-center">暂无内容</div>
      )}

      {topics.length > 0 && (
        <div className="text-center mt-6 flex justify-center flex-wrap gap-1">
          {currentPage === 1 ? (
            <span className="inline-block w-6 h-6 leading-6 text-center rounded border border-[#e6e6e6] bg-[#fefefe] text-[#555] opacity-40 cursor-not-allowed">
              «
            </span>
          ) : (
            <Link
              href={`${baseUrl}${currentPage - 1}`}
              className="inline-block w-6 h-6 leading-6 text-center rounded border border-[#e6e6e6] bg-[#fefefe] text-[#555] hover:border-[#16982B] hover:text-[#16982B]"
            >
              «
            </Link>
          )}

          {Array.from({ length: totalPage }).map((_, i) => {
            const page = i + 1;
            return currentPage === page ? (
              <span
                key={page}
                className="inline-block w-6 h-6 leading-6 text-center rounded border border-[#16982B] bg-[#fefefe] text-[#16982B] font-medium cursor-default"
              >
                {page}
              </span>
            ) : (
              <Link
                key={page}
                href={`${baseUrl}${page}`}
                className="inline-block w-6 h-6 leading-6 text-center rounded border border-[#e6e6e6] bg-[#fefefe] text-[#555] hover:border-[#16982B] hover:text-[#16982B]"
              >
                {page}
              </Link>
            );
          })}

          {currentPage === totalPage ? (
            <span className="inline-block w-6 h-6 leading-6 text-center rounded border border-[#e6e6e6] bg-[#fefefe] text-[#555] opacity-40 cursor-not-allowed">
              »
            </span>
          ) : (
            <Link
              href={`${baseUrl}${currentPage + 1}`}
              className="inline-block w-6 h-6 leading-6 text-center rounded border border-[#e6e6e6] bg-[#fefefe] text-[#555] hover:border-[#16982B] hover:text-[#16982B]"
            >
              »
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
