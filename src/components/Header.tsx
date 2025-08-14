import { useUser } from '../hooks/useUser';
import { Link } from 'wouter';
import './Header.css';

export const Header = () => {
  const { data: user } = useUser();

  return (
    <header className="app-header">
      <Link href="/dashboard">
        <a className="logo">UniDash</a>
      </Link>
      {user && (
        <Link href="/profile">
          <a className="profile-link">
            <img src={user.avatarUrl} alt={user.name} />
          </a>
        </Link>
      )}
    </header>
  );
};