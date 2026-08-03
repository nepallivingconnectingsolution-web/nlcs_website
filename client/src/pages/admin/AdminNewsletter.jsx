import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios.js';
import Icon from '../../components/Icon.jsx';

function toCsv(rows) {
  const header = 'email,status,source,subscribedAt\n';
  const body = rows
    .map((r) => [r.email, r.status, r.source, new Date(r.createdAt).toISOString()].join(','))
    .join('\n');
  return header + body;
}

export default function AdminNewsletter() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback((p = 1) => {
    setLoading(true);
    api
      .get(`/newsletter?page=${p}&limit=50`)
      .then((res) => {
        setItems(res.data.data);
        setTotal(res.data.total);
        setPages(res.data.pages);
        setPage(res.data.page);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(1); }, [load]);

  const exportCsv = () => {
    const blob = new Blob([toCsv(items)], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nlcs-newsletter-page-${page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="page-title">
        <div><h1>Newsletter</h1><p>{total} subscriber{total === 1 ? '' : 's'} total.</p></div>
        <button className="btn btn-light" onClick={exportCsv} disabled={!items.length}>
          <Icon name="inbox" size={17} /> Export CSV (this page)
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="panel">
        {loading && <p className="muted-center">Loading…</p>}
        {!loading && (
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Email</th><th>Status</th><th>Source</th><th>Subscribed</th></tr></thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s._id}>
                    <td><strong>{s.email}</strong></td>
                    <td><span className={`status ${s.status === 'subscribed' ? 'status-replied' : 'status-archived'}`}>{s.status}</span></td>
                    <td>{s.source}</td>
                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={4} className="muted-center">No subscribers yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="pager">
          <button className="btn btn-light btn-sm" disabled={page <= 1} onClick={() => load(page - 1)}>Previous</button>
          <span>Page {page} of {pages}</span>
          <button className="btn btn-light btn-sm" disabled={page >= pages} onClick={() => load(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}
