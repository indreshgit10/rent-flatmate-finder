import { useState, useEffect, useCallback } from 'react';
import ListingCard from '../components/ListingCard';
import { getListings } from '../services/listingService';

const SkeletonCard = () => (
  <div style={{
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '10px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  }}>
    {[100, 60, 80].map((w) => (
      <div key={w} style={{
        height: '14px',
        width: `${w}%`,
        borderRadius: '4px',
        background: 'var(--color-surface-raised)',
        animation: 'pulse 1.5s ease-in-out infinite',
      }} />
    ))}
  </div>
);

const inputStyle = {
  padding: '0.5rem 0.75rem',
  background: 'var(--color-surface-raised)',
  border: '1px solid var(--color-border)',
  borderRadius: '6px',
  color: 'var(--color-text)',
  fontSize: '0.9rem',
  outline: 'none',
  width: '100%',
};

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({ location: '', minBudget: '', maxBudget: '' });
  const [applied, setApplied] = useState({});

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, ...applied };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const { data } = await getListings(params);
      setListings(data.data.listings);
      setTotalCount(data.data.totalCount);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [applied, page]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  const handleApply = () => { setPage(1); setApplied({ ...filters }); };
  const handleReset = () => { setFilters({ location: '', minBudget: '', maxBudget: '' }); setApplied({}); setPage(1); };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>

      <h1 style={{ fontSize: '1.7rem', fontWeight: 700, marginBottom: '1.5rem' }}>Browse Listings</h1>

      <div style={{
        display: 'flex',
        gap: '0.75rem',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        marginBottom: '1.5rem',
        padding: '1rem',
        background: 'var(--color-surface)',
        borderRadius: '10px',
        border: '1px solid var(--color-border)',
      }}>
        <div style={{ flex: '1 1 180px' }}>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Location</label>
          <input id="filter-location" value={filters.location} onChange={(e) => setFilters((p) => ({ ...p, location: e.target.value }))} placeholder="e.g. Mumbai" style={inputStyle} />
        </div>
        <div style={{ flex: '1 1 130px' }}>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Min Budget</label>
          <input id="filter-min" type="number" value={filters.minBudget} onChange={(e) => setFilters((p) => ({ ...p, minBudget: e.target.value }))} placeholder="0" style={inputStyle} />
        </div>
        <div style={{ flex: '1 1 130px' }}>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Max Budget</label>
          <input id="filter-max" type="number" value={filters.maxBudget} onChange={(e) => setFilters((p) => ({ ...p, maxBudget: e.target.value }))} placeholder="100000" style={inputStyle} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button id="filter-apply" onClick={handleApply} style={{ padding: '0.5rem 1.1rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '6px', fontFamily: 'inherit', cursor: 'pointer', fontWeight: 600 }}>Apply</button>
          <button id="filter-reset" onClick={handleReset} style={{ padding: '0.5rem 1.1rem', background: 'var(--color-surface-raised)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', borderRadius: '6px', fontFamily: 'inherit', cursor: 'pointer' }}>Reset</button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : listings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
          <p style={{ fontSize: '1.1rem' }}>No listings match your filters.</p>
          <button onClick={handleReset} style={{ marginTop: '1rem', padding: '0.5rem 1.2rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit' }}>Clear Filters</button>
        </div>
      ) : (
        <>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>{totalCount} listing{totalCount !== 1 ? 's' : ''} found</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {listings.map((l) => <ListingCard key={l._id} listing={l} score={null} />)}
          </div>
          {totalCount > 12 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} style={{ padding: '0.4rem 0.9rem', background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: '6px', cursor: page === 1 ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>Prev</button>
              <span style={{ alignSelf: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Page {page}</span>
              <button disabled={page * 12 >= totalCount} onClick={() => setPage((p) => p + 1)} style={{ padding: '0.4rem 0.9rem', background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: '6px', cursor: page * 12 >= totalCount ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Listings;
