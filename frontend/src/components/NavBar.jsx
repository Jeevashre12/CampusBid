import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="nav">
      <Link className="brand" to="/">Campus<span>Bid</span></Link>
      <div className="nav-links">
        <Link to="/marketplace">Marketplace</Link>
        <Link to="/login" className="button button-small">Sign in</Link>
      </div>
    </nav>
  );
}

