import Link from 'next/link';

interface TopicNoReplyProps {
  noReplyTopic?: {
    _id: string;
    title: string;
  }[];
}

export default function TopicsNoReply({
  noReplyTopic = [],
}: TopicNoReplyProps) {
  return (
    <div className="bg-[#fefefe] rounded p-4">
      <h2 className="text-base font-bold mb-2">无人回复的话题</h2>
      <ul className="space-y-2 text-sm text-[#8a8a8a]">
        {noReplyTopic.length > 0 ? (
          noReplyTopic.map((item) => (
            <li key={item._id}>
              <Link
                href={`/topic/${item._id}`}
                title={item.title}
                className="block truncate hover:text-[#16982B]"
              >
                {item.title}
              </Link>
            </li>
          ))
        ) : (
          <li>暂无话题</li>
        )}
      </ul>
    </div>
  );
}
