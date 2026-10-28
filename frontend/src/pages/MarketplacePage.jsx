import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import AuctionCard from '../components/AuctionCard';
import { getListings } from '../services/api';
import { useAuth } from '../context/useAuth';

export default function MarketplacePage() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [state, setState] = useState('loading');
  const [filters, setFilters] = useState({ search: '', minPrice: '', maxPrice: '' });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  useEffect(() => { setState('loading'); getListings(appliedFilters).then((data) => { setListings(data.listings || []); setState('ready'); }).catch(() => setState('error')); }, [appliedFilters]);
  function updateFilter(event) {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  }
  function submitFilters(event) {
    event.preventDefault();
    setAppliedFilters({ ...filters });
  }
  function clearFilters() {
    const emptyFilters = { search: '', minPrice: '', maxPrice: '' };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  }
  const sellPath = user ? '/create-listing' : '/register';
  return <><NavBar /><main className="page"><div className="page-heading"><div><p className="eyebrow">Discover</p><h1>Live campus auctions</h1></div><Link className="button" to={sellPath}>Sell an item</Link></div>
    <form className="marketplace-filters" onSubmit={submitFilters}><input name="search" value={filters.search} onChange={updateFilter} placeholder="Search by item name or category" aria-label="Search by item name or category" /><input name="minPrice" type="number" min="0" step="0.01" value={filters.minPrice} onChange={updateFilter} placeholder="Minimum price" aria-label="Minimum price" /><input name="maxPrice" type="number" min="0" step="0.01" value={filters.maxPrice} onChange={updateFilter} placeholder="Maximum price" aria-label="Maximum price" /><button className="button" type="submit">Search</button><button className="button button-ghost" type="button" onClick={clearFilters}>Clear</button></form>
    {state === 'loading' && <p className="status">Loading auctions...</p>}{state === 'error' && <p className="status error">Could not load auctions. Check the filters and try again.</p>}{state === 'ready' && !listings.length && <div className="empty"><h2>No matching auctions</h2><p>Try a different name, category, or price range.</p></div>}
    <div className="auction-grid">{listings.map((listing) => <AuctionCard key={listing._id} listing={listing} />)}</div>
  </main></>;
}
