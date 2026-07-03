import { useState, useEffect, useCallback, useRef } from 'react';
import ListingCard from '../components/ListingCard';
import { getListings } from '../services/listingService';
import { getProfile } from '../services/profileService';
import useAuth from '../hooks/useAuth';

const SkeletonCard = () => (
  <div style={{
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  }}>
    {[100, 60, 80].map((w) => (
      <div key={w} style={{
        height: '14px',
        width: `${w}%`,
        borderRadius: 'var(--radius-sm)',
        background: 'var(--color-surface-raised)',
        animation: 'pulse 1.5s ease-in-out infinite',
      }} />
    ))}
  </div>
);

const inputStyle = {
  padding: '0.65rem 0.85rem',
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--color-text)',
  fontSize: '0.9rem',
  width: '100%',
};

const Listings = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const [otherListings, setOtherListings] = useState([]);
  const [loadingOther, setLoadingOther] = useState(false);

  const [filters, setFilters] = useState({ location: '', minBudget: '', maxBudget: '' });
  const [applied, setApplied] = useState({});
  const initFetched = useRef(false);

  // Initialize filters from profile
  useEffect(() => {
    if (user?.role === 'tenant' && !initFetched.current) {
      getProfile().then(({ data }) => {
        if (data?.data) {
          const prof = data.data;
          const initialFilters = {
            location: prof.preferredLocation || '',
            minBudget: prof.budgetMin || '',
            maxBudget: prof.budgetMax || ''
          };
          setFilters(initialFilters);
          setApplied(initialFilters);
        }
      }).catch(() => {});
      initFetched.current = true;
    }
  }, [user]);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setOtherListings([]);
    try {
      const params = { page, limit: 12, ...applied };
      Object.keys(params).forEach((k) => (params[k] === '' || params[k] === null || params[k] === undefined) && delete params[k]);
      const { data } = await getListings(params);
      setListings(data.data.listings);
      setTotalCount(data.data.totalCount);
      
      if (data.data.listings.length === 0 && Object.keys(params).length > 2) {
        setLoadingOther(true);
        try {
          const { data: otherData } = await getListings({ page: 1, limit: 6 });
          setOtherListings(otherData.data.listings);
        } catch (e) {
          setOtherListings([]);
        } finally {
          setLoadingOther(false);
        }
      }
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
        gap: '1rem',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        marginBottom: '2rem',
        padding: '1.25rem',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ flex: '1 1 180px' }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Location</label>
          <input id="filter-location" value={filters.location} onChange={(e) => setFilters((p) => ({ ...p, location: e.target.value }))} placeholder="e.g. Mumbai" style={inputStyle} />
        </div>
        <div style={{ flex: '1 1 130px' }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Min Budget</label>
          <input id="filter-min" type="number" value={filters.minBudget} onChange={(e) => setFilters((p) => ({ ...p, minBudget: e.target.value }))} placeholder="0" style={inputStyle} />
        </div>
        <div style={{ flex: '1 1 130px' }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Max Budget</label>
          <input id="filter-max" type="number" value={filters.maxBudget} onChange={(e) => setFilters((p) => ({ ...p, maxBudget: e.target.value }))} placeholder="100000" style={inputStyle} />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button id="filter-apply" onClick={handleApply} style={{ padding: '0.65rem 1.25rem', background: 'var(--color-primary)', color: '#ffffff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'inherit', cursor: 'pointer', fontWeight: 600, transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}>Apply</button>
          <button id="filter-reset" onClick={handleReset} style={{ padding: '0.65rem 1.25rem', background: 'transparent', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontFamily: 'inherit', cursor: 'pointer', fontWeight: 600, transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-raised)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>Reset</button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : listings.length === 0 ? (
        <>
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', marginBottom: '2rem' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>No listings match your strict filters.</p>
            <button onClick={handleReset} style={{ padding: '0.65rem 1.25rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Clear Filters</button>
          </div>
          
          {loadingOther ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : otherListings.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>Other listings you might like</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {otherListings.map((l) => <ListingCard key={l._id} listing={l} score={null} />)}
              </div>
            </div>
          )}
        </>
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
