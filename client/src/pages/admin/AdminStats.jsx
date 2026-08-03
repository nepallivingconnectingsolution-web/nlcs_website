
import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios.js';
import Icon from '../../components/Icon.jsx';
import Modal from '../../components/admin/Modal.jsx';

const empty = { label: '', value: '', suffix: '', order: 0, active: true };

export default function AdminStats() {
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
      .get('/stats/all')
      .then((res) => setItems(res.data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => { setForm(empty); setEditing('new'); };
  const openEdit = (s) => { setForm(s); setEditing(s); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = { ...form, value: Number(form.value), order: Number(form.order) || 0 };
    try {
      if (editing === 'new') {
        const res = await api.post('/stats', payload);
        setItems((prev) => [...prev, res.data.data]);
      } else {
        const res = await api.put(`/stats/${editing._id}`, payload);
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
      await api.delete(`/stats/${id}`);
      setItems((prev) => prev.filter((s) => s._id !== id));
      setConfirm(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="page-title">
        <div><h1>Homepage Stats</h1><p>The counters shown on the homepage (e.g. "60+ Projects Delivered").</p></div>
        <button className="btn btn-primary" onClick={openNew}><Icon name="plus" size={17} /> New stat</button>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="panel">
        {loading && <p className="muted-center">Loading…</p>}
        {!loading && (
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Order</th><th>Preview</th><th>Label</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s._id}>
                    <td>{s.order}</td>
                    <td><strong>{s.value}{s.suffix}</strong></td>
                    <td>{s.label}</td>
                    <td><span className={`status ${s.active ? 'status-replied' : 'status-archived'}`}>{s.active ? 'active' : 'hidden'}</span></td>
                    <td className="row-actions">
                      <button className="icon-btn" onClick={() => openEdit(s)} aria-label="Edit"><Icon name="edit" size={16} /></button>
                      <button className="icon-btn danger" onClick={() => setConfirm(s)} aria-label="Delete"><Icon name="trash" size={16} /></button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={5} className="muted-center">No stats yet — add your first one.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!editing} title={editing === 'new' ? 'New stat' : 'Edit stat'} onClose={() => setEditing(null)}>
        <form onSubmit={save} className="admin-form">
          <div className="two">
            <div className="field"><label>Value</label>
              <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="60" required /></div>
            <div className="field"><label>Suffix (optional)</label>
              <input value={form.suffix} onChange={(e) => setForm({ ...form, suffix: e.target.value })} placeholder="+ or % or /7" maxLength={10} /></div>
          </div>
          <div className="field"><label>Label</label>
            <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Projects Delivered" required maxLength={60} /></div>
          <div className="field"><label>Order</label>
            <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} /></div>
          <label className="checkbox"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Visible on homepage</label>
          <div className="modal-foot inline">
            <button type="button" className="btn btn-light" onClick={() => setEditing(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save stat'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!confirm} title="Delete stat?" onClose={() => setConfirm(null)}
        footer={<><button className="btn btn-light" onClick={() => setConfirm(null)}>Cancel</button><button className="btn btn-danger" onClick={() => remove(confirm._id)}>Delete</button></>}>
        {confirm && <p>Delete "<strong>{confirm.label}</strong>"? This cannot be undone.</p>}
      </Modal>
    </div>
  );
}