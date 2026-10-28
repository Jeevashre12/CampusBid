import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { decideBid, deleteListing, getListing, getMediaUrl, placeBid } from '../services/api';
import { useAuth } from '../context/useAuth';

function formatDate(value) {
  return new Date(value).toLocaleString();
}

export default function AuctionDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [amount, setAmount] = useState('');
  const [state, setState] = useState({ loading: true, submitting: false, error: '', success: '' });

  const loadAuction = useCallback(async () => {
    try {
      const result = await getListing(id);
      setData(result);
      setState((current) => ({ ...current, loading: false, error: '' }));
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: error.response?.data?.message || 'Unable to load this auction.' }));
    }
  }, [id]);

  useEffect(() => { loadAuction(); }, [loadAuction]);

  const listing = data?.listing;
  const bids = data?.bids || [];
  const hasBids = Boolean(listing?.hasBids || bids.length);
  const minimumBid = useMemo(() => hasBids ? Number(listing.currentPrice) + Number(listing.minimumIncrement) : Number(listing?.startingPrice), [hasBids, listing]);
  const isSeller = user && listing?.seller?._id === user.id;
  const isClosed = !listing || listing.status !== 'ACTIVE' || new Date(listing.closesAt) <= new Date();

  async function removeListing() {
    if (!window.confirm('Delete this auction? This cannot be undone.')) return;
    setState((current) => ({ ...current, submitting: true, error: '' }));
    try {
      await deleteListing(id);
      navigate('/marketplace');
    } catch (error) {
      setState((current) => ({ ...current, submitting: false, error: error.response?.data?.message || 'Unable to delete this listing.' }));
    }
  }

  async function submit(event) {
    event.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/auctions/${id}` } } });
      return;
    }

    const bidAmount = Number(amount);
    if (!Number.isFinite(bidAmount) || bidAmount < minimumBid) {
      setState((current) => ({ ...current, error: `Your bid must be at least ₹${minimumBid}.`, success: '' }));
      return;
    }

    setState((current) => ({ ...current, submitting: true, error: '', success: '' }));
    try {
      const result = await placeBid(id, bidAmount);
      setAmount('');
      await loadAuction();
      setState((current) => ({ ...current, submitting: false, success: result.deadlineExtended ? 'Bid placed successfully. The auction deadline was extended by 60 seconds.' : 'Bid placed successfully.' }));
    } catch (error) {
      setState((current) => ({ ...current, submitting: false, error: error.response?.data?.message || 'Your bid could not be accepted. Refresh and try again.', success: '' }));
    }
  }

  async function reviewBid(bidId, decision) {
    setState((current) => ({ ...current, submitting: true, error: '', success: '' }));
    try {
      await decideBid(id, bidId, decision);
      await loadAuction();
      setState((current) => ({ ...current, submitting: false, success: `Bid ${decision.toLowerCase()} successfully.` }));
    } catch (error) {
      setState((current) => ({ ...current, submitting: false, error: error.response?.data?.message || 'Unable to update this bid.', success: '' }));
    }
  }

  if (state.loading) return <><NavBar /><main className="page"><p className="status">Loading auction...</p></main></>;
  if (state.error && !listing) return <><NavBar /><main className="page"><p className="status error">{state.error}</p><Link to="/marketplace">Back to marketplace</Link></main></>;

  return <><NavBar /><main className="page auction-detail">
    <Link className="muted" to="/marketplace">← Back to marketplace</Link>
    <div className="detail-layout">
      <section><div className="detail-image">{listing.photos?.[0] ? <img src={getMediaUrl(listing.photos[0])} alt={listing.title} /> : 'No photo'}</div><p className="eyebrow">{listing.category}</p><h1>{listing.title}</h1><p className="muted">{listing.condition} condition · Seller: {listing.seller?.name || 'Campus seller'}</p><p className="detail-description">{listing.description}</p>{isSeller && !isClosed && <button className="button delete-button" type="button" onClick={removeListing} disabled={state.submitting}>Delete listing</button>}</section>
      <aside className="bid-panel"><p className="eyebrow">Live auction</p><p className="bid-label">{hasBids ? 'Current highest bid' : 'Starting price'}</p><h2>₹{hasBids ? listing.currentPrice : listing.startingPrice}</h2><p className="muted">Minimum next bid: ₹{minimumBid}</p><p className="muted">Closes: {formatDate(listing.closesAt)}</p>
        {listing.status === 'CLOSED' && listing.winner ? <p className="winner-message"><strong>Auction won by {listing.winner.name}</strong><br />Final bid: ₹{listing.winningBid?.amount}</p> : listing.status === 'UNSOLD' ? <p className="muted">{isSeller && bids.some((bid) => (bid.status || 'PENDING') === 'PENDING') ? 'Review the pending bids below to select a winner.' : 'Auction ended without an approved winner.'}</p> : isSeller ? <p className="form-error">You cannot bid on your own auction.</p> : isClosed ? <p className="form-error">This auction is closed.</p> : <form onSubmit={submit} className="bid-form"><label>Your bid<input type="number" min={minimumBid} step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder={String(minimumBid)} required /></label><button className="button" type="submit" disabled={state.submitting}>{state.submitting ? 'Placing bid...' : user ? 'Place bid' : 'Sign in to bid'}</button></form>}
        {state.error && <p className="form-error" role="alert">{state.error}</p>}{state.success && <p className="success-message" role="status">{state.success}</p>}
      </aside>
    </div>
    <section className="bid-history"><h2>{isSeller ? 'Bids awaiting your decision' : 'Bid history'}</h2>{!bids.length ? <p className="muted">No bids yet. Be the first to bid at the starting price.</p> : <ul>{bids.map((bid) => { const bidStatus = bid.status || 'PENDING'; return <li key={bid._id || `${bid.amount}-${bid.createdAt}`}><span><strong>₹{bid.amount}</strong>{bid.bidder?.name && <small> · {bid.bidder.name}</small>}<br /><small className={`bid-status bid-status-${bidStatus.toLowerCase()}`}>{bidStatus}</small></span><span className="bid-actions">{isSeller && bidStatus === 'PENDING' && ['ACTIVE', 'UNSOLD'].includes(listing.status) ? <><button className="button button-small" type="button" onClick={() => reviewBid(bid._id, 'APPROVED')} disabled={state.submitting}>Approve</button><button className="button button-small reject-button" type="button" onClick={() => reviewBid(bid._id, 'REJECTED')} disabled={state.submitting}>Reject</button></> : <time>{formatDate(bid.createdAt)}</time>}</span></li>; })}</ul>}</section>
  </main></>;
}
