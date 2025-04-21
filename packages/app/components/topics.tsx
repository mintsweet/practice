import type { ITopic } from '@/lib/topic';

interface Props {
  topics: ITopic[];
}

export function Topics({ topics }: Props) {
  return (
    <div>
      {topics.length === 0 && (
        <div className="text-center text-zinc-400 py-10">暂无内容</div>
      )}

      {topics.map((topic) => (
        <div
          key={topic.id}
          className="bg-white rounded p-4 shadow mb-4 border border-zinc-100"
        >
          <div className="text-sm text-zinc-500 mb-1 flex items-center gap-2">
            <span className="font-medium text-zinc-800">
              {topic.author.nickname}
            </span>
            <span>· 分享于 {topic.createdAt}</span>
          </div>

          <a
            href={`/topic/${topic.id}`}
            className="block text-lg font-semibold text-zinc-800 hover:underline"
          >
            {topic.title}
          </a>

          <p className="text-sm text-zinc-700 mt-2 line-clamp-2">
            {topic.content}
          </p>

          <div className="flex flex-wrap gap-2 text-xs text-zinc-600 mt-3">
            {topic.tags.map((tag) => (
              <span key={tag} className="bg-zinc-100 px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-4 text-xs text-zinc-500 mt-3">
            <span>👍 {topic.like}</span>
            <span>💬 {topic.comment}</span>
            <span>👀 {topic.view} 次浏览</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Topics;
