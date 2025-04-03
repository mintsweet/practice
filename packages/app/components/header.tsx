import Link from 'next/link';

export default function Header({ user }: { user?: boolean }) {
  return (
    <header className="bg-white shadow-md">
      <div className="flex items-center w-[960px] mx-auto h-[50px]">
        <Link href="/" className="w-[50px] h-[50px] flex-shrink-0">
          <img src="/logo.png" alt="logo" className="w-full h-full" />
        </Link>

        <form
          action="/topics/search"
          className="hidden sm:block ml-16 w-[180px] relative"
        >
          <input
            type="text"
            name="q"
            placeholder="请输入搜索内容"
            required
            autoComplete="off"
            className="w-full h-[36px] px-2 text-sm border-b border-gray-300 focus:border-green-700 transition-all outline-none"
          />
          <button
            type="submit"
            title="搜索"
            className="absolute top-[5px] right-0 text-gray-500 hover:text-green-700"
          >
            🔍
          </button>
        </form>

        <ul className="hidden sm:flex ml-auto text-sm">
          {[{ name: '首页', url: '/' }].map((item) => (
            <li key={item.url} className="mr-5">
              <Link
                href={item.url}
                target={item.url.startsWith('http') ? '_blank' : '_self'}
              >
                {item.name}
              </Link>
            </li>
          ))}
          {user ? (
            <>
              <li className="mr-5">
                <Link href="/notice/user">我的消息</Link>
              </li>
              <li>
                <Link href="/signout">退出登录</Link>
              </li>
            </>
          ) : (
            <>
              <li className="mr-5">
                <Link href="/signup">注册</Link>
              </li>
              <li>
                <Link href="/signin">登录</Link>
              </li>
            </>
          )}
        </ul>

        <h1 className="block sm:hidden text-center flex-grow text-lg">{`Mints.`}</h1>

        <div className="sm:hidden w-[50px] h-[50px] relative">
          <span className="absolute left-1/2 top-1/2 w-[22px] h-[2px] bg-green-700 transform -translate-x-1/2 -translate-y-3"></span>
          <span className="absolute left-1/2 top-1/2 w-[22px] h-[2px] bg-green-700 transform -translate-x-1/2"></span>
          <span className="absolute left-1/2 top-1/2 w-[22px] h-[2px] bg-green-700 transform -translate-x-1/2 translate-y-3"></span>
        </div>
      </div>
    </header>
  );
}
