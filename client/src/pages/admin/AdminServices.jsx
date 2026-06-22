import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios.js';
import Icon from '../../components/Icon.jsx';
import Modal from '../../components/admin/Modal.jsx';

const ICONS = ['globe', 'smartphone', 'code', 'database', 'megaphone', 'lifebuoy'];
const empty = { title: '', summary: '', description: '', icon: 'globe', features: '', order: 0, active: true };

export default function AdminServices() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // service object or 'new'
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get('/services')
      .then((res) => setItems(res.data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => { setForm(empty); setEditing('new'); };
  const openEdit = (s) => {
    setForm({ ...s, features: (s.features || []).join(', ') });
    setEditing(s);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      order: Number(form.order) || 0,
      features: form.features ? form.features.split(',').map((f) => f.trim()).filter(Boolean) : [],
    };
    try {
      if (editing === 'new') {
        const res = await api.post('/services', payload);
        setItems((prev) => [...prev, res.data.data]);
      } else {
        const res = await api.put(`/services/${editing._id}`, payload);
        setItems((prev) => prev.map((s) => (s._id === editing._id ? res.data.data : s)));
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
      await api.delete(`/services/${id}`);
      setItems((prev) => prev.filter((s) => s._id !== id));
      setConfirm(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="page-title">
        <div><h1>Services</h1><p>Manage the services shown on your website.</p></div>
        <button className="btn btn-primary" onClick={openNew}><Icon name="plus" size={17} /> New service</button>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="panel">
        {loading && <p className="muted-center">Loading…</p>}
        {!loading && (
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Order</th><th>Title</th><th>Summary</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s._id}>
                    <td>{s.order}</td>
                    <td><div className="cell-icon"><Icon name={s.icon} size={18} /> <strong>{s.title}</strong></div></td>
                    <td className="cell-truncate">{s.summary}</td>
                    <td><span className={`status ${s.active ? 'status-replied' : 'status-archived'}`}>{s.active ? 'active' : 'hidden'}</span></td>
                    <td className="row-actions">
                      <button className="icon-btn" onClick={() => openEdit(s)} aria-label="Edit"><Icon name="edit" size={16} /></button>
                      <button className="icon-btn danger" onClick={() => setConfirm(s)} aria-label="Delete"><Icon name="trash" size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={!!editing}
        title={editing === 'new' ? 'New service' : 'Edit service'}
        onClose={() => setEditing(null)}
      >
        <form onSubmit={save} className="admin-form">
          <div className="field"><label>Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
          <div className="field"><label>Summary</label>
            <input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} required /></div>
          <div className="field"><label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="two">
            <div className="field"><label>Icon</label>
              <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
                {ICONS.map((i) => <option key={i}>{i}</option>)}
              </select></div>
            <div className="field"><label>Order</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} /></div>
          </div>
          <div className="field"><label>Features (comma-separated)</label>
            <input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Responsive design, SEO, ..." /></div>
          <label className="checkbox"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Visible on website</label>
          <div className="modal-foot inline">
            <button type="button" className="btn btn-light" onClick={() => setEditing(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save service'}</button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!confirm}
        title="Delete service?"
        onClose={() => setConfirm(null)}
        footer={<><button className="btn btn-light" onClick={() => setConfirm(null)}>Cancel</button><button className="btn btn-danger" onClick={() => remove(confirm._id)}>Delete</button></>}
      >
        {confirm && <p>Delete <strong>{confirm.title}</strong>? This cannot be undone.</p>}
      </Modal>
    </div>
  );
}
