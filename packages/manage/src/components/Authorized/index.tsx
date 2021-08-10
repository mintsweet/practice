import { Redirect } from 'react-router-dom';
import userStore from '@/store/user';

interface Props {
  role?: number;
  noAuth?: JSX.Element;
  children: JSX.Element;
}

export default function Authorized({ role, noAuth, children }: Props) {
  const loginStatus = userStore.useState('status');
  const userInfo = userStore.useState('info');

  if (loginStatus !== 1) {
    return <Redirect to="/login" />;
  }

  return role && role > (userInfo?.role || 0) ? noAuth || null : children;
}
