export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white mt-12">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>&copy; 2025 Mints. All Rights Reserved</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-zinc-900 transition">
              关于我们
            </a>
            <a href="#" className="hover:text-zinc-900 transition">
              使用条款
            </a>
            <a href="#" className="hover:text-zinc-900 transition">
              隐私政策
            </a>
            <a href="#" className="hover:text-zinc-900 transition">
              联系我们
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
