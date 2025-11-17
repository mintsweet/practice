import { useUrlState } from '@mints/hooks';
import { useRequest } from '@mints/request/react';
import { Avatar, Button, Pagination } from '@mints/ui';
import { Link } from 'react-router';

import API from '@/api';
import { useAuth } from '@/auth-context';

import { SectionList } from './section-list';
import { TopicList } from './topic-list';

export function Home() {
  const [{ page }] = useUrlState({
    page: 1,
  });

  const { user } = useAuth();

  const { loading, data } = useRequest(async () => {
    const [sections, topics] = await Promise.all([
      API.section.query(),
      API.topic.query({ page }),
    ]);

    return {
      sections,
      topics,
    };
  });

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  const { sections, topics } = data;

  return (
    <>
      <SectionList sections={sections} />

      <div className="bg-zinc-50 flex-1">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex gap-6">
            <aside className="hidden lg:block w-[240px] shrink-0">
              <div className="sticky top-20 space-y-4">
                {user ? (
                  <>
                    <Link
                      to="/user/setting"
                      className="block bg-white rounded-xl p-5 border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar
                            src={user.avatar}
                            name={user.nickname ?? user.email}
                            className="w-12 h-12 ring-2 ring-zinc-100 group-hover:ring-zinc-200 transition"
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-zinc-900 truncate">
                            {user.nickname}
                          </div>
                          <div className="text-xs text-zinc-500">
                            View Profile
                          </div>
                        </div>
                      </div>
                    </Link>

                    <Link
                      to="/topic/create"
                      className="block bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl p-4 text-center font-medium text-sm shadow-sm hover:shadow-md transition-all"
                    >
                      <svg
                        className="w-5 h-5 inline-block mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Create Topic
                    </Link>
                  </>
                ) : (
                  <div className="bg-white rounded-xl p-5 border border-zinc-200">
                    <div className="text-3xl mb-3 text-center">👋</div>
                    <h3 className="text-sm font-bold text-zinc-900 mb-2 text-center">
                      Join Mints
                    </h3>
                    <p className="text-xs text-zinc-600 mb-3 leading-relaxed">
                      Create topics, join discussions, meet like-minded people
                    </p>
                    <Link to="/signup" className="block">
                      <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800 text-sm py-2">
                        Register Now
                      </Button>
                    </Link>
                  </div>
                )}

                <div className="bg-white rounded-xl p-4 border border-zinc-200">
                  <h3 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">
                    <span className="text-base">📊</span>
                    Community Stats
                  </h3>
                  <div className="space-y-2 text-xs text-zinc-600">
                    <div className="flex justify-between">
                      <span>Total Topics</span>
                      <span className="font-semibold text-zinc-900">
                        {topics.total}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sections</span>
                      <span className="font-semibold text-zinc-900">
                        {sections.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
            <div className="flex-1 min-w-0">
              <TopicList topics={topics.topics} />
              <Pagination
                className="mt-6"
                current={page}
                total={topics.total}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
