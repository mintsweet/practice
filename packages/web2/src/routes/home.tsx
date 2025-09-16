import { useAuth } from '@/auth-context';

export function Home() {
  const { user } = useAuth();
  console.log(user);
  return <div>Home</div>;
}
