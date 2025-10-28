import { Link } from 'react-router';

export const Logo = () => {
  return (
    <Link to="/">
      <img src="/logo.svg" alt="Logo" className="w-full h-full" />
    </Link>
  );
};
