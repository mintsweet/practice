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
      <div className="text-center py-20 bg-white rounded-xl border border-zinc-200">
        <div className="text-6xl mb-4">📭</div>
        <p className="text-zinc-400 text-sm">No topics yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
      <div className="divide-y divide-zinc-100">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            to={`/topic/${topic.id}`}
            aria-label={`View topic: ${topic.title}`}
            className="group block hover:bg-zinc-50/70 transition-colors"
          >
            <div className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 pt-0.5">
                  <Avatar
                    title={topic.author.nickname}
                    size="sm"
                    src={topic.author.avatar}
                    name={topic.author.nickname}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-semibold text-zinc-800 group-hover:text-zinc-900 mb-2 line-clamp-2">
                    {topic.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span className="font-medium text-zinc-600">
                      {topic.author.nickname}
                    </span>
                    <span>{dayjs(topic.createdAt).fromNow()}</span>
                    <span className="flex items-center gap-1">
                      <Message size={13} />
                      {topic.replyCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={13} />
                      {topic.visitCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
