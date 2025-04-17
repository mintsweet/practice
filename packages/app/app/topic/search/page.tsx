import Topics from '@/components/topics';

interface Props {
  searchParams: {
    q: string;
    page?: string;
  };
}

export default function TopicSearchPage({ searchParams }: Props) {
  const q = searchParams.q || '';
  const currentPage = parseInt(searchParams.page || '1');
  const config = {
    API: 'https://api.example.com',
    tabs: {
      share: '分享',
      ask: '问答',
      job: '招聘',
    },
  };

  const topics = []; // TODO: 搜索结果列表（mock 或接口）
  const total = 0; // TODO: 总数
  const totalPage = 1; // TODO: 页数

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-4 py-6">
      <div className="bg-[#fefefe] rounded p-4">
        <h2 className="text-lg font-bold mb-2">搜索结果</h2>
        <p className="text-sm text-[#555]">
          关于“<strong className="text-[#16982B]">{q}</strong>
          ”的结果，共查询到
          <strong className="text-[#16982B]">{total}</strong> 条数据
        </p>
      </div>

      <Topics
        topics={topics}
        config={config}
        currentPage={currentPage}
        totalPage={totalPage}
        tab=""
      />
    </div>
  );
}
