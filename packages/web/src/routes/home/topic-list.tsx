import { Avatar, Message, Eye } from '@mints/ui';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link } from 'react-router';

dayjs.extend(relativeTime);

import type { ITopic } from '@/api/topic';

interface Props {
  topics: ITopic[];
}

export function TopicList({ topics }: Props) {
  if (topics.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-zinc-200">
        <div className="text-5xl mb-3">📭</div>
        <p className="text-zinc-400">暂无内容</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-100 rounded-lg border border-zinc-200 bg-zinc-50/30 overflow-hidden">
      {topics.map((topic) => (
        <Link
          key={topic.id}
          to={`/topic/${topic.id}`}
          aria-label={`View topic: ${topic.title}`}
          className="group block bg-white hover:bg-zinc-50 transition-all duration-200 hover:-translate-y-[1px]"
        >
          <div className="p-3 sm:p-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <Avatar
                  title={topic.author.nickname}
                  size="sm"
                  src={topic.author.avatar}
                  name={topic.author.nickname}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-zinc-700 group-hover:text-zinc-900 transition-colors duration-200 truncate">
                  {topic.title}
                </h3>
              </div>

              <div className="flex-shrink-0 flex items-center gap-3 text-xs text-zinc-500">
                <span className="hidden sm:inline">
                  {dayjs(topic.createdAt).fromNow()}
                </span>
                <span className="w-px h-3 bg-zinc-300/50" />
                <span className="flex items-center gap-1 hover:text-zinc-800 transition-colors">
                  <Message size={14} />
                  <span className="hidden sm:inline">{topic.replyCount}</span>
                </span>
                <span className="flex items-center gap-1 hover:text-zinc-800 transition-colors">
                  <Eye size={14} />
                  <span className="hidden sm:inline">{topic.visitCount}</span>
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
