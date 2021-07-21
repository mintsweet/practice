import { Redirect } from 'react-router-dom';
import userStore from '@/store/user';

interface Props {
  children: JSX.Element;
}

export default function Authorized({ children }: Props) {
  const loginStatus = userStore.useState('status');
  return loginStatus === 1 ? children : <Redirect to="/login" />;
}
