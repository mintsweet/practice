import Link from 'next/link';

interface User {
  _id: string;
  nickname: string;
  score: number;
}

interface UsersTopProps {
  top100: User[];
}

export default function UserTop({ top100 }: UsersTopProps) {
  return (
    <div className="bg-[#fefefe] rounded p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-base font-bold">积分榜</span>
        <Link href="/users/top100" className="text-sm text-[#16982B]">
          更多
        </Link>
      </div>
      <ul className="space-y-1 text-sm text-[#555]">
        {top100.length > 0 ? (
          top100.map((item) => (
            <li key={item._id} className="flex justify-between">
              <Link href={`/user/${item._id}`} className="hover:text-[#16982B]">
                {item.nickname}
              </Link>
              <span className="text-[#16982B]">{item.score}</span>
            </li>
          ))
        ) : (
          <li className="text-[#8a8a8a]">暂无数据</li>
        )}
      </ul>
    </div>
  );
}
