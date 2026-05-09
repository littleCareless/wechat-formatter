import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t-2 border-black py-12 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white">TypeZen</div>
        <p className="text-slate-500 font-medium text-center md:text-left">© {new Date().getFullYear()} TypeZen. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/editor" className="text-slate-600 hover:text-black dark:hover:text-white font-medium">进入编辑器</Link>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer nofollow" className="text-slate-600 hover:text-black dark:hover:text-white font-medium">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
