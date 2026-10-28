import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import AuctionCard from '../components/AuctionCard';
import { getListings } from '../services/api';

export default function MarketplacePage() {
  const [listings, setListings] = useState([]);
  const [state, setState] = useState('loading');
  useEffect(() => { getListings().then((data) => { setListings(data.listings || []); setState('ready'); }).catch(() => setState('error')); }, []);
  return <><NavBar /><main className="page"><div className="page-heading"><div><p className="eyebrow">Discover</p><h1>Live campus auctions</h1></div><Link className="button" to="/register">Sell an item</Link></div>
    {state === 'loading' && <p className="status">Loading auctions...</p>}{state === 'error' && <p className="status error">Could not reach the API. Start the backend and refresh.</p>}{state === 'ready' && !listings.length && <div className="empty"><h2>No live auctions yet</h2><p>Be the first senior to list something useful.</p></div>}
    <div className="auction-grid">{listings.map((listing) => <AuctionCard key={listing._id} listing={listing} />)}</div>
  </main></>;
}
