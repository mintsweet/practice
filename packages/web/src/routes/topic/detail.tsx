import { operator } from '@mints/request';
import { useRequest } from '@mints/request/react';
import {
  Avatar,
  Button,
  TextArea,
  toast,
  Star,
  Message,
  Layers,
  Eye,
} from '@mints/ui';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams, Link } from 'react-router';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import API from '@/api';
import { useAuth } from '@/auth-context';

export function TopicDetail() {
  const { topicId } = useParams();

  if (!topicId) {
    return null;
  }

  return <TopicDetailContent topicId={topicId} />;
}

function TopicDetailContent({ topicId }: { topicId: string }) {
  const [version, setVersion] = useState(0);
  const [replyContent, setReplyContent] = useState('');

  const { user } = useAuth();

  const { loading, data } = useRequest(
    () => API.topic.queryById(topicId),
    [version],
  );

  const handleReaction = async (action: 'like' | 'collect') => {
    if (!user) {
      toast.error('Please sign in first');
      return;
    }

    const apiCall = {
      like: liked
        ? () => API.topic.removeLike(topicId)
        : () => API.topic.addLike(topicId),
      collect: collected
        ? () => API.topic.removeCollect(topicId)
        : () => API.topic.addCollect(topicId),
    };
    const [success] = await operator(() => apiCall[action]());

    if (success) {
      setVersion((v) => v + 1);
    }
  };

  const handleReply = async (parentReplyId?: string) => {
    if (!user) {
      toast.error('Please sign in first');
      return;
    }
    if (!replyContent) {
      return;
    }

    const [success] = await operator(() =>
      API.topic.reply(topicId, { content: replyContent, parentReplyId }),
    );

    if (success) {
      setReplyContent('');
      setVersion((v) => v + 1);
    }
  };

  if (loading || !data) {
    return null;
  }

  const {
    id,
    title,
    content,
    author,
    likeCount,
    replyCount,
    collectCount,
    visitCount,
    createdAt,
    replys,
    liked,
    collected,
  } = data;

  return (
    <div className="bg-zinc-50 flex-1">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-xl border border-zinc-200 shadow-xl overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
                  <div className="flex items-center gap-4">
                    <Link to={`/user/${author.id}`} className="flex-shrink-0">
                      <Avatar
                        src={author.avatar}
                        name={author.nickname ?? author.email}
                        className="w-12 h-12 ring-2 ring-zinc-100 hover:ring-zinc-200 transition"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/user/${author.id}`}
                        className="font-semibold text-zinc-900 hover:text-zinc-700 transition-colors"
                      >
                        {author.nickname ?? author.email}
                      </Link>
                      <div className="flex items-center gap-3 mt-1 text-sm text-zinc-500">
                        <span>
                          {dayjs(createdAt).format('YYYY-MM-DD HH:mm')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={16} /> {visitCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:flex-shrink-0">
                    <button
                      className={clsx(
                        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                        liked
                          ? 'bg-zinc-900 text-white'
                          : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200',
                      )}
                      onClick={() => handleReaction('like')}
                    >
                      <Star size={16} className={liked ? 'fill-white' : ''} />
                      <span>{likeCount}</span>
                    </button>
                    <button
                      className={clsx(
                        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                        collected
                          ? 'bg-zinc-900 text-white'
                          : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200',
                      )}
                      onClick={() => handleReaction('collect')}
                    >
                      <Layers
                        size={16}
                        className={collected ? 'fill-white' : ''}
                      />
                      <span>{collectCount}</span>
                    </button>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-50 text-sm text-zinc-600">
                      <Message size={16} />
                      <span>{replyCount}</span>
                    </div>
                  </div>
                </div>

                <h1 className="text-2xl font-bold mb-6 text-zinc-900 leading-tight">
                  {title}
                </h1>

                <article className="max-w-none markdown-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  >
                    {content}
                  </ReactMarkdown>
                </article>

                {user && user.id === author.id && (
                  <div className="flex gap-3 mt-8 pt-6 border-t border-zinc-100">
                    <Link to={`/topic/${id}/edit`}>
                      <Button variant="outline" className="text-sm">
                        ✏️ Edit
                      </Button>
                    </Link>
                    <Link to={`/topic/${id}/delete`}>
                      <Button
                        variant="outline"
                        className="text-sm text-red-600 border-red-200 hover:bg-red-50"
                      >
                        🗑️ Delete
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div
              id="reply"
              className="bg-white rounded-xl border border-zinc-200 shadow-xl p-6"
            >
              <h2 className="text-lg font-bold mb-6 text-zinc-900 flex items-center gap-2">
                <span className="text-base">💬</span>
                Comments
              </h2>

              {user ? (
                <form className="flex flex-col gap-3 mb-6 bg-zinc-50 rounded-lg p-4">
                  <div className="flex gap-3 items-start">
                    <Avatar
                      name={user.nickname ?? user.email}
                      className="w-10 h-10 ring-2 ring-zinc-100"
                    />
                    <TextArea
                      className="w-full"
                      rows={3}
                      placeholder="Share your thoughts..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                    />
                  </div>
                  <Button
                    className="self-end text-sm"
                    disabled={!replyContent}
                    onClick={() => handleReply()}
                  >
                    Post Comment
                  </Button>
                </form>
              ) : (
                <div className="bg-zinc-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-zinc-600">
                    Please{' '}
                    <Link
                      to="/signin"
                      className="text-zinc-900 hover:text-zinc-700 underline font-medium"
                    >
                      sign in
                    </Link>{' '}
                    to join the discussion
                  </p>
                </div>
              )}

              <ul className="space-y-6">
                {replys && replys.length > 0 ? (
                  replys.map((it) => (
                    <li
                      key={it.id}
                      className="flex gap-3 pb-6 border-b border-zinc-100 last:border-b-0 last:pb-0"
                    >
                      <Link to={`/user/${it.author.id}`}>
                        <Avatar
                          name={it.author.nickname ?? it.author.email}
                          className="w-10 h-10 ring-2 ring-zinc-100 hover:ring-zinc-200 transition"
                        />
                      </Link>
                      <div className="flex-1 text-sm">
                        <div className="flex justify-between items-start mb-2">
                          <Link
                            to={`/user/${it.author.id}`}
                            className="font-semibold text-zinc-900 hover:text-zinc-700 transition"
                          >
                            {it.author.nickname ?? it.author.email}
                          </Link>
                          <span className="text-xs text-zinc-400">
                            {it.createdAt}
                          </span>
                        </div>
                        <div className="text-zinc-700 leading-relaxed">
                          {it.content}
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-center text-sm text-zinc-400 py-8">
                    <div className="text-3xl mb-2">💭</div>
                    No comments yet
                  </li>
                )}
              </ul>
            </div>
          </div>

          <aside className="w-full lg:w-[280px] shrink-0">
            <div className="sticky top-20 space-y-4">
              <div className="bg-white rounded-xl border border-zinc-200 shadow-xl p-5">
                <h2 className="text-sm font-bold mb-4 text-zinc-900 flex items-center gap-2">
                  <span className="text-base">✍️</span>
                  Author
                </h2>
                <Link
                  to={`/user/${author.id}`}
                  className="flex items-center gap-3 mb-4 group"
                >
                  <Avatar
                    name={author.nickname ?? author.email}
                    className="w-12 h-12 ring-2 ring-zinc-100 group-hover:ring-zinc-200 transition"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-zinc-900 group-hover:text-zinc-700 transition truncate">
                      {author.nickname ?? author.email}
                    </div>
                    <div className="text-xs text-zinc-500">View Profile</div>
                  </div>
                </Link>
                <div className="text-xs text-zinc-600 italic bg-zinc-50 rounded-lg p-3 leading-relaxed">
                  {'"'}Keep it simple, but significant{'"'}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
