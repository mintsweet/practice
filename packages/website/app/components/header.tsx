import Link from 'next/link';
import Image from 'next/image';

const getTabs = async () => {
  const res = await fetch('http://localhost:3000/tabs');
  return res.json();
};

export async function Header() {
  const tabs = await getTabs();

  return (
    <header className="h-14 border-t-4 border-green-600">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1 flex items-center">
          <Link className="w-12" href="/">
            <Image src="/logo.png" width={50} height={50} alt="Logo" />
          </Link>
          <div className="ml-2 w-60">
            <input className="w-60 h-8 border" type="text" />
          </div>
        </div>
        <ul className="flex-auto flex items-center">
          {[{ sign: 'top' }, { sign: 'good' }, ...tabs].map((tab: any) => (
            <li className="flex-1" key={tab.sign}>
              <Link href={`/topics?tab=${tab.sign}`}>{tab.sign}</Link>
            </li>
          ))}
          <li className="flex-1">
            <Link href="/signup">Signup</Link>
          </li>
          <li className="flex-1">
            <Link href="/signin">Signin</Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
