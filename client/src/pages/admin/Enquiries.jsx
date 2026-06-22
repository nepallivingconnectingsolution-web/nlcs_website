import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios.js';
import Icon from '../../components/Icon.jsx';
import Modal from '../../components/admin/Modal.jsx';

const STATUSES = ['new', 'read', 'replied', 'archived'];

export default function Enquiries() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    const q = filter === 'all' ? '' : `?status=${filter}`;
    api
      .get(`/contacts${q}`)
      .then((res) => setItems(res.data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const changeStatus = async (id, status) => {
    try {
      await api.patch(`/contacts/${id}`, { status });
      setItems((prev) => prev.map((c) => (c._id === id ? { ...c, status } : c)));
      if (view?._id === id) setView({ ...view, status });
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/contacts/${id}`);
      setItems((prev) => prev.filter((c) => c._id !== id));
      setConfirm(null);
      setView(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="page-title">
        <div><h1>Enquiries</h1><p>Messages submitted through the contact form.</p></div>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="filters admin-filters">
        {['all', ...STATUSES].map((s) => (
          <button key={s} className={`filter ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s}
          </button>
        ))}
      </div>

      <div className="panel">
        {loading && <p className="muted-center">Loading…</p>}
        {!loading && items.length === 0 && <p className="muted-center">No enquiries here.</p>}
        {!loading && items.length > 0 && (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Service</th><th>Email</th><th>Status</th><th>Date</th><th></th></tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c._id}>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.service || '—'}</td>
                    <td>{c.email}</td>
                    <td>
                      <select
                        className={`status-select status-${c.status}`}
                        value={c.status}
                        onChange={(e) => changeStatus(c._id, e.target.value)}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="row-actions">
                      <button className="icon-btn" onClick={() => setView(c)} aria-label="View"><Icon name="eye" size={17} /></button>
                      <button className="icon-btn danger" onClick={() => setConfirm(c)} aria-label="Delete"><Icon name="trash" size={17} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View modal */}
      <Modal open={!!view} title="Enquiry details" onClose={() => setView(null)}>
        {view && (
          <div className="detail">
            <div className="detail-row"><span>Name</span><strong>{view.name}</strong></div>
            <div className="detail-row"><span>Email</span><a href={`mailto:${view.email}`}>{view.email}</a></div>
            <div className="detail-row"><span>Phone</span><strong>{view.phone || '—'}</strong></div>
            <div className="detail-row"><span>Service</span><strong>{view.service || '—'}</strong></div>
            <div className="detail-row"><span>Received</span><strong>{new Date(view.createdAt).toLocaleString()}</strong></div>
            <div className="detail-msg">
              <span>Message</span>
              <p>{view.message}</p>
            </div>
            <a className="btn btn-primary" href={`mailto:${view.email}`}>Reply by email <Icon name="arrowRight" size={16} className="arr" /></a>
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={!!confirm}
        title="Delete enquiry?"
        onClose={() => setConfirm(null)}
        footer={
          <>
            <button className="btn btn-light" onClick={() => setConfirm(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={() => remove(confirm._id)}>Delete</button>
          </>
        }
      >
        {confirm && <p>This will permanently delete the enquiry from <strong>{confirm.name}</strong>. This cannot be undone.</p>}
      </Modal>
    </div>
  );
}
