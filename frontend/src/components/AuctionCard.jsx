export default function AuctionCard({ listing }) {
  return (
    <article className="auction-card">
      <div className="auction-image">{listing.photos?.[0] ? <img src={listing.photos[0]} alt={listing.title} /> : 'No photo'}</div>
      <div className="auction-card-body">
        <p className="eyebrow">{listing.category || 'Campus item'}</p>
        <h3>{listing.title}</h3>
        <p className="muted">{listing.condition || 'Good'} condition</p>
        <div className="card-footer"><strong>₹{listing.currentPrice ?? listing.startingPrice ?? 0}</strong><span>{listing.status || 'ACTIVE'}</span></div>
      </div>
    </article>
  );
}

