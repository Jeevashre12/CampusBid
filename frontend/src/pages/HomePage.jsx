import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

export default function HomePage() {
  return (
    <div><NavBar /><main className="hero">
      <div className="hero-copy"><p className="eyebrow">Buy smart. Sell local.</p><h1>Your campus marketplace, made transparent.</h1><p className="hero-text">Find affordable essentials from seniors, place fair bids, and complete handovers safely on campus.</p><div className="actions"><Link className="button" to="/marketplace">Explore auctions</Link><Link className="button button-ghost" to="/register">Join CampusBid</Link></div></div>
      <div className="hero-card"><span className="hero-icon">↗</span><p>Every bid is visible.</p><strong>Fair deals for campus life.</strong></div>
    </main></div>
  );
}

