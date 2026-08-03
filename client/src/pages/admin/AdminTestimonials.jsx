import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios.js';
import Icon from '../../components/Icon.jsx';
import Modal from '../../components/admin/Modal.jsx';
import ImageUploadField from '../../components/admin/ImageUploadField.jsx';

const empty = { name: '', role: '', company: '', quote: '', rating: 5, avatar: '', featured: false, order: 0, active: true };

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get('/testimonials/all')
      .then((res) => setItems(res.data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => { setForm(empty); setEditing('new'); };
  const openEdit = (t) => { setForm(t); setEditing(t); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = { ...form, rating: Number(form.rating) || 5, order: Number(form.order) || 0 };
    try {
      if (editing === 'new') {
        const res = await api.post('/testimonials', payload);
        setItems((prev) => [...prev, res.data.data]);
      } else {
        const res = await api.put(`/testimonials/${editing._id}`, payload);
        setItems((prev) => prev.map((t) => (t._id === editing._id ? res.data.data : t)));
      }
      setEditing(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/testimonials/${id}`);
      setItems((prev) => prev.filter((t) => t._id !== id));
      setConfirm(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="page-title">
        <div><h1>Testimonials</h1><p>Manage client quotes shown on the homepage.</p></div>
        <button className="btn btn-primary" onClick={openNew}><Icon name="plus" size={17} /> New testimonial</button>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="panel">
        {loading && <p className="muted-center">Loading…</p>}
        {!loading && (
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Order</th><th>Name</th><th>Quote</th><th>Featured</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {items.map((t) => (
                  <tr key={t._id}>
                    <td>{t.order}</td>
                    <td><strong>{t.name}</strong><div className="cell-sub">{t.role}{t.company ? `, ${t.company}` : ''}</div></td>
                    <td className="cell-truncate">{t.quote}</td>
                    <td>{t.featured ? <span className="status status-replied">featured</span> : '—'}</td>
                    <td><span className={`status ${t.active ? 'status-replied' : 'status-archived'}`}>{t.active ? 'active' : 'hidden'}</span></td>
                    <td className="row-actions">
                      <button className="icon-btn" onClick={() => openEdit(t)} aria-label="Edit"><Icon name="edit" size={16} /></button>
                      <button className="icon-btn danger" onClick={() => setConfirm(t)} aria-label="Delete"><Icon name="trash" size={16} /></button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={6} className="muted-center">No testimonials yet — add your first one.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!editing} title={editing === 'new' ? 'New testimonial' : 'Edit testimonial'} onClose={() => setEditing(null)}>
        <form onSubmit={save} className="admin-form">
          <div className="two">
            <div className="field"><label>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="field"><label>Rating (1–5)</label>
              <input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} /></div>
          </div>
          <div className="two">
            <div className="field"><label>Role</label>
              <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Founder" /></div>
            <div className="field"><label>Company</label>
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Himalayan Handicrafts" /></div>
          </div>
          <div className="field"><label>Quote</label>
            <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} required maxLength={600} /></div>
          <div className="two">
            <ImageUploadField label="Avatar (optional)" value={form.avatar} onChange={(url) => setForm({ ...form, avatar: url })} />
            <div className="field"><label>Order</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} /></div>
          </div>
          <div className="checkrow">
            <label className="checkbox"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured on homepage</label>
            <label className="checkbox"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Visible</label>
          </div>
          <div className="modal-foot inline">
            <button type="button" className="btn btn-light" onClick={() => setEditing(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save testimonial'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!confirm} title="Delete testimonial?" onClose={() => setConfirm(null)}
        footer={<><button className="btn btn-light" onClick={() => setConfirm(null)}>Cancel</button><button className="btn btn-danger" onClick={() => remove(confirm._id)}>Delete</button></>}>
        {confirm && <p>Delete the testimonial from <strong>{confirm.name}</strong>? This cannot be undone.</p>}
      </Modal>
    </div>
  );
}
