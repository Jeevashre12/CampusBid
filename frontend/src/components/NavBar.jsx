import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function NavBar() {
  const { user, logout } = useAuth();
  return (
    <nav className="nav">
      <Link className="brand" to="/">Campus<span>Bid</span></Link>
      <div className="nav-links">
        <Link to="/marketplace">Marketplace</Link>
        {user ? <><span className="nav-user">Hi, {user.name}</span><button type="button" className="button button-small button-plain" onClick={logout}>Sign out</button></> : <Link to="/login" className="button button-small">Sign in</Link>}
      </div>
    </nav>
  );
}
