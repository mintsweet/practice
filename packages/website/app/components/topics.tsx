import Image from 'next/image';

const getTopics = async () => {
  const res = await fetch('http://localhost:3000/topics');
  return res.json();
};

export async function Topics() {
  const { items } = await getTopics();

  return (
    <ul>
      {items.map((topic: any) => (
        <li className="flex items-center px-4 bg-green-600/10">
          <div className="flex-none w-10 h-10">
            <a href={`/topics/${topic.id}`}>
              <img src="" alt="" />
            </a>
          </div>
          <div className="flex-auto flex items-center px-2">
            <span className="flex-none block mr-2 w-10 h-5 text-white text-sm text-center leading-normal bg-green-600 rounded">
              {topic.tab.sign}
            </span>
            <a href={`/topics/${topic.id}`} className="flex-auto truncate">
              {topic.title}
            </a>
          </div>
          <div className="flex-none flex items-center w-20">
            <span className="flex-1 flex items-center text-sm">
              <svg
                className="mr-1 w-[14px] h-[14px] text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              {topic.starCount}
            </span>
            <span className="flex-1 flex items-center text-sm">
              <svg
                className="mr-1 w-[14px] h-[14px] text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 19 16"
              >
                <path d="M12.5 3.046H10v-.928A2.12 2.12 0 0 0 8.8.164a1.828 1.828 0 0 0-1.985.311l-5.109 4.49a2.2 2.2 0 0 0 0 3.24L6.815 12.7a1.83 1.83 0 0 0 1.986.31A2.122 2.122 0 0 0 10 11.051v-.928h1a2.026 2.026 0 0 1 2 2.047V15a.999.999 0 0 0 1.276.961A6.593 6.593 0 0 0 12.5 3.046Z" />
              </svg>
              {topic.replyCount}
            </span>
          </div>
          <div className="flex-none w-30">
            <span className="text-sm">{topic.createdAt}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
