export default function Footer() {
  return (
    <footer className="border-t border-gray-300 bg-white text-sm">
      <div className="hidden sm:flex justify-between items-start w-[960px] mx-auto py-5">
        <div className="flex-shrink-0 w-[240px]">
          <div className="mb-2">
            <span className="inline-block mr-2">🏠</span>
            <span>Mints.</span>
          </div>
          <div className="text-gray-600">
            <span>联系我们：</span>
            <a
              className="inline-block ml-1 text-green-700"
              href="https://github.com/mintsweet/practice"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>

        <ul className="flex flex-1 justify-around">
          <li>
            <div className="font-bold mb-1">About</div>
            <div className="space-y-1">
              <a
                href="https://github.com/mintsweet/practice"
                target="_blank"
                rel="noopener noreferrer"
              >
                关于本站
              </a>
              <a
                href="https://github.com/mintsweet/practice/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                反馈与建议
              </a>
              <a
                href="https://github.com/mintsweet/practice/pulls"
                target="_blank"
                rel="noopener noreferrer"
              >
                加入我们
              </a>
            </div>
          </li>
          <li>
            <div className="font-bold mb-1">开发者</div>
            <div className="space-y-1">
              <a
                href="https://github.com/mintsweet/practice/wiki/代码规范"
                target="_blank"
                rel="noopener noreferrer"
              >
                开发者指南
              </a>
              <a
                href="https://github.com/mintsweet/practice/wiki/API"
                target="_blank"
                rel="noopener noreferrer"
              >
                API
              </a>
            </div>
          </li>
        </ul>
      </div>

      <div className="sm:hidden text-center py-2">
        <a
          href="https://github.com/mintsweet/practice"
          target="_blank"
          rel="noopener noreferrer"
        >
          关于本站
        </a>
        <span className="mx-2">·</span>
        <a
          href="https://github.com/mintsweet/practice"
          target="_blank"
          rel="noopener noreferrer"
        >
          源码
        </a>
        <span className="mx-2">·</span>
        <a
          href="https://github.com/mintsweet/practice/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          反馈与建议
        </a>
      </div>

      <div className="text-center bg-green-100 py-2">
        <p>&copy; 2019-2021 All Rights Reserved</p>
      </div>
    </footer>
  );
}
